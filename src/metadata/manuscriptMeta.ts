// Manuscrito: Obra literaria principal que agrupa capítulos, escenas y metadatos de autoría y publicación.
// Manuscript: Main literary work grouping chapters, scenes, and authorship/publication metadata.
// Metadata de la entidad Manuscript (Manuscrito)
// Buenas prácticas: nombres claros, documentación por campo, publicCode solo si es necesario

// Manuscrito/Obra: Definición estándar tipo World Anvil/Campfire
export const manuscriptMeta = {
  key: 'manuscript',
  dataPath: '/data/manuscripts',
  label: { es: 'Manuscritos', en: 'Manuscripts' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único de la obra.', en: 'Unique identifier for the work.' },
      type: 'text',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'title',
      label: { es: 'Título', en: 'Title' },
      description: { es: 'Título de la obra.', en: 'Work title.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'synopsis',
      label: { es: 'Sinopsis', en: 'Synopsis' },
      description: { es: 'Resumen breve de la obra.', en: 'Short summary of the work.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'genre',
      label: { es: 'Género', en: 'Genre' },
      description: { es: 'Género literario.', en: 'Literary genre.' },
      type: 'select',
      options: [
        { value: 'fantasy', label: { es: 'Fantasía', en: 'Fantasy' } },
        { value: 'scifi', label: { es: 'Ciencia Ficción', en: 'Science Fiction' } },
        { value: 'mystery', label: { es: 'Misterio', en: 'Mystery' } },
        { value: 'romance', label: { es: 'Romance', en: 'Romance' } },
        { value: 'historical', label: { es: 'Histórico', en: 'Historical' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'status',
      label: { es: 'Estado', en: 'Status' },
      description: { es: 'Estado de la obra.', en: 'Work status.' },
      type: 'select',
      options: [
        { value: 'draft', label: { es: 'Borrador', en: 'Draft' } },
        { value: 'inprogress', label: { es: 'En progreso', en: 'In Progress' } },
        { value: 'completed', label: { es: 'Completo', en: 'Completed' } },
        { value: 'published', label: { es: 'Publicado', en: 'Published' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'authors',
      label: { es: 'Autores', en: 'Authors' },
      description: { es: 'Autores principales y coautores.', en: 'Main and co-authors.' },
      type: 'array',
      itemType: 'relation',
      relation: 'author',
      editable: true,
      show: true
    },
    {
      key: 'coverImage',
      label: { es: 'Portada', en: 'Cover Image' },
      description: { es: 'Imagen de portada.', en: 'Cover image.' },
      type: 'image',
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
        es: 'Título principal del manuscrito.',
        en: 'Main title of the manuscript.'
      },
      type: 'text',
      editable: true,
      show: true,
  },
  {
    key: 'title',
    label: { es: 'Título', en: 'Title' },
    description: {
      es: 'Título principal del manuscrito.',
      en: 'Main title of the manuscript.'
    },
    type: 'text',
    editable: true,
    show: true,
  },
  {
    key: 'authorId',
    label: { es: 'Autor', en: 'Author' },
    description: {
      es: 'Referencia al autor principal de la obra (author.id).',
      en: 'Reference to the main author of the work (author.id).'
    },
    type: 'select',
    options: [], // Se poblará dinámicamente con los autores disponibles
    editable: true,
    show: true,
    dependency: 'author',
  },
  {
    key: 'genre',
    label: { es: 'Género', en: 'Genre' },
    description: {
      es: 'Género literario principal.',
      en: 'Main literary genre.'
    },
    type: 'select',
    options: [
      { es: 'Ciencia Ficción', en: 'Science Fiction' },
      { es: 'Fantasía', en: 'Fantasy' },
      { es: 'Misterio', en: 'Mystery' },
      { es: 'Romance', en: 'Romance' },
      { es: 'Histórico', en: 'Historical' },
      { es: 'Otro', en: 'Other' },
    ],
    editable: true,
    show: true,
  },
  {
    key: 'status',
    label: { es: 'Estado', en: 'Status' },
    description: {
      es: 'Estado actual del manuscrito (ej: borrador, completo, publicado).',
      en: 'Current status of the manuscript (e.g. draft, completed, published).'
    },
    type: 'select',
    options: [
      { es: 'Borrador', en: 'draft' },
      { es: 'Completo', en: 'completed' },
      { es: 'Publicado', en: 'published' },
    ],
    editable: true,
    show: true,
  },
  {
    key: 'synopsis',
    label: { es: 'Sinopsis', en: 'Synopsis' },
    description: {
      es: 'Resumen breve del manuscrito.',
      en: 'Brief summary of the manuscript.'
    },
    type: 'textarea',
    editable: true,
    show: true,
  },
  {
    key: 'createdAt',
    label: { es: 'Creado el', en: 'Created At' },
    description: {
      es: 'Fecha de creación del manuscrito.',
      en: 'Manuscript creation date.'
    },
    type: 'date',
    editable: false,
    show: true,
    // publicCode: 'creationDate',
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
  {
    key: 'wordCount',
    label: { es: 'Cantidad de Palabras', en: 'Word Count' },
    description: {
      es: 'Cantidad total de palabras del manuscrito.',
      en: 'Total word count of the manuscript.'
    },
    type: 'number',
    editable: false,
    show: true,
  },
  // Puedes agregar campos adicionales según la evolución del modelo
]
} as const;

export type ManuscriptMetaField = typeof manuscriptMeta.fields[number];
