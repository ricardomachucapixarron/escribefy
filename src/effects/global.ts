import { gsap } from 'gsap'

export type FlashOptions = { color?: string; opacity?: number; duration?: number }
export const flash = (root: HTMLElement | null, opts?: FlashOptions) => {
  const el = root
  if (!el) return
  const color = opts?.color ?? '#ffffff'
  const opacity = opts?.opacity ?? 0.25
  const duration = opts?.duration ?? 0.18
  gsap.killTweensOf(el)
  gsap.set(el, { display: 'block', opacity: 0, backgroundColor: color })
  gsap.to(el, { opacity, duration: duration * 0.4, ease: 'power2.out' })
  gsap.to(el, { opacity: 0, duration: duration * 0.6, delay: duration * 0.4, ease: 'power2.in', onComplete: () => {
    gsap.set(el, { display: 'none' })
  } })
}

export type VignetteOptions = { opacity?: number; duration?: number }
export const vignette = (root: HTMLElement | null, opts?: VignetteOptions) => {
  const el = root
  if (!el) return
  const opacity = opts?.opacity ?? 0.25
  const duration = opts?.duration ?? 0.22
  gsap.killTweensOf(el)
  gsap.set(el, {
    display: 'block',
    opacity: 0,
    backgroundImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)'
  } as any)
  gsap.to(el, { opacity, duration: duration * 0.5, ease: 'power2.out' })
  gsap.to(el, { opacity: 0, duration: duration * 0.5, delay: duration * 0.5, ease: 'power2.in', onComplete: () => {
    gsap.set(el, { display: 'none', backgroundImage: 'none' })
  } })
}

export const particlesBurst = (root: HTMLElement | null, count: number = 50) => {
  const el = root
  if (!el) return
  gsap.killTweensOf(el)
  gsap.set(el, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.inset = '0'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '71'
  container.style.willChange = 'transform, opacity'
  el.appendChild(container)

  const colors = ['#A78BFA', '#60A5FA', '#34D399', '#F472B6', '#FBBF24']
  const animations: gsap.core.Tween[] = []

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    const size = Math.floor(6 + Math.random() * 10)
    p.style.position = 'absolute'
    p.style.left = Math.floor(Math.random() * 100) + 'vw'
    p.style.top = Math.floor(Math.random() * 100) + 'vh'
    p.style.width = size + 'px'
    p.style.height = size + 'px'
    p.style.borderRadius = '9999px'
    p.style.background = colors[i % colors.length]
    p.style.opacity = '0'
    container.appendChild(p)

    const dx = (Math.random() * 2 - 1) * 120
    const dy = (Math.random() * 2 - 1) * 120
    const life = 0.6 + Math.random() * 0.6
    const tween = gsap.fromTo(p,
      { x: 0, y: 0, scale: 0.6, opacity: 0 },
      { x: dx, y: dy, scale: 1.2, opacity: 1, duration: life * 0.5, ease: 'power2.out',
        onComplete: () => {
          gsap.to(p, { x: dx * 1.2, y: dy * 1.2, opacity: 0, scale: 0.9, duration: life * 0.5, ease: 'power2.in', onComplete: () => {
            p.remove()
          } })
        }
      }
    )
    animations.push(tween)
  }

  gsap.delayedCall(1.6, () => {
    container.remove()
    if (el.childElementCount === 0) {
      gsap.set(el, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
    }
  })
}

export type RippleOptions = { duration?: number; intensity?: number }
export const rippleGlobal = (root: HTMLElement | null, opts?: RippleOptions) => {
  const el = root
  if (!el) return
  const duration = opts?.duration ?? 0.5
  const intensity = opts?.intensity ?? 0.18

  Array.from(el.querySelectorAll('.nc-ripple')).forEach((n) => n.remove())

  gsap.killTweensOf(el)
  gsap.set(el, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })

  const circle = document.createElement('div')
  circle.className = 'nc-ripple'
  circle.style.position = 'fixed'
  circle.style.left = '50%'
  circle.style.top = '50%'
  circle.style.transform = 'translate(-50%, -50%) scale(0.95)'
  circle.style.width = '120vmax'
  circle.style.height = '120vmax'
  circle.style.borderRadius = '9999px'
  circle.style.pointerEvents = 'none'
  circle.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.0) 60%)'
  circle.style.opacity = '0'
  circle.style.zIndex = '73'
  el.appendChild(circle)

  gsap.killTweensOf(circle)
  const tl = gsap.timeline({
    onComplete: () => {
      circle.remove()
      if (el.childElementCount === 0) gsap.set(el, { display: 'none' })
    }
  })
  tl.to(circle, { opacity: intensity, duration: duration * 0.3, ease: 'power2.out', scale: 1.05 })
    .to(circle, { opacity: 0, duration: duration * 0.7, ease: 'power2.in', scale: 1.2 })
}

