// VFX Metadata: Declarative documentation for all visual effects used in Chapter 1
// Provides bilingual labels/descriptions and parameter specs (types, ranges, defaults)
// This mirrors the style of other metadata files while tailoring a schema for effects
// and their cue parameters.

export type VfxParamType = 'number' | 'text' | 'select' | 'boolean'

export type VfxParamMeta = {
  key: string
  label: { es: string; en: string }
  description: { es: string; en: string }
  type: VfxParamType
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: string; label: { es: string; en: string } }>
  default?: number | string | boolean
}

export type VfxEffectMeta = {
  key: string
  label: { es: string; en: string }
  description: { es: string; en: string }
  aliases?: string[]
  params: VfxParamMeta[]
}

export const vfxMeta = {
  key: 'vfx',
  cueType: 'vfx',
  label: { es: 'Efectos Visuales', en: 'Visual Effects' },
  // Effects implemented across global.ts, weather.ts, and moto.ts
  effects: [
    // Breeze (weather.breeze5s)
    {
      key: 'breeze',
      aliases: ['brisa', 'breeze5s'],
      label: { es: 'Brisa', en: 'Breeze' },
      description: {
        es: 'Barrido lateral suave con oscilación ligera del texto (overlay de brillo suave).',
        en: 'Soft lateral sweep with gentle card sway (subtle bright overlay).'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto en segundos. Mínimo 0.5s.',
            en: 'Total effect duration in seconds. Minimum 0.5s.'
          },
          type: 'number',
          min: 0.5,
          step: 0.1,
          default: 5
        },
        {
          key: 'opacity',
          label: { es: 'Opacidad', en: 'Opacity' },
          description: {
            es: 'Opacidad objetivo del barrido. Limitado internamente a 0.08–0.16.',
            en: 'Target sweep opacity. Internally clamped to 0.08–0.16.'
          },
          type: 'number',
          min: 0.08,
          max: 0.16,
          step: 0.01,
          default: 0.16
        }
      ]
    },

    // Sandstorm (weather.sandstorm5s)
    {
      key: 'sandstorm',
      aliases: ['tormenta', 'arena', 'sandstorm5s'],
      label: { es: 'Tormenta de Arena', en: 'Sandstorm' },
      description: {
        es: 'Capa de granos en movimiento con tinte cálido y oscilación del texto.',
        en: 'Moving grain layers with warm tint and subtle card sway.'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto en segundos (1–10).',
            en: 'Total effect duration in seconds (1–10).'
          },
          type: 'number',
          min: 1,
          max: 10,
          step: 0.1,
          default: 5
        },
        {
          key: 'intensity',
          label: { es: 'Intensidad', en: 'Intensity' },
          description: {
            es: 'Densidad/velocidad de granos y fuerza de oscilación (0–1).',
            en: 'Grain density/speed and sway strength (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.05,
          default: 0.7
        }
      ]
    },

    // Rain (weather.rain5s)
    {
      key: 'rain',
      aliases: ['lluvia', 'rain5s'],
      label: { es: 'Lluvia', en: 'Rain' },
      description: {
        es: 'Líneas de lluvia inclinadas, tinte frío, oscilación por viento y salpicaduras según variante.',
        en: 'Slanted rain streaks, cool tint, wind-driven sway, and variant-based splashes.'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto en segundos (1–12).',
            en: 'Total effect duration in seconds (1–12).'
          },
          type: 'number',
          min: 1,
          max: 12,
          step: 0.1,
          default: 5
        },
        {
          key: 'intensity',
          label: { es: 'Intensidad', en: 'Intensity' },
          description: {
            es: 'Densidad/velocidad de gotas (0–1).',
            en: 'Drop density/speed (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.05,
          default: 0.5
        },
        {
          key: 'wind',
          label: { es: 'Viento', en: 'Wind' },
          description: {
            es: 'Factor de viento que inclina la lluvia (0–2).',
            en: 'Wind factor that tilts the rain (0–2).'
          },
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          default: 0.4
        },
        {
          key: 'angleDeg',
          label: { es: 'Ángulo (°)', en: 'Angle (°)' },
          description: {
            es: "Ángulo de inclinación en grados (0–25). En los cues se acepta la clave 'angledeg'.",
            en: "Tilt angle in degrees (0–25). Cues may also use the key 'angledeg'."
          },
          type: 'number',
          min: 0,
          max: 25,
          step: 1,
          default: 12
        },
        {
          key: 'variant',
          label: { es: 'Variante', en: 'Variant' },
          description: {
            es: 'Preajuste de densidad/velocidad y salpicaduras: drizzle, downpour o storm.',
            en: 'Preset for density/speed and splashes: drizzle, downpour, or storm.'
          },
          type: 'select',
          options: [
            { value: 'drizzle', label: { es: 'Llovizna', en: 'Drizzle' } },
            { value: 'downpour', label: { es: 'Aguacero', en: 'Downpour' } },
            { value: 'storm', label: { es: 'Tormenta', en: 'Storm' } }
          ],
          default: 'downpour'
        }
      ]
    },

    // Flash (global.flash)
    {
      key: 'flash',
      label: { es: 'Destello', en: 'Flash' },
      description: {
        es: 'Pantalla completa con color y desvanecimiento rápido.',
        en: 'Full-screen color flash with quick fade.'
      },
      params: [
        {
          key: 'color',
          label: { es: 'Color', en: 'Color' },
          description: {
            es: 'Color CSS del destello (ej. #ffffff).',
            en: 'CSS color for the flash (e.g., #ffffff).'
          },
          type: 'text',
          default: '#ffffff'
        },
        {
          key: 'opacity',
          label: { es: 'Opacidad', en: 'Opacity' },
          description: {
            es: 'Opacidad pico del destello (0–1).',
            en: 'Peak flash opacity (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2
        },
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del destello. Recomendado ≥ 0.05s.',
            en: 'Total flash duration. Recommended ≥ 0.05s.'
          },
          type: 'number',
          min: 0.05,
          step: 0.01,
          default: 0.25
        }
      ]
    },

    // Vignette (global.vignette)
    {
      key: 'vignette',
      label: { es: 'Viñeta', en: 'Vignette' },
      description: {
        es: 'Oscurecimiento radial temporal hacia los bordes.',
        en: 'Temporary radial darkening toward the edges.'
      },
      params: [
        {
          key: 'opacity',
          label: { es: 'Opacidad', en: 'Opacity' },
          description: {
            es: 'Opacidad pico de la viñeta (0–1).',
            en: 'Peak vignette opacity (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.25
        },
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto.',
            en: 'Total effect duration.'
          },
          type: 'number',
          min: 0.05,
          step: 0.01,
          default: 0.3
        }
      ]
    },

    // Ripple global (global.rippleGlobal)
    {
      key: 'ripple',
      aliases: ['rippleglobal'],
      label: { es: 'Onda Global', en: 'Global Ripple' },
      description: {
        es: 'Onda circular luminosa desde el centro hacia afuera.',
        en: 'Circular luminous ripple expanding from center.'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto. Recomendado ≥ 0.05s.',
            en: 'Total effect duration. Recommended ≥ 0.05s.'
          },
          type: 'number',
          min: 0.05,
          step: 0.01,
          default: 0.6
        },
        {
          key: 'intensity',
          label: { es: 'Intensidad', en: 'Intensity' },
          description: {
            es: 'Opacidad pico de la onda (0–1).',
            en: 'Ripple peak opacity (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.3
        }
      ]
    },

    // Particles burst (global.particlesBurst)
    {
      key: 'particlesBurst',
      aliases: ['particles', 'burst'],
      label: { es: 'Explosión de Partículas', en: 'Particles Burst' },
      description: {
        es: 'Pequeñas partículas coloridas que estallan y se desvanecen.',
        en: 'Small colorful particles that burst and fade.'
      },
      params: [
        {
          key: 'count',
          label: { es: 'Cantidad', en: 'Count' },
          description: {
            es: 'Número de partículas a emitir (1–500).',
            en: 'Number of particles to emit (1–500).'
          },
          type: 'number',
          min: 1,
          max: 500,
          step: 1,
          default: 40
        }
      ]
    },

    // Zoom pulse (global.zoomPulse)
    {
      key: 'zoomPulse',
      aliases: ['pulse'],
      label: { es: 'Pulso de Zoom', en: 'Zoom Pulse' },
      description: {
        es: 'Pequeño pulso de zoom local en la tarjeta de texto. Nota: los cues actuales no pasan parámetros.',
        en: 'Small local zoom pulse on the text card. Note: current cues ignore parameters.'
      },
      params: [
        {
          key: 'scale',
          label: { es: 'Escala', en: 'Scale' },
          description: {
            es: 'Escala pico del pulso (1.0–1.2).',
            en: 'Peak pulse scale (1.0–1.2).'
          },
          type: 'number',
          min: 1.0,
          max: 1.2,
          step: 0.01,
          default: 1.04
        },
        {
          key: 'upDuration',
          label: { es: 'Subida (s)', en: 'Up (s)' },
          description: {
            es: 'Duración de la fase de incremento.',
            en: 'Duration of the scale-up phase.'
          },
          type: 'number',
          min: 0.01,
          step: 0.01,
          default: 0.08
        },
        {
          key: 'downDuration',
          label: { es: 'Bajada (s)', en: 'Down (s)' },
          description: {
            es: 'Duración de la fase de retorno.',
            en: 'Duration of the scale-down phase.'
          },
          type: 'number',
          min: 0.01,
          step: 0.01,
          default: 0.1
        }
      ]
    },

    // Motorcycle FPV ride (moto.motoRide5s)
    {
      key: 'moto',
      aliases: ['motorbike', 'motorcycle'],
      label: { es: 'Moto (FPV)', en: 'Motorcycle (FPV)' },
      description: {
        es: 'Efecto FPV con líneas de velocidad laterales, overlay de viento y vibración/oscilación de la tarjeta. Soporta modo nocturno.',
        en: 'FPV effect with lateral speed lines, wind overlay, and card vibration/sway. Supports night mode.'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del efecto (1–12).',
            en: 'Total effect duration (1–12).'
          },
          type: 'number',
          min: 1,
          max: 12,
          step: 0.1,
          default: 5
        },
        {
          key: 'intensity',
          label: { es: 'Intensidad', en: 'Intensity' },
          description: {
            es: 'Fuerza visual del efecto (0–1).',
            en: 'Visual strength of the effect (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.05,
          default: 0.7
        },
        {
          key: 'speed',
          label: { es: 'Velocidad', en: 'Speed' },
          description: {
            es: 'Velocidad relativa de las líneas de profundidad (0.4–2.5).',
            en: 'Relative speed of depth lines (0.4–2.5).'
          },
          type: 'number',
          min: 0.4,
          max: 2.5,
          step: 0.05,
          default: 1.0
        },
        {
          key: 'night',
          label: { es: 'Modo Noche', en: 'Night Mode' },
          description: {
            es: 'Usa mezcla de color y brillo para apariencia nocturna (true/false).',
            en: 'Uses color blending and brightness for a night look (true/false).'
          },
          type: 'boolean',
          default: false
        }
      ]
    },

    // Scream combo (global.scream)
    {
      key: 'scream',
      aliases: ['grito', 'shout', 'scream2s'],
      label: { es: 'Grito', en: 'Scream' },
      description: {
        es: 'Combo global-local: destello, onda de choque, pulso de viñeta y sacudida/distorsión local.',
        en: 'Global-local combo: flash, shockwave, vignette pulse, and local shake/distortion.'
      },
      params: [
        {
          key: 'duration',
          label: { es: 'Duración (s)', en: 'Duration (s)' },
          description: {
            es: 'Duración total del combo (0.6–4).',
            en: 'Total combo duration (0.6–4).'
          },
          type: 'number',
          min: 0.6,
          max: 4,
          step: 0.1,
          default: 2
        },
        {
          key: 'intensity',
          label: { es: 'Intensidad', en: 'Intensity' },
          description: {
            es: 'Fuerza/violencia del combo (0–1).',
            en: 'Combo strength/violence (0–1).'
          },
          type: 'number',
          min: 0,
          max: 1,
          step: 0.05,
          default: 0.8
        }
      ]
    },

    // Minimal fallback: screen shake (no parameters)
    {
      key: 'shake',
      aliases: ['temblor', 'sacudida'],
      label: { es: 'Sacudida', en: 'Shake' },
      description: {
        es: 'Pequeña sacudida de pantalla para retroalimentación mínima cuando no hay otro efecto definido.',
        en: 'Small screen shake used as minimal feedback when no other effect is defined.'
      },
      params: []
    }
  ]
} as const

export type VfxMeta = typeof vfxMeta
export type VfxMetaEffects = typeof vfxMeta.effects[number]
