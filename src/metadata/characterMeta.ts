// Personaje: Entidad narrativa que representa un ser ficticio o real con atributos, rol y participación en la historia.
// Character: Narrative entity representing a fictional or real being with attributes, role, and participation in the story.
// Metadata de la entidad Character (Personaje)
// Buenas prácticas: nombres claros, multilenguaje, documentación por campo

// Personaje: Definición estándar tipo World Anvil/Campfire
export const characterMeta = {
  key: 'character',
  dataPath: '/data/characters',
  label: { es: 'Personajes', en: 'Characters' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único del personaje.', en: 'Unique identifier for the character.' },
      type: 'text',
      editable: false,
      show: false,
      system: true
    },
    {
      key: 'name',
      label: { es: 'Nombre', en: 'Name' },
      description: { es: 'Nombre completo.', en: 'Full name.' },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'manuscriptId',
      label: { es: 'Manuscrito', en: 'Manuscript' },
      description: { es: 'Obra a la que pertenece el personaje.', en: 'Work this character belongs to.' },
      type: 'relation',
      relation: 'manuscript',
      editable: true,
      show: true
    },
    {
      key: 'aliases',
      label: { es: 'Alias', en: 'Aliases' },
      description: { es: 'Otros nombres, apodos o títulos.', en: 'Other names, nicknames or titles.' },
      type: 'array',
      itemType: 'text',
      editable: true,
      show: true
    },
    {
      key: 'gender',
      label: { es: 'Género', en: 'Gender' },
      description: { es: 'Identidad de género.', en: 'Gender identity.' },
      type: 'select',
      options: [
        { value: 'male', label: { es: 'Masculino', en: 'Male' } },
        { value: 'female', label: { es: 'Femenino', en: 'Female' } },
        { value: 'nonbinary', label: { es: 'No binario', en: 'Non-binary' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } }
      ],
      editable: true,
      show: true
    },
    {
      key: 'age',
      label: { es: 'Edad', en: 'Age' },
      description: { es: 'Edad del personaje.', en: 'Character age.' },
      type: 'number',
      editable: true,
      show: true
    },
    {
      key: 'birthday',
      label: { es: 'Cumpleaños', en: 'Birthday' },
      description: { es: 'Fecha de nacimiento.', en: 'Birthday.' },
      type: 'date',
      editable: true,
      show: true
    },
    {
      key: 'description',
      label: { es: 'Descripción', en: 'Description' },
      description: { es: 'Descripción física y general.', en: 'Physical and general description.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'personality',
      label: { es: 'Personalidad', en: 'Personality' },
      description: { es: 'Rasgos de personalidad.', en: 'Personality traits.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'relationships',
      label: { es: 'Relaciones', en: 'Relationships' },
      description: { es: 'Relaciones con otros personajes.', en: 'Relationships with other characters.' },
      type: 'array',
      itemType: 'relation',
      relation: 'character',
      editable: true,
      show: true
    },
    {
      key: 'image',
      label: { es: 'Imagen', en: 'Image' },
      description: { es: 'Imagen o retrato.', en: 'Portrait or image.' },
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
      key: 'name',
      label: { es: 'Nombre', en: 'Name' },
      description: {
        es: 'Nombre completo del personaje.',
        en: 'Full name of the character.'
      },
      type: 'text',
      editable: true,
      show: true,
    },
    {
      key: 'fullName',
      label: { es: 'Nombre Completo', en: 'Full Name' },
      description: {
        es: 'Nombre completo, incluyendo apellidos o títulos.',
        en: 'Complete name, including surnames or titles.'
      },
      type: 'text',
      editable: true,
      show: false,
    },
    {
      key: 'nickname',
      label: { es: 'Apodo', en: 'Nickname' },
      description: {
        es: 'Apodo o alias del personaje.',
        en: 'Nickname or alias of the character.'
      },
      type: 'text',
      editable: true,
      show: false,
    },
    {
      key: 'gender',
      label: { es: 'Género', en: 'Gender' },
      description: {
        es: 'Identidad de género del personaje.',
        en: 'Gender identity of the character.'
      },
      type: 'select',
      options: [
        { value: 'male', label: { es: 'Masculino', en: 'Male' } },
        { value: 'female', label: { es: 'Femenino', en: 'Female' } },
        { value: 'non-binary', label: { es: 'No binario', en: 'Non-binary' } },
        { value: 'other', label: { es: 'Otro', en: 'Other' } },
        { value: 'unknown', label: { es: 'Desconocido', en: 'Unknown' } }
      ],
      editable: true,
      show: false,
    },
    {
      key: 'age',
      label: { es: 'Edad', en: 'Age' },
      description: {
        es: 'Edad del personaje.',
        en: 'Age of the character.'
      },
      type: 'number',
      editable: true,
      show: false,
    },
    {
      key: 'species',
      label: { es: 'Especie', en: 'Species' },
      description: {
        es: 'Especie, raza o tipo del personaje.',
        en: 'Species, race, or type of the character.'
      },
      type: 'text',
      editable: true,
      show: false,
    },
    {
      key: 'role',
      label: { es: 'Rol', en: 'Role' },
      description: {
        es: 'Rol narrativo (protagonista, antagonista, secundario, etc.).',
        en: 'Narrative role (protagonist, antagonist, supporting, etc.).'
      },
      type: 'select',
      options: [
        { es: 'Protagonista', en: 'protagonist' },
        { es: 'Antagonista', en: 'antagonist' },
        { es: 'Secundario', en: 'supporting' },
        { es: 'Otro', en: 'other' },
      ],
      editable: true,
      show: true,
    },
    {
      key: 'description',
      label: { es: 'Descripción', en: 'Description' },
      description: {
        es: 'Descripción física, psicológica o biográfica.',
        en: 'Physical, psychological or biographical description.'
      },
      type: 'textarea',
      editable: true,
      show: true,
    },
    {
      key: 'appearance',
      label: { es: 'Apariencia', en: 'Appearance' },
      description: {
        es: 'Descripción de la apariencia física.',
        en: 'Description of physical appearance.'
      },
      type: 'textarea',
      editable: true,
      show: false,
    },
    {
      key: 'personality',
      label: { es: 'Personalidad', en: 'Personality' },
      description: {
        es: 'Rasgos de personalidad, virtudes y defectos.',
        en: 'Personality traits, virtues, and flaws.'
      },
      type: 'textarea',
      editable: true,
      show: false,
    },
    {
      key: 'goals',
      label: { es: 'Metas', en: 'Goals' },
      description: {
        es: 'Objetivos, deseos o motivaciones principales.',
        en: 'Main objectives, desires, or motivations.'
      },
      type: 'textarea',
      editable: true,
      show: false,
    },
    {
      key: 'relationships',
      label: { es: 'Relaciones', en: 'Relationships' },
      description: {
        es: 'Relaciones importantes con otros personajes.',
        en: 'Important relationships with other characters.'
      },
      type: 'array',
      editable: true,
      show: false,
    },
    {
      key: 'affiliations',
      label: { es: 'Afiliaciones', en: 'Affiliations' },
      description: {
        es: 'Organizaciones o grupos a los que pertenece.',
        en: 'Organizations or groups the character belongs to.'
      },
      type: 'array',
      editable: true,
      show: false,
    },
    {
      key: 'history',
      label: { es: 'Historia', en: 'History' },
      description: {
        es: 'Historia personal y eventos importantes.',
        en: 'Personal history and important events.'
      },
      type: 'textarea',
      editable: true,
      show: false,
    },
    {
      key: 'tags',
      label: { es: 'Tags', en: 'Tags' },
      description: {
        es: 'Palabras clave o etiquetas asociadas al personaje.',
        en: 'Keywords or tags associated with the character.'
      },
      type: 'array',
      editable: true,
      show: true,
    },
    {
      key: 'createdAt',
      label: { es: 'Creado el', en: 'Created At' },
      description: {
        es: 'Fecha de creación del personaje.',
        en: 'Character creation date.'
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
      show: true
    }
    // Puedes agregar campos adicionales según la evolución del modelo
  ]
} as const;

export type CharacterMetaField = typeof characterMeta.fields[number];