export const confettiBurst = (root: HTMLElement | null, count: number = 120) => {
  const el = root
  if (!el) return
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '72'
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  el.appendChild(canvas)

  const dpr = window.devicePixelRatio || 1
  const resize = () => {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  const colors = ['#A78BFA', '#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#F87171']
  type Piece = { x: number; y: number; vx: number; vy: number; w: number; h: number; r: number; color: string; life: number; ttl: number }
  const pieces: Piece[] = []
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 200 + Math.random() * 380
    pieces.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 200,
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 8,
      r: Math.random() * Math.PI,
      color: colors[i % colors.length],
      life: 0,
      ttl: 1200 + Math.random() * 600,
    })
  }

  let running = true
  const start = performance.now()
  const gravity = 600
  const drag = 0.0008

  const frame = (t: number) => {
    if (!running) return
    const elapsed = t - start
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of pieces) {
      const dt = 16
      p.vy += gravity * (dt / 1000)
      p.vx *= (1 - drag * dt)
      p.vy *= (1 - drag * dt)
      p.x += p.vx * (dt / 1000)
      p.y += p.vy * (dt / 1000)
      p.r += 0.1
      p.life = elapsed
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.color
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.ttl)
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    if (elapsed < 1600) {
      requestAnimationFrame(frame)
    } else {
      running = false
      window.removeEventListener('resize', resize)
      canvas.remove()
      if (el.childElementCount === 0) {
        gsap.set(el, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
      }
    }
  }
  requestAnimationFrame(frame)
}

// Local card zoom pulse (used by heartbeat and as a micro feedback)
export type ZoomPulseOptions = { scale?: number; upDuration?: number; downDuration?: number }
export const zoomPulse = (card: HTMLElement | null, opts?: ZoomPulseOptions) => {
  const el = card
  if (!el) return
  const scale = opts?.scale ?? 1.04
  const up = opts?.upDuration ?? 0.08
  const down = opts?.downDuration ?? 0.1
  gsap.killTweensOf(el)
  gsap.timeline({ onComplete: () => { gsap.set(el, { clearProps: 'transform' }) } })
    .to(el, { scale, duration: up, ease: 'power2.out' })
    .to(el, { scale: 1.0, duration: down, ease: 'power2.inOut' })
}

// Scream combo: flash + shockwave + vignette pulse + camera shake + local jitter/skew
export type ScreamOptions = { duration?: number; intensity?: number }
export const scream = (root: HTMLElement | null, card: HTMLElement | null, opts?: ScreamOptions) => {
  const el = root
  const target = card
  if (!el || !target) return
  const duration = Math.max(0.6, Math.min(4, opts?.duration ?? 2))
  const intensity = Math.max(0, Math.min(1, opts?.intensity ?? 0.8))

  // Immediate global cues
  flash(el, { color: '#ffffff', opacity: 0.5 * intensity + 0.25, duration: 0.22 })
  rippleGlobal(el, { duration: 0.55, intensity: 0.25 + 0.45 * intensity })
  vignette(el, { opacity: 0.3 + 0.3 * intensity, duration: 0.7 })

  gsap.killTweensOf(target)
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(target, { clearProps: 'transform,filter' })
    }
  })

  // Phase 1: violent shakes (~0.26s)
  tl.to(target, { x: -10 * intensity, y: -4 * intensity, rotate: -0.6 * intensity, duration: 0.06, ease: 'power2.out' })
    .to(target, { x: 12 * intensity, y: 5 * intensity, rotate: 0.5 * intensity, duration: 0.08, ease: 'power2.out' })
    .to(target, { x: -8 * intensity, y: 3 * intensity, rotate: -0.35 * intensity, duration: 0.06, ease: 'power2.out' })
    .to(target, { x: 6 * intensity, y: -3 * intensity, rotate: 0.25 * intensity, duration: 0.06, ease: 'power2.out' })

  // Phase 2: local distortion pulses (skew/jitter)
    .to(target, { skewX: 3 * intensity, skewY: -2 * intensity, filter: 'saturate(1.4) hue-rotate(10deg)', duration: 0.08, ease: 'power2.out' })
    .to(target, { x: '+=4', y: '+=2', duration: 0.04, ease: 'power2.inOut' })
    .to(target, { skewX: -2 * intensity, skewY: 2 * intensity, filter: 'saturate(1.2) hue-rotate(-10deg)', duration: 0.08, ease: 'power2.inOut' })
    .to(target, { x: '-=6', y: '+=1', duration: 0.05, ease: 'power2.inOut' })
    .to(target, { skewX: 0, skewY: 0, filter: 'none', duration: 0.12, ease: 'power2.inOut' })

  // Phase 3: settle back (remaining time)
    .to(target, { x: 0, y: 0, rotate: 0, duration: Math.max(0.2, duration - tl.duration()), ease: 'power2.out' })
}
