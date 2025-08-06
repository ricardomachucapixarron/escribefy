# Decisión de Convención de Nombres de Campos de Metadata / Metadata Field Naming Convention Decision

---

## Propósito / Purpose
Para asegurar la consistencia, mantenibilidad y escalabilidad en todas las entidades y formularios de la aplicación NovelCraft, adoptamos un glosario global de campos y una convención estricta de nombres para todos los campos de metadata.

To ensure consistency, maintainability, and scalability across all entities and forms in the NovelCraft application, we adopt a global field glossary and strict naming convention for all metadata fields.

---

## Resumen de la Decisión / Decision Summary

- Todos los nombres de campos (keys) usados en la metadata de entidades (ej: escenas, personajes, sistemas, etc.) deben definirse en un único archivo central: `fieldGlossary.ts`.
- Cada archivo de metadata de entidad (ej: `sceneMeta.ts`, `characterMeta.ts`) debe referenciar los campos a través de este glosario, nunca con strings "hardcodeados".
- Esto garantiza que campos como `createdAt` siempre se escriban igual en todas las entidades, evitando problemas como `createdAt` vs `timecreated`.

All field names (keys) used in entity metadata (e.g., scenes, characters, systems, etc.) must be defined in a single, central glossary file: `fieldGlossary.ts`.
Every entity metadata file (e.g., `sceneMeta.ts`, `characterMeta.ts`) must reference field keys via this glossary, never by hardcoded strings.
This guarantees that fields like `createdAt` are always written the same way across all entities, preventing issues like `createdAt` vs `timecreated`.

---

## Convención de Referencias entre Entidades / Entity Reference Convention

- Cuando una entidad referencia a otra (por ejemplo, un manuscrito a su autor), se debe usar el nombre de la entidad destino en singular y el sufijo `Id`.
- Ejemplo: Para referenciar a la entidad `author`, el campo debe llamarse `authorId` y su valor debe ser el `id` de la entidad referenciada.
- Esta convención aplica a todas las entidades relacionadas (ej: `characterId`, `organizationId`, etc).
- El campo debe ser de tipo `select` en la metadata para permitir la selección dinámica.
- La entidad referenciada debe llamarse de forma clara y semántica (ej: `author`, no `userProfile`).

---

## Detalles de Implementación / Implementation Details

### 1. Glosario de Campos / Field Glossary
- Archivo / File: `src/metadata/fieldGlossary.ts`
- Ejemplo / Example:
  ```ts
  export const FIELD = {
    id: 'id',
    title: 'title',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    authorId: 'authorId',
    status: 'status',
    genre: 'genre',
    wordCount: 'wordCount',
    // ...more fields as needed
  } as const;
  ```
- TypeScript types are derived from this object for type safety and autocompletion.

### 2. Usage in Entity Metadata
- Example (`sceneMeta.ts`):
  ```ts
  import { FIELD } from './fieldGlossary';

  export const sceneMeta = [
    { key: FIELD.id, label: 'Scene ID', ... },
    { key: FIELD.title, label: 'Title', ... },
    { key: FIELD.createdAt, label: 'Created At', ... },
    // ...
  ];
  ```

### 3. Naming Conventions
- Use **lowerCamelCase** for all field names (e.g., `createdAt`, `updatedAt`, `authorId`).
- Prefer explicit, universal names: `id`, `title`, `description`, `createdAt`, etc.
- Any new field must be added to the glossary before being used in entity metadata.

### 4. Review & Validation
- Code reviews must reject any metadata or model using a field name not present in the glossary.
- (Optional) Linters or scripts may be used to enforce this automatically.

### 5. Documentation
- The glossary should be commented or accompanied by a markdown file describing the purpose and usage of each field.

---

## Rationale
- **Consistency:** Prevents naming drift and typos across the codebase.
- **Refactorability:** Changing a field name is safe and easy.
- **Type Safety:** TypeScript can enforce correct usage throughout the system.
- **Scalability:** New entities and fields can be added with minimal risk of collision or inconsistency.

---

## Example Directory Structure
```
src/metadata/
  fieldGlossary.ts
  sceneMeta.ts
  characterMeta.ts
  systemMeta.ts
  ...
```

---

## Authors & Reviewers
- Decision by: Core Engineering Team
- Date: 2025-08-06
- Applies to: All current and future entities in NovelCraft
