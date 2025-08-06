// Escena: Unidad narrativa básica que representa un momento, acción o interacción específica dentro de un capítulo o manuscrito.
// Scene: Basic narrative unit representing a specific moment, action, or interaction within a chapter or manuscript.
// Metadata de la entidad Scene (Escena)
// Buenas prácticas: nombres claros, multilenguaje, documentación por campo

// Escena/Evento: Definición estándar tipo World Anvil/Campfire
export const sceneMeta = {
  key: 'scene',
  label: { es: 'Escenas', en: 'Scenes' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único de la escena/evento.', en: 'Unique identifier for the scene/event.' },
      type: 'text',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'title',
      label: { es: 'Título', en: 'Title' },
      description: { es: 'Título de la escena/evento.', en: 'Title of the scene/event.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'summary',
      label: { es: 'Resumen', en: 'Summary' },
      description: { es: 'Resumen breve.', en: 'Short summary.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'type',
      label: { es: 'Tipo', en: 'Type' },
      description: { es: 'Tipo de escena/evento.', en: 'Type of scene/event.' },
      type: 'select',
      options: [
        { value: 'scene', label: { es: 'Escena', en: 'Scene' } },
        { value: 'event', label: { es: 'Evento', en: 'Event' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'date',
      label: { es: 'Fecha', en: 'Date' },
      description: { es: 'Fecha de la escena/evento.', en: 'Date of the scene/event.' },
      type: 'date',
      editable: true,
      show: true
    },
    {
      key: 'characters',
      label: { es: 'Personajes', en: 'Characters' },
      description: { es: 'Personajes involucrados.', en: 'Characters involved.' },
      type: 'array',
      itemType: 'relation',
      relation: 'character',
      editable: true,
      show: true
    },
    {
      key: 'location',
      label: { es: 'Localización', en: 'Location' },
      description: { es: 'Lugar donde ocurre.', en: 'Where it happens.' },
      type: 'text',
      editable: true,
      show: true
    },
    {
      key: 'manuscript',
      label: { es: 'Manuscrito', en: 'Manuscript' },
      description: { es: 'Obra a la que pertenece.', en: 'Work this scene belongs to.' },
      type: 'relation',
      relation: 'manuscript',
      editable: true,
      show: true
    },
    {
      key: 'tags',
      label: { es: 'Etiquetas', en: 'Tags' },
      description: { es: 'Palabras clave para organización.', en: 'Keywords for organization.' },
      type: 'array',
      itemType: 'text',
      editable: true,
      show: true
    },
    {
      key: 'createdAt',
      label: { es: 'Creado el', en: 'Created At' },
      description: { es: 'Fecha de creación.', en: 'Creation date.' },
      type: 'datetime',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'updatedAt',
      label: { es: 'Actualizado el', en: 'Updated At' },
      description: { es: 'Última actualización.', en: 'Last update.' },
      type: 'datetime',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'visibility',
      label: { es: 'Visibilidad', en: 'Visibility' },
      description: { es: 'Público o privado.', en: 'Public or private.' },
      type: 'select',
      options: [
        { value: 'public', label: { es: 'Público', en: 'Public' } },
        { value: 'private', label: { es: 'Privado', en: 'Private' } }
      ],
      editable: true,
      show: true
    },
  {
    key: 'title',
    label: { es: 'Título', en: 'Title' },
    description: {
      es: 'Título de la escena.',
      en: 'Scene title.'
    },
    type: 'text',
    editable: true,
    show: true,
  },
  {
    key: 'summary',
    label: { es: 'Resumen', en: 'Summary' },
    description: {
      es: 'Resumen breve de la escena.',
      en: 'Brief summary of the scene.'
    },
    type: 'textarea',
    editable: true,
    show: true,
  },
  {
    key: 'order',
    label: { es: 'Orden', en: 'Order' },
    description: {
      es: 'Posición de la escena dentro del capítulo o manuscrito.',
      en: 'Position of the scene within the chapter or manuscript.'
    },
    type: 'number',
    editable: true,
    show: true,
  },
  {
    key: 'createdAt',
    label: { es: 'Creado el', en: 'Created At' },
    description: {
      es: 'Fecha de creación de la escena.',
      en: 'Scene creation date.'
    },
    type: 'date',
    editable: false,
    show: true,
  },
  {
    key: 'updatedAt',
    label: { es: 'Última Modificación', en: 'Last Modified' },
    description: {
      es: 'Última fecha de modificación.',
      en: 'Last modification date.'
    },
    type: 'date',
    editable: false,
    show: true,
  },
  // Puedes agregar campos adicionales según la evolución del modelo
]
} as const;

export type SceneMetaField = typeof sceneMeta.fields[number];
