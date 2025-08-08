// Capítulo: Unidad narrativa principal dentro de un manuscrito
// Chapter: Main narrative unit within a manuscript
// Metadata de la entidad Chapter (Capítulo)

export const chapterMeta = {
  key: 'chapter',
  dataPath: '/data/chapters', // Ruta virtual - se carga dinámicamente por manuscrito
  label: { es: 'Capítulos', en: 'Chapters' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único del capítulo.', en: 'Unique identifier for the chapter.' },
      type: 'text',
      editable: false,
      show: true,
      system: true
    },
    {
      key: 'title',
      label: { es: 'Título', en: 'Title' },
      description: { es: 'Título del capítulo.', en: 'Chapter title.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'synopsis',
      label: { es: 'Sinopsis', en: 'Synopsis' },
      description: { es: 'Resumen breve del capítulo.', en: 'Brief chapter summary.' },
      type: 'textarea',
      editable: true,
      show: true
    },  
    {
      key: 'content',
      label: { es: 'Contenido del Capítulo', en: 'Chapter Content' },
      description: { es: 'El texto principal del capítulo donde se anclarán los Cues.', en: 'The main text of the chapter where Cues will be anchored.' },
      // Es crucial que sea un editor de texto enriquecido para poder
      // manejar los anclajes ('anchors') de forma invisible.
      type: 'richtext',
      editable: true,
      show: true
    },
    {
      key: 'manuscriptId',
      label: { es: 'Manuscrito', en: 'Manuscript' },
      description: { es: 'Manuscrito al que pertenece este capítulo.', en: 'Manuscript this chapter belongs to.' },
      type: 'relation',
      relation: 'manuscript',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'status',
      label: { es: 'Estado', en: 'Status' },
      description: { es: 'Estado del capítulo.', en: 'Chapter status.' },
      type: 'select',
      options: [
        { value: 'planned', label: { es: 'Planeado', en: 'Planned' } },
        { value: 'draft', label: { es: 'Borrador', en: 'Draft' } },
        { value: 'in-progress', label: { es: 'En Progreso', en: 'In Progress' } },
        { value: 'review', label: { es: 'En Revisión', en: 'Under Review' } },
        { value: 'completed', label: { es: 'Completado', en: 'Completed' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'wordCount',
      label: { es: 'Palabras', en: 'Word Count' },
      description: { es: 'Número de palabras en el capítulo.', en: 'Number of words in the chapter.' },
      type: 'number',
      editable: true,
      show: true
    },
    {
      key: 'order',
      label: { es: 'Orden', en: 'Order' },
      description: { es: 'Orden del capítulo en el manuscrito.', en: 'Chapter order in the manuscript.' },
      type: 'number',
      editable: true,
      show: true
    },
    {
      key: 'mood',
      label: { es: 'Tono', en: 'Mood' },
      description: { es: 'Tono emocional del capítulo.', en: 'Emotional tone of the chapter.' },
      type: 'select',
      options: [
        { value: 'mysterious', label: { es: 'Misterioso', en: 'Mysterious' } },
        { value: 'intriguing', label: { es: 'Intrigante', en: 'Intriguing' } },
        { value: 'tense', label: { es: 'Tenso', en: 'Tense' } },
        { value: 'dramatic', label: { es: 'Dramático', en: 'Dramatic' } },
        { value: 'peaceful', label: { es: 'Pacífico', en: 'Peaceful' } },
        { value: 'action', label: { es: 'Acción', en: 'Action' } },
        { value: 'romantic', label: { es: 'Romántico', en: 'Romantic' } },
        { value: 'sad', label: { es: 'Triste', en: 'Sad' } },
        { value: 'hopeful', label: { es: 'Esperanzador', en: 'Hopeful' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'images',
      label: { es: 'Imágenes', en: 'Images' },
      description: { es: 'Galería de imágenes del personaje.', en: 'Character image gallery.' },
      type: 'imageGallery',
      editable: true,
      show: true,
      maxImages: 10
    },
    {
      key: 'themes',
      label: { es: 'Temas', en: 'Themes' },
      description: { es: 'Temas principales del capítulo.', en: 'Main themes of the chapter.' },
      type: 'array',
      itemType: 'text',
      editable: true,
      show: true
    },
    {
      key: 'keyEvents',
      label: { es: 'Eventos Clave', en: 'Key Events' },
      description: { es: 'Eventos importantes que ocurren en el capítulo.', en: 'Important events that occur in the chapter.' },
      type: 'array',
      itemType: 'text',
      editable: true,
      show: true
    },
    {
      key: 'lastModified',
      label: { es: 'Última Modificación', en: 'Last Modified' },
      description: { es: 'Fecha de última modificación.', en: 'Last modification date.' },
      type: 'datetime',
      editable: false,
      show: true,
      system: true
    }
  ]
} as const

export type ChapterMetaField = typeof chapterMeta.fields[number]
