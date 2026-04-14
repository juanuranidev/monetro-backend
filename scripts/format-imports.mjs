import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const ENTITY_PREFIXES = [
  'account',
  'auth',
  'category',
  'core',
  'currency',
  'database',
  'health',
  'rule',
  'shared',
  'transaction',
  'user',
];

/**
 * @param {string} specifier
 * @returns {string | null}
 */
function getEntityPrefix(specifier) {
  for (const name of ENTITY_PREFIXES) {
    const prefix = `@${name}`;
    if (specifier === prefix || specifier.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  return null;
}

/**
 * @param {string} bindingText
 * @param {string} specifier
 * @returns {{ order: number; groupKey: string; entity: string | null }}
 */
function classify(specifier, bindingText) {
  if (specifier === 'crypto') {
    return { order: 0, groupKey: 'crypto', entity: null };
  }
  const entity = getEntityPrefix(specifier);
  if (entity !== null) {
    return { order: 3, groupKey: entity, entity };
  }
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return { order: 4, groupKey: specifier, entity: null };
  }
  return { order: 2, groupKey: specifier, entity: null };
}

/**
 * @param {string} snippet
 * @returns {{ binding: string; specifier: string } | null}
 */
function parseImportNode(snippet) {
  const trimmed = snippet.trimEnd();
  const match = trimmed.match(/^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;?$/);
  if (match === null) {
    return null;
  }
  return { binding: match[1], specifier: match[2] };
}

/**
 * @param {string} specifier
 * @returns {boolean}
 */
function isNestJsScopedPackage(specifier) {
  return specifier.startsWith('@nestjs/');
}

/**
 * Splits the inside of `{ ... }` in a named import (comma-separated, trim only).
 * @param {string} inner
 * @returns {string[]}
 */
function splitNamedSpecifiers(inner) {
  return inner
    .split(',')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .filter((part) => part.length > 0);
}

/**
 * Sorts identifiers inside `{ ... }` by ascending name length, then localeCompare.
 * Only applies to `import { ... }` / `import type { ... }` with 2+ specifiers.
 * @param {string} snippet
 * @returns {string}
 */
function sortNamedBindingsInImport(snippet) {
  const trimmed = snippet.trimEnd();
  const match = trimmed.match(
    /^(\s*import\s+(?:type\s+)?)(\{[\s\S]*\})(\s+from\s+)(['"])([^'"]+)\4(\s*;?)\s*$/,
  );
  if (match === null) {
    return snippet;
  }
  const [, lead, braceBlock, fromKw, quote, specifier, semi] = match;
  const inner = braceBlock.slice(1, -1);
  if (!inner.includes(',') && !inner.includes('\n')) {
    return snippet;
  }
  const specs = splitNamedSpecifiers(inner);
  if (specs.length < 2) {
    return snippet;
  }
  const sorted = [...specs].sort((a, b) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return a.localeCompare(b);
  });
  const isMultiline = braceBlock.includes('\n');
  if (!isMultiline) {
    const innerSingle = `${sorted.join(', ')}`;
    return `${lead}{ ${innerSingle} }${fromKw}${quote}${specifier}${quote}${semi}`;
  }
  const indentMatch = inner.match(/\n(\s*)\S/);
  const innerIndent = indentMatch !== null ? indentMatch[1] : '  ';
  const closingIndentMatch = trimmed.match(/\n(\s*)\}\s*from\s/);
  const closingIndent =
    closingIndentMatch !== null ? closingIndentMatch[1] : '';
  const lines = sorted.map((s) => `${innerIndent}${s}`).join(',\n');
  return `${lead}{\n${lines},\n${closingIndent}}${fromKw}${quote}${specifier}${quote}${semi}`;
}

/**
 * @param {import('typescript').ImportDeclaration} a
 * @param {import('typescript').SourceFile} sourceFile
 */
function compareDeclarations(aDecl, bDecl, sourceFile) {
  const aText = sliceImport(sourceFile, aDecl);
  const bText = sliceImport(sourceFile, bDecl);
  const aParsed = parseImportNode(aText);
  const bParsed = parseImportNode(bText);
  if (aParsed === null || bParsed === null) {
    return 0;
  }
  const aClass = classify(aParsed.specifier, aParsed.binding);
  const bClass = classify(bParsed.specifier, bParsed.binding);
  if (aClass.order !== bClass.order) {
    return aClass.order - bClass.order;
  }
  if (aClass.order === 3) {
    if (aClass.groupKey !== bClass.groupKey) {
      return aClass.groupKey.localeCompare(bClass.groupKey);
    }
    return aParsed.binding.length - bParsed.binding.length;
  }
  if (aClass.order === 2 && bClass.order === 2) {
    const aNest = isNestJsScopedPackage(aParsed.specifier);
    const bNest = isNestJsScopedPackage(bParsed.specifier);
    if (aNest !== bNest) {
      return aNest ? -1 : 1;
    }
    const lenDiff = aParsed.binding.length - bParsed.binding.length;
    if (lenDiff !== 0) {
      return lenDiff;
    }
    return aParsed.specifier.localeCompare(bParsed.specifier);
  }
  if (aClass.groupKey !== bClass.groupKey) {
    return aClass.groupKey.localeCompare(bClass.groupKey);
  }
  return aParsed.binding.length - bParsed.binding.length;
}

/**
 * @param {import('typescript').SourceFile} sourceFile
 * @param {import('typescript').ImportDeclaration} node
 */
function sliceImport(sourceFile, node) {
  return sourceFile.text.substring(node.getStart(sourceFile, false), node.end);
}

/**
 * @param {number} order
 * @returns {boolean}
 */
function isExternalDependencyOrder(order) {
  return order === 0 || order === 2;
}

/**
 * @param {import('typescript').ImportDeclaration[]} imports
 * @param {import('typescript').SourceFile} sourceFile
 */
function formatImportBlock(imports, sourceFile) {
  const sorted = [...imports].sort((a, b) => compareDeclarations(a, b, sourceFile));
  const chunks = [];
  /** @type {{ order: number; groupKey: string; entity: string | null } | null} */
  let prevClass = null;
  /** @type {string | null} */
  let prevSpecifier = null;
  for (let i = 0; i < sorted.length; i += 1) {
    const decl = sorted[i];
    const text = sliceImport(sourceFile, decl);
    const parsed = parseImportNode(text);
    if (parsed === null) {
      chunks.push(text);
      continue;
    }
    const cls = classify(parsed.specifier, parsed.binding);
    const nestJsGroupNoBreak =
      prevSpecifier !== null &&
      isNestJsScopedPackage(prevSpecifier) &&
      isNestJsScopedPackage(parsed.specifier);
    const separateDistinctExternalPackages =
      prevClass !== null &&
      prevSpecifier !== null &&
      isExternalDependencyOrder(prevClass.order) &&
      isExternalDependencyOrder(cls.order) &&
      prevSpecifier !== parsed.specifier &&
      !nestJsGroupNoBreak;
    const isNewParagraph =
      prevClass !== null &&
      (separateDistinctExternalPackages ||
        (cls.order === 3 && prevClass.order < 3) ||
        (cls.order === 3 &&
          prevClass.order === 3 &&
          cls.groupKey !== prevClass.groupKey) ||
        (cls.order === 4 && prevClass.order !== 4));
    if (isNewParagraph) {
      chunks.push('\n\n');
    } else if (i > 0) {
      chunks.push('\n');
    }
    chunks.push(sortNamedBindingsInImport(text));
    prevClass = cls;
    prevSpecifier = parsed.specifier;
  }
  return chunks.join('');
}

/**
 * @param {string} filePath
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const statements = sourceFile.statements;
  let importCount = 0;
  while (importCount < statements.length && ts.isImportDeclaration(statements[importCount])) {
    importCount += 1;
  }
  if (importCount === 0) {
    return false;
  }
  const imports = statements.slice(0, importCount).filter((s) => ts.isImportDeclaration(s));
  const prefix = sourceFile.text.substring(0, imports[0].getFullStart());
  const lastImport = imports[imports.length - 1];
  const suffix = sourceFile.text.substring(lastImport.end);
  const newBlock = formatImportBlock(imports, sourceFile);
  const next = `${prefix}${newBlock}${suffix}`;
  if (next !== content) {
    fs.writeFileSync(filePath, next, 'utf8');
    return true;
  }
  return false;
}

function walkTs(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walkTs(p, out);
    } else if (name.endsWith('.ts')) {
      out.push(p);
    }
  }
  return out;
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isFileUnderDir(filePath, dirPath) {
  const normalizedFile = path.normalize(path.resolve(filePath));
  const normalizedDir = path.normalize(path.resolve(dirPath));
  return (
    normalizedFile === normalizedDir ||
    normalizedFile.startsWith(normalizedDir + path.sep)
  );
}

const argvTsPaths = process.argv.slice(2).filter((arg) => arg.endsWith('.ts'));
const resolvedSrc = path.resolve(SRC);
const files =
  argvTsPaths.length > 0
    ? [...new Set(argvTsPaths.map((p) => path.resolve(process.cwd(), p)))].filter(
        (p) => fs.existsSync(p) && isFileUnderDir(p, resolvedSrc),
      )
    : walkTs(SRC);
let n = 0;
for (const f of files) {
  if (processFile(f)) {
    n += 1;
  }
}
if (n > 0 || argvTsPaths.length === 0) {
  console.log(`Formatted imports in ${n} file(s).`);
}
