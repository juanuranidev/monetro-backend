# Cuestionario para validar entidades antes de producción

Este documento replica el cuestionario acordado, las **respuestas de producto** que vayas dando en el chat (apartado *Tu respuesta* por bloque) y un resumen **inferido del código actual** para contrastar. Donde difieran, conviene ajustar modelo, migraciones o validaciones.

La última sección resume **brechas** entre lo que la base permite y lo que la aplicación asume.

---

## 1. Personas y cuentas

- ¿Un mismo usuario puede tener **muchas cuentas** (por ejemplo varias tarjetas o bancos), o en tu producto es **una cuenta por persona**?
- Cuando alguien cierra la cuenta / se da de baja del servicio, ¿qué debe pasar con sus **cuentas** y sus **movimientos**: borrarlos, conservarlos un tiempo, anonimizarlos? *(En tu modelo auto-hospedado esta pregunta es menos central.)*
- ¿Dos personas distintas pueden “compartir” una misma cuenta en el sistema (familia, empresa), o **siempre** una cuenta pertenece a **un solo** usuario?

### Tu respuesta (producto)

1. Un mismo usuario puede tener **todas las cuentas que quiera**.
2. No aplica un flujo de “suscripción / baja” tipo SaaS: cada persona **hostea su propia** instancia de la app de finanzas. El tema de borrar datos al “darse de baja” **no es central** para este modelo de despliegue.
3. **No**: una cuenta es **siempre de un solo usuario** (sin compartir cuenta entre personas).

### Inferido del código actual

- **Varias cuentas por usuario:** Sí. `accounts.user_id` es muchos-a-uno hacia `users`; no hay restricción de unicidad “un usuario = una cuenta”. **Alineado** con tu respuesta (1).
- **Baja / borrado de usuario:** La FK `accounts` → `users` usa `onDelete: RESTRICT`. No podés borrar un usuario mientras tenga cuentas; los movimientos tienen `onDelete: CASCADE` hacia usuario, pero el borrado queda bloqueado por las cuentas. Para instancia auto-hospedada puede ser aceptable; si algún día necesitás “reset” o borrar usuario, haría falta flujo explícito.
- **Cuenta compartida:** No está modelado; una cuenta = un `user_id`. **Alineado** con tu respuesta (3).

---

## 2. Dinero y moneda

- ¿Cada cuenta tiene **una sola moneda** que no cambia nunca, o en algún momento una cuenta podría cambiar de moneda?
- Para un **movimiento**, ¿la moneda debe ser **siempre la misma** que la de la cuenta donde está registrado, o imaginás transferencias en otra moneda?
- Los montos que guardás: ¿siempre son hasta **centavos** (dos decimales), o necesitás más precisión en algún caso?
- ¿Los montos pueden ser **negativos** en base de datos, o en tu lógica siempre son positivos y el “ingreso vs gasto” lo marca otro dato (tipo de movimiento)?

### Tu respuesta (producto)

1. El usuario debe poder **cambiar la moneda de una cuenta cuando quiera**.
2. La moneda del movimiento es **siempre la misma** que la de la cuenta (ej.: cuenta en dólares → no transacciones en pesos).
3. Montos con **solo dos decimales**; sin redondear hacia arriba/abajo en el sentido habitual — **solo truncar** a dos decimales.
4. Los montos pueden ser **positivos o negativos**.

### Inferido del código actual

- **Cambio de moneda de cuenta:** `UpdateAccountUseCase` ya admite `currencyCode` en el PATCH y actualiza `currency_id`. **Brecha:** los movimientos ya guardados siguen con su `currency_id` anterior; la API no migra ni bloquea el cambio si hay movimientos en otra moneda, así que puede quedar **inconsistente** con tu regla (2) hasta definir política (recalcular/bloquear/forzar conversión).
- **Moneda del movimiento vs cuenta:** **Alineado** con (2). Al crear/actualizar transacción se exige que coincida con la moneda de la cuenta.
- **Dos decimales:** Columna `decimal(10,2)` y validación de formato en DTO encajan con dos decimales. **Desalineado** con (3): `MoneyAmount` usa `Decimal#toDecimalPlaces(2)` con redondeo por defecto de **decimal.js** (no truncamiento explícito).
- **Signo del monto:** **Desalineado** con (4). Hoy `MoneyAmount.fromString` rechaza valores `< 0` y el DTO de creación solo admite patrones sin signo negativo; el tipo ingreso/gasto se expresa con `transaction_type` (`INCOME` / `EXPENSE`).

