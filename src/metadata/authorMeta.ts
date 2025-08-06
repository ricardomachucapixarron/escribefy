// Autor: Persona que crea contenido literario, responsable de la autoría de manuscritos.
// Author: Person who creates literary content, responsible for manuscript authorship.
// Metadata de la entidad Author (Autor)
// Buenas prácticas: nombres claros, documentación por campo

// Autor/Persona: Definición estándar tipo World Anvil/Campfire
export const authorMeta = {
  key: 'author',
  label: { es: 'Autores', en: 'Authors' },
  fields: [
    {
      key: 'id',
      label: { es: 'ID', en: 'ID' },
      description: { es: 'Identificador único del autor/persona.', en: 'Unique identifier for the person/author.' },
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
      key: 'birthDate',
      label: { es: 'Nacimiento', en: 'Birth Date' },
      description: { es: 'Fecha de nacimiento.', en: 'Date of birth.' },
      type: 'date',
      editable: true,
      show: true
    },
    {
      key: 'deathDate',
      label: { es: 'Fallecimiento', en: 'Death Date' },
      description: { es: 'Fecha de fallecimiento (si aplica).', en: 'Date of death (if applicable).' },
      type: 'date',
      editable: true,
      show: true
    },
    {
      key: 'biography',
      label: { es: 'Biografía', en: 'Biography' },
      description: { es: 'Historia y detalles relevantes.', en: 'Backstory and relevant details.' },
      type: 'textarea',
      editable: true,
      show: true
    },
    {
      key: 'profileImage',
      label: { es: 'Imagen', en: 'Image' },
      description: { es: 'Imagen o retrato.', en: 'Profile image or portrait.' },
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
    }
  ,
    {
      key: 'name',
      label: { es: 'Nombre', en: 'Name' },
      description: {
        es: 'Nombre completo del autor.',
        en: 'Full name of the author.'
      },
      type: 'text',
      editable: true,
      show: true,
      required: true
    },
    {
      key: 'email',
      label: { es: 'Email', en: 'Email' },
      description: {
        es: 'Dirección de correo electrónico del autor.',
        en: 'Author email address.'
      },
      type: 'email',
      editable: true,
      show: true,
    },
    {
      key: 'bio',
      label: { es: 'Biografía', en: 'Biography' },
      description: {
        es: 'Biografía o descripción del autor.',
        en: 'Author biography or description.'
      },
      type: 'textarea',
      editable: true,
      show: true,
    },
    {
      key: 'birthDate',
      label: { es: 'Fecha de Nacimiento', en: 'Birth Date' },
      description: {
        es: 'Fecha de nacimiento del autor.',
        en: 'Author birth date.'
      },
      type: 'date',
      editable: true,
      show: true,
    },
    {
      key: 'website',
      label: { es: 'Sitio Web', en: 'Website' },
      description: {
        es: 'Sitio web personal del autor.',
        en: 'Author personal website.'
      },
      type: 'url',
      editable: true,
      show: true,
    },
    {
      key: 'createdAt',
      label: { es: 'Creado el', en: 'Created At' },
      description: {
        es: 'Fecha de creación del registro.',
        en: 'Record creation date.'
      },
      type: 'datetime',
      editable: false,
      show: false,
    },
    {
      key: 'updatedAt',
      label: { es: 'Actualizado el', en: 'Updated At' },
      description: {
        es: 'Fecha de última actualización.',
        en: 'Last update date.'
      },
      type: 'datetime',
      editable: false,
      show: false,
    }
  ]
} as const;