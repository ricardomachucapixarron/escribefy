// Organización: Grupo, facción o entidad colectiva relevante para la historia.
// Organization: Group, faction, or collective entity relevant to the story.
// Metadata de la entidad Organization (Organización)
// Buenas prácticas: nombres claros, multilenguaje, documentación por campo

// Organización: Definición estándar tipo World Anvil/Campfire
export const organizationMeta = {
  key: 'organization',
  dataPath: '/data/organizations',
  label: { es: 'Organizaciones', en: 'Organizations' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único de la organización.', en: 'Unique identifier for the organization.' },
      type: 'text',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'name',
      label: { es: 'Nombre', en: 'Name' },
      description: { es: 'Nombre completo de la organización.', en: 'Full name of the organization.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'manuscriptId',
      label: { es: 'Manuscrito', en: 'Manuscript' },
      description: { es: 'Obra a la que pertenece la organización.', en: 'Work this organization belongs to.' },
      type: 'relation',
      relation: 'manuscript',
      editable: true,
      show: true
    },
    {
      key: 'type',
      label: { es: 'Tipo', en: 'Type' },
      description: { es: 'Tipo de organización.', en: 'Type of organization.' },
      type: 'select',
      options: [
        { value: 'guild', label: { es: 'Gremio', en: 'Guild' } },
        { value: 'faction', label: { es: 'Facción', en: 'Faction' } },
        { value: 'company', label: { es: 'Compañía', en: 'Company' } },
        { value: 'family', label: { es: 'Familia', en: 'Family' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'description',
      label: { es: 'Descripción', en: 'Description' },
      description: { es: 'Descripción general.', en: 'General description.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'founded',
      label: { es: 'Fundación', en: 'Founded' },
      description: { es: 'Fecha de fundación.', en: 'Date of founding.' },
      type: 'date',
      editable: true,
      show: true
    },
    {
      key: 'leader',
      label: { es: 'Líder', en: 'Leader' },
      description: { es: 'Persona o personaje líder.', en: 'Leader (person or character).' },
      type: 'relation',
      relation: 'character',
      editable: true,
      show: true
    },
    {
      key: 'members',
      label: { es: 'Miembros', en: 'Members' },
      description: { es: 'Miembros principales.', en: 'Main members.' },
      type: 'array',
      itemType: 'relation',
      relation: 'character',
      editable: true,
      show: true
    },
    {
      key: 'headquarters',
      label: { es: 'Sede', en: 'Headquarters' },
      description: { es: 'Ubicación principal.', en: 'Main location.' },
      type: 'text',
      editable: true,
      show: true
    },
    {
      key: 'images',
      label: { es: 'Imágenes', en: 'Images' },
      description: { es: 'Galería de imágenes, logos y arte de la organización.', en: 'Gallery of images, logos and artwork for the organization.' },
      type: 'imageGallery',
      editable: true,
      show: true,
      maxImages: 8
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
    key: 'name',
    label: { es: 'Nombre', en: 'Name' },
    description: {
      es: 'Nombre de la organización.',
      en: 'Name of the organization.'
    },
    type: 'text',
    editable: true,
    show: true,
  },
  {
    key: 'type',
    label: { es: 'Tipo', en: 'Type' },
    description: {
      es: 'Tipo de organización (facción, gremio, empresa, etc.).',
      en: 'Type of organization (faction, guild, company, etc.).'
    },
    type: 'select',
    options: [
      { es: 'Facción', en: 'faction' },
      { es: 'Gremio', en: 'guild' },
      { es: 'Empresa', en: 'company' },
      { es: 'Gobierno', en: 'government' },
      { es: 'Religión', en: 'religion' },
      { es: 'Otro', en: 'other' },
    ],
    editable: true,
    show: true,
  },
  {
    key: 'description',
    label: { es: 'Descripción', en: 'Description' },
    description: {
      es: 'Descripción general de la organización.',
      en: 'General description of the organization.'
    },
    type: 'textarea',
    editable: true,
    show: true,
  },
  {
    key: 'members',
    label: { es: 'Miembros', en: 'Members' },
    description: {
      es: 'Lista de personajes o entidades que pertenecen a la organización.',
      en: 'List of characters or entities belonging to the organization.'
    },
    type: 'array',
    editable: true,
    show: true,
  },
  {
    key: 'goals',
    label: { es: 'Metas', en: 'Goals' },
    description: {
      es: 'Objetivos principales de la organización.',
      en: 'Main goals of the organization.'
    },
    type: 'textarea',
    editable: true,
    show: false,
  },
  {
    key: 'structure',
    label: { es: 'Estructura', en: 'Structure' },
    description: {
      es: 'Estructura interna o jerarquía.',
      en: 'Internal structure or hierarchy.'
    },
    type: 'textarea',
    editable: true,
    show: false,
  },
  {
    key: 'history',
    label: { es: 'Historia', en: 'History' },
    description: {
      es: 'Historia y eventos relevantes.',
      en: 'History and relevant events.'
    },
    type: 'textarea',
    editable: true,
    show: false,
  },
  {
    key: 'headquarters',
    label: { es: 'Sede', en: 'Headquarters' },
    description: {
      es: 'Ubicación principal o sede de la organización.',
      en: 'Main location or headquarters of the organization.'
    },
    type: 'text',
    editable: true,
    show: false,
  },
  {
    key: 'relationships',
    label: { es: 'Relaciones', en: 'Relationships' },
    description: {
      es: 'Relaciones importantes con otras organizaciones o personajes.',
      en: 'Important relationships with other organizations or characters.'
    },
    type: 'array',
    editable: true,
    show: false,
  },
  {
    key: 'tags',
    label: { es: 'Tags', en: 'Tags' },
    description: {
      es: 'Palabras clave o etiquetas asociadas a la organización.',
      en: 'Keywords or tags associated with the organization.'
    },
    type: 'array',
    editable: true,
    show: false,
  },
  {
    key: 'createdAt',
    label: { es: 'Creado el', en: 'Created At' },
    description: {
      es: 'Fecha de creación de la organización.',
      en: 'Organization creation date.'
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

export type OrganizationMetaField = typeof organizationMeta.fields[number];