---

## 3. Movimientos (transacciones)

- ¿Un usuario puede tener **muchos** movimientos a lo largo del tiempo (sin límite práctico)?
- ¿Todo movimiento pertenece **siempre** a **una cuenta concreta**, o existen movimientos “sueltos” sin cuenta?
- Además de la cuenta: ¿te sirve guardar **explícitamente** qué usuario hizo el movimiento, o alcanza con saberlo por la cuenta?
- La **fecha/hora del movimiento** (la del negocio, no la de “cuándo lo cargué”): ¿qué granularidad necesitás?
- ¿La **descripción** puede estar vacía en la vida real, o siempre debería tener texto?
- El tipo de movimiento (por ejemplo ingreso/gasto): ¿es **siempre uno** por movimiento y viene de una **lista fija** en base de datos con cómo se muestra en UI y cómo se usa en código?
- ¿Las **fechas** deben seguir un **formato internacional** único y poder parametrizar la **zona horaria** vía `.env`?

### Tu respuesta (producto)

1. Un usuario puede tener **todos los movimientos que quiera**, repartidos en las cuentas que quiera; **sin tope**.
2. **Todo** movimiento va **siempre** ligado a **una cuenta**.
3. Preferís **deducir el usuario desde la cuenta**. *(Análisis técnico debajo.)*
4. Hace falta **día, hora, minutos y segundos** para la fecha del movimiento.
5. La **descripción puede estar vacía**.
6. El tipo ingreso/gasto debe vivir en una **tabla parametrizada** en BD; cada tipo con **nombre en español** (frontend) y **identificador/nombre en inglés** para código/API.
7. Todas las fechas en **formato internacional** coherente; la **zona horaria** debe poder parametrizarse desde **`.env`**.

### Inferido del código actual

- **Volumen / cuenta obligatoria:** **Alineado** con (1) y (2): sin límite aplicado; `account_id` obligatorio y los flujos validan cuenta del usuario.
- **`transactions.user_id` vs derivar por cuenta:** **Decisión de producto:** **eliminar `user_id`** de transacciones y obtener el usuario siempre con join `transactions → accounts → user`. *(Pendiente de implementación en entidades, repositorios, casos de uso y migración SQL.)* Hasta hacerlo, la tabla sigue llevando la columna y la API la rellena.
- **Fecha con hora:** **Desalineado** con (4). `record_date` es tipo **`date`** (solo día) y los DTO usan fecha ISO sin tiempo.
- **Descripción:** **Desalineado** con (5). Creación exige texto no vacío (`@MinLength(1)`).
- **Tipos parametrizados + ES/EN:** Parcial. Ya existe catálogo `transaction_types` con **`code`** único; **no** hay columnas dedicadas para etiqueta en español frente a inglés (solo el código corto).
- **Formato internacional + TZ en `.env`:** Por definir en código. Convención habitual: persistir instantes en **UTC** (`timestamptz`), API en **ISO 8601**, y una variable tipo **`APP_TIMEZONE`** (o documentar `TZ`) para interpretar entradas sin offset y para presentación/exportación según instancia.

---

## 4. Categorías

- ¿Las categorías son **por usuario** (cada uno las arma), hay categorías **globales** que ven todos, o **las dos cosas**?
- ¿Un usuario puede tener **muchas** categorías?
- Para **un mismo movimiento**, ¿quieren poder marcar **varias categorías a la vez** (como etiquetas), o **solo una** categoría principal?
- Si se pueden varias: ¿todas tienen el **mismo rol**, o hay una “principal” y otras secundarias?
- ¿Cómo representar **nombre + emoji** en persistencia y API?

### Tu respuesta (producto)

