export const locationMeta = {
  key: 'location',
  label: { es: 'Lugares', en: 'Locations' },
  description: { es: 'Lugares y locaciones del universo narrativo.', en: 'Places and locations in the narrative universe.' },
  dataPath: '/data/locations',
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único.', en: 'Unique identifier.' },
      type: 'text',
      editable: false,
      show: true,
      required: true
    },
    {
      key: 'name',
      label: { es: 'Nombre', en: 'Name' },
      description: { es: 'Nombre del lugar.', en: 'Name of the place.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'manuscriptId',
      label: { es: 'Manuscrito', en: 'Manuscript' },
      description: { es: 'Manuscrito al que pertenece este lugar.', en: 'Manuscript this location belongs to.' },
      type: 'relation',
      relation: 'manuscript',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'type',
      label: { es: 'Tipo', en: 'Type' },
      description: { es: 'Tipo de lugar.', en: 'Type of place.' },
      type: 'select',
      options: [
        { value: 'city', label: { es: 'Ciudad', en: 'City' } },
        { value: 'country', label: { es: 'País', en: 'Country' } },
        { value: 'building', label: { es: 'Edificio', en: 'Building' } },
        { value: 'planet', label: { es: 'Planeta', en: 'Planet' } },
        { value: 'forest', label: { es: 'Bosque', en: 'Forest' } },
        { value: 'mountain', label: { es: 'Montaña', en: 'Mountain' } },
        { value: 'castle', label: { es: 'Castillo', en: 'Castle' } },
        { value: 'temple', label: { es: 'Templo', en: 'Temple' } },
        { value: 'village', label: { es: 'Pueblo', en: 'Village' } },
        { value: 'dungeon', label: { es: 'Mazmorra', en: 'Dungeon' } },
        { value: 'island', label: { es: 'Isla', en: 'Island' } },
        { value: 'desert', label: { es: 'Desierto', en: 'Desert' } },
        { value: 'ocean', label: { es: 'Océano', en: 'Ocean' } },
        { value: 'cave', label: { es: 'Cueva', en: 'Cave' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } }
      ],
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'description',
      label: { es: 'Descripción', en: 'Description' },
      description: { es: 'Descripción general y atmósfera del lugar.', en: 'General description and atmosphere of the place.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'geography',
      label: { es: 'Geografía', en: 'Geography' },
      description: { es: 'Características del entorno físico.', en: 'Characteristics of the physical environment.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'climate',
      label: { es: 'Clima', en: 'Climate' },
      description: { es: 'Condiciones climáticas del lugar.', en: 'Climate conditions of the place.' },
      type: 'text',
      editable: true,
      show: true
    },
    {
      key: 'population',
      label: { es: 'Población', en: 'Population' },
      description: { es: 'Detalles demográficos.', en: 'Demographic details.' },
      type: 'text',
      editable: true,
      show: true
    },
    {
      key: 'government',
      label: { es: 'Gobierno', en: 'Government' },
      description: { es: 'Detalles políticos y de gobierno.', en: 'Political and government details.' },
      type: 'text',
      editable: true,
      show: true
    },
    {
      key: 'landmarks',
      label: { es: 'Puntos de Interés', en: 'Landmarks' },
      description: { es: 'Lista de lugares notables dentro de la ubicación.', en: 'List of notable places within the location.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'history',
      label: { es: 'Historia', en: 'History' },
      description: { es: 'Eventos significativos que han ocurrido en este lugar.', en: 'Significant events that have occurred in this place.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'images',
      label: { es: 'Imágenes', en: 'Images' },
      description: { es: 'Galería de imágenes y mapas del lugar.', en: 'Gallery of images and maps of the place.' },
      type: 'imageGallery',
      editable: true,
      show: true,
      maxImages: 12
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
      required: false
    },
    {
      key: 'updatedAt',
      label: { es: 'Actualizado el', en: 'Updated At' },
      description: { es: 'Fecha de última actualización.', en: 'Last update date.' },
      type: 'datetime',
      editable: false,
      show: false,
      required: false
    },
    {
      key: 'visibility',
      label: { es: 'Visibilidad', en: 'Visibility' },
      description: { es: 'Control de visibilidad.', en: 'Visibility control.' },
      type: 'select',
      options: [
        { value: 'private', label: { es: 'Privado', en: 'Private' } },
        { value: 'public', label: { es: 'Público', en: 'Public' } }
      ],
      editable: true,
      show: false,
      required: false
    }
  ]
}