1. **Solo categorías del usuario:** antes había globales y por usuario; **ahora todas deben ser solo del usuario**. **No** debe haber categorías globales precargadas.
2. Un usuario puede tener **todas las categorías que quiera** (sin tope práctico impuesto por negocio).
3. Un movimiento puede tener **varias categorías** a la vez.
4. **Sin categoría principal:** todas las categorías asignadas al mismo movimiento van **al mismo nivel** (equivalentes entre sí).

### Decisión técnica — emoji (nombre + emoji)

- **Recomendación:** guardar el emoji **en texto Unicode directamente en la base** (columna existente **`icon`**, nullable): la API devuelve ese string y el cliente lo renderiza tal cual. PostgreSQL con codificación UTF-8 lo soporta bien; `varchar(255)` alcanza para secuencias habituales (incluso compuestas tipo banderas).
- **Por qué no solo alias** (`:smile:`, `cart`, etc.) como única fuente de verdad: obliga a acoplar cada cliente a la misma tabla/librería de mapeo y versionarla; duplica mantenimiento respecto a guardar el glifo ya resuelto.
- **Nota:** el seed histórico usaba claves tipo `cart`; **ya no hay seed de categorías**. Las categorías solo las crea el usuario vía API.

### Inferido del código actual

- **Solo categorías del usuario:** Implementado: **`user_id` obligatorio** en entidad TypeORM, seed de categorías globales **eliminado**, consultas solo `user_id = :userId`. Quien tenga datos viejos con `user_id` NULL debe migrarlos o borrarlos antes de aplicar el esquema.
- **Muchas categorías / varias por movimiento / mismo nivel:** **Alineado** con (2)(3)(4) en modelo relacional (puente `transaction_categories`; sin columna “principal”).
- **Emoji en `icon`:** Validación en `CreateCategoryRequestDto`: si se envía `icon`, debe ser **solo emoji Unicode** (`emoji-regex`); claves tipo `cart` rechazadas.

---

## 5. Reglas automáticas

- ¿Las reglas de categorización (o similares) son **por usuario** cada uno arma las suyas?
- Una regla: ¿puede aplicar **varias categorías** al movimiento cuando coincide, o solo una?
- Al definir una regla, ¿los filtros opcionales (cuenta origen, categoría origen, tipo de movimiento) reflejan bien tu negocio, o falta algo que suele condicionar una regla (monto, texto, fecha)?
- Cuando una regla coincide con un movimiento, ¿el usuario debe poder **ignorar** esa sugerencia o siempre se aplica?

### Tu respuesta (producto)

1. Las reglas son **de cada usuario**; cada uno las arma **solo para sí** en su instancia.
2. Una regla puede asignar **varias categorías** al movimiento cuando aplica; **tope deseado: hasta 5** categorías efecto por regla.
3. Para el **MVP**, los datos/filtros actuales del modelo **alcanzan** (sin pedir monto ni rango de fechas por ahora).
4. Cuando una regla coincide con un movimiento, debe **aplicarse automáticamente** lo que define la regla (**sin** flujo de “ignorar” como parte del diseño).

### Inferido del código actual

- **Por usuario:** **Alineado** con (1): `rules.user_id` obligatorio con `onDelete: CASCADE`.
- **Varias categorías al aplicar + tope 5:** Modelo M2M **alineado**; validación **implementada**: `effectCategoryIds` con máximo **5** en DTOs (`ArrayMaxSize`) y en `assertRuleTypeBaseShape` tras deduplicar en casos de uso.
- **Filtros MVP:** **Alineado** con (3) para alcance actual.
- **Aplicación automática:** **Desalineado** con (4) en implementación: sigue sin haber motor que ejecute reglas al crear/editar movimientos (solo CRUD de reglas).

---

## 6. Catálogos del sistema (monedas, tipos de regla, etc.)

- Las **monedas**, **tipos de movimiento**, **tipos y bases de reglas**: ¿los cargás vos como administrador y los usuarios solo eligen, o alguno de esos catálogos debería ser editable por cada usuario?
- ¿Necesitás **auditoría** (quién cambió qué y cuándo) sobre esos catálogos?

### Tu respuesta (producto)

1. Los usuarios **solo eligen** entre lo que viene cargado en la **seed** (no crean/editan esos catálogos desde la app).
2. Lo ideal es que esos datos los cambie **solo quien tenga acceso a la base de datos** (cuando haga falta), no como catálogo editable desde la app por usuarios finales. Al ser **una instancia por quien deploya**, **no** hace falta **auditoría** de cambios en catálogos del sistema (sin historial formal ni “quién tocó qué”).

### Nota — qué era “auditoría” aquí

Registro explícito de **quién** modificó filas de catálogo del sistema, **cuándo** y a veces valor anterior/nuevo. Por decisión de producto (punto 2) **no** es requisito para este modelo auto-hospedado.

### Inferido del código actual

- **Solo elección desde seed / sin edición por usuario final:** **Alineado** con tu respuesta (1): catálogos sin `user_id`; usuarios referencian por código en API; seed carga monedas, tipos de transacción y catálogos de reglas.
- **Auditoría de catálogos:** **Alineado** con tu respuesta (2): **no** se busca auditoría; timestamps parciales en `rule_types` / `rule_bases` pueden quedar sin extender el modelo “por trazabilidad admin”.

---

## 7. Usuarios, login y datos personales

- El **correo**: ¿debe ser único en todo el sistema (una cuenta por correo)?
- ¿Guardás **contraseña** propia además de un proveedor externo (`auth_id`): en producción, ¿siempre las dos, o solo una forma de login?
- ¿Nombre, imagen y otros datos del perfil pueden quedar **vacíos** o siempre querés nombre obligatorio?

### Tu respuesta (producto)

1. El **correo debe ser único** en la instancia (una cuenta por email).
2. En **producción** el login es **solo email + contraseña** (sin flujo de proveedor OAuth como requisito).
3. El **nombre del perfil no puede quedar vacío**; la **imagen / avatar sí puede faltar** (opcional).

### Inferido del código actual

- **Email único:** **Alineado** con (1): columna `unique` y `existsByEmail` en registro.
- **Solo email + contraseña:** **Alineado** con (2) para el flujo principal (`RegisterUseCase`, JWT). Persisten columnas `auth_id` / huecos para otros flujos; si no se usarán nunca, podrían simplificarse más adelante, pero no contradice el producto mientras no se exponga OAuth.
- **Nombre obligatorio e imagen opcional:** **Alineado** con (3): `RegisterRequestDto` exige nombre; entidad usuario con `image` nullable.

---

## 8. Integridad y límites prácticos

- ¿Te preocupa que, por un error técnico, exista un movimiento cuyo usuario **no coincida** con el dueño de la cuenta, o confiás solo en la aplicación para que no pase?
- ¿Algún texto tiene un largo máximo real en tu negocio (nombres muy largos, descripciones, reglas) que deba reflejarse en la base?

### Tu respuesta (producto)

1. Esa casuística **debe validarse en los casos de uso** (no confiar solo en que la base “no se equivoque”).
2. Los **límites máximos de textos** deben estar **alineados** entre entidades/DTOs del sistema, con valores **coherentes** (no longitudes “al azar” entre tablas y validadores).

### Inferido del código actual

- **Integridad cuenta ↔ usuario en movimientos:** Crear y actualizar transacción ya resuelven la cuenta con `accountRepository.findOwnedByUser(accountId, userId)`, así que **solo puede usarse una cuenta del usuario autenticado**. El riesgo que queda es la columna redundante `transactions.user_id` si algún camino persistiera un valor distinto del dueño de la cuenta; **decisión previa:** eliminar esa columna y resolver usuario vía `account`. **Hasta entonces**, conviene en casos de uso (create/update) **afirmar explícitamente** `account.userId === input.userId` tras cargar la cuenta y, al guardar, usar siempre ese `userId` (o validar consistencia si el repositorio sigue escribiendo ambos campos).
- **Longitudes de texto:** Hoy hay `varchar`/`MaxLength` dispersos (255, 320, 512, 1024, 2048, etc.). **Desalineado** con tu respuesta (2): falta una **tabla única de límites** (constantes compartidas) referenciada desde entidades TypeORM y `class-validator`, y revisión para que ningún DTO permita más que la columna correspondiente.

---

## 9. Análisis de brechas y recomendaciones

| Tema | Estado | Notas |
|------|--------|--------|
| Borrado de usuario | Riesgo operativo | `RESTRICT` en cuentas impide borrar usuario con datos; definir política (soft delete, borrado en cascada explícito por servicio, anonimización). |
| `transactions.user_id` (redundante con cuenta) | **Decisión:** eliminar columna | Implementar: migración + quitar relación TypeORM + join `transactions → accounts` donde haga falta filtrar por usuario; actualizar `onDelete` si aplica. |
| Montos negativos vs tipo INCOME/EXPENSE | Desalineado (producto Bloque 2) | Código fuerza monto ≥ 0 y usa tipo para ingreso/gasto. Si el producto exige signos: relajar `MoneyAmount`/DTOs y decidir si `transaction_type` sigue siendo la fuente de verdad o queda redundante. |
| Truncar vs redondear a 2 decimales | Desalineado (producto Bloque 2) | Cambiar `MoneyAmount` (y coherencia en persistencia) para truncar explícitamente. |
| Cambio de moneda de cuenta | Parcial | PATCH ya existe; falta política cuando hay movimientos (migrar `transactions.currency_id`, bloquear cambio, o job de corrección). |
| Reglas → movimientos (motor automático) | Hueco funcional (producto Bloque 5) | Persistencia + CRUD listos; falta ejecutar reglas al crear/editar transacciones y aplicar efectos sin “ignorar”. |
| Reglas: máximo 5 categorías efecto | Implementado | `ArrayMaxSize(5)` en create/update DTOs + `assertRuleTypeBaseShape`. |
| Catálogo del sistema / auditoría | Sin requisito (producto Bloque 6) | Cambios vía DB/seed si hace falta; **no** implementar auditoría de catálogos. |
| Fecha del movimiento con hora | Desalineado (producto Bloque 3) | Migrar `record_date` de `date` a `timestamptz`; API ISO 8601; política UTC vs TZ `.env`. |
| Descripción obligatoria | Desalineado (producto Bloque 3) | Permitir cadena vacía en DTOs/dominio y coherencia con columna `varchar`. |
| `transaction_types`: español + inglés | Desalineado (producto Bloque 3) | Ampliar catálogo (p. ej. `display_name_es`, mantener `code` estable en inglés) + seed/API para listados. |
| Zona horaria configurable (.env) | Por implementar | `ConfigModule`: variable dedicada; documentar cómo se interpretan instants sin offset del cliente. |
| Categorías solo por usuario (sin globales) | Implementado | Entity NOT NULL + repo + seed categorías quitado. BD existente: migración/manual para filas con `user_id` NULL. |
| Emoji en categorías | Implementado | `CreateCategoryRequestDto` + `@IsEmojiUnicodeOnly()` (`emoji-regex`). |
| Usuarios / login / perfil (Bloque 7) | Alineado | Email único; login email+contraseña; nombre obligatorio e imagen opcional. `auth_id` en esquema es opcional a futuro. |
| Categorías múltiples sin “principal” | Alineado | Sin cambio pedido. |
| Integridad cuenta–usuario en transacciones (Bloque 8) | Reforzar en use cases / modelo | Ya `findOwnedByUser` en create/update; objetivo: assert explícito y **quitar** `transactions.user_id`; ajustar repos (`findOwnedByUser` por join cuenta). |
| Límites de texto unificados (Bloque 8) | Pendiente | Definir constantes compartidas (p. ej. `SHORT_NAME`, `DESCRIPTION`, `URL`) y aplicar en columnas TypeORM + DTOs + Swagger. |

**Próximo paso recomendado:** Revisar fila por fila esta tabla con tus respuestas de negocio donde difieran del “Inferido”; cada diferencia se traduce en un ítem de cambio (migración SQL, constraint, o caso de uso).
