import { gsap } from 'gsap'

export type BreezeOptions = { duration?: number; opacity?: number }
export const breeze5s = (
  root: HTMLElement | null,
  card: HTMLElement | null,
  opts?: BreezeOptions
) => {
  if (!root || !card) return

  gsap.killTweensOf(root)
  gsap.killTweensOf(card)
  gsap.set(root, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })

  const sweep = document.createElement('div')
  sweep.className = 'nc-breeze-sweep'
  sweep.style.position = 'fixed'
  sweep.style.top = '0'
  sweep.style.left = '0'
  sweep.style.height = '100vh'
  sweep.style.width = '35vw'
  sweep.style.pointerEvents = 'none'
  sweep.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0) 100%)'
  sweep.style.filter = 'blur(1px) brightness(1.03)'
  sweep.style.opacity = '0'
  sweep.style.zIndex = '81'
  root.appendChild(sweep)

  const targetOpacity = Math.min(0.16, Math.max(0.08, (opts?.opacity ?? 0.12)))
  const sweepTween = gsap.fromTo(
    sweep,
    { x: '-40vw', opacity: 0 },
    { x: '120vw', opacity: targetOpacity, duration: 1.4, ease: 'sine.inOut', repeat: -1 }
  )

  const swayTween = gsap.to(card, {
    x: 6,
    skewX: 1.2,
    duration: 0.35,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })

  const duration = Math.max(0.5, opts?.duration ?? 5)
  gsap.delayedCall(duration, () => {
    sweepTween.kill()
    swayTween.kill()
    sweep.remove()
    gsap.set(card, { clearProps: 'transform,filter' })
    if (root.childElementCount === 0) {
      gsap.set(root, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
    }
  })
}

export type SandstormOptions = { duration?: number; intensity?: number }
export const sandstorm5s = (
  root: HTMLElement | null,
  card: HTMLElement | null,
  opts?: SandstormOptions
) => {
  if (!root || !card) return
  const duration = Math.max(1, Math.min(10, opts?.duration ?? 5))
  const intensity = Math.max(0, Math.min(1, opts?.intensity ?? 0.7))

  gsap.killTweensOf(root)
  gsap.set(root, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })

  const tint = document.createElement('div')
  tint.className = 'nc-sand-tint'
  tint.style.position = 'fixed'
  tint.style.inset = '0'
  tint.style.pointerEvents = 'none'
  tint.style.background = 'linear-gradient(180deg, rgba(194,178,128,0.18) 0%, rgba(194,178,128,0.12) 60%, rgba(194,178,128,0.08) 100%)'
  tint.style.mixBlendMode = 'screen'
  tint.style.opacity = '0'
  tint.style.zIndex = '70'
  root.appendChild(tint)
  gsap.to(tint, { opacity: 1, duration: 0.4, ease: 'power2.out' })

  const mkLayer = (z: number) => {
    const canvas = document.createElement('canvas')
    canvas.className = 'nc-sand-layer'
    canvas.style.position = 'fixed'
    canvas.style.inset = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = String(z)
    root.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    return { canvas, ctx }
  }
  const L1 = mkLayer(71)
  const L2 = mkLayer(72)

  const dpr = window.devicePixelRatio || 1
  const resize = () => {
    ;[L1, L2].forEach(L => {
      if (!L.ctx) return
      L.canvas.width = window.innerWidth * dpr
      L.canvas.height = window.innerHeight * dpr
      L.canvas.style.width = window.innerWidth + 'px'
      L.canvas.style.height = window.innerHeight + 'px'
      L.ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    })
  }
  resize()
  window.addEventListener('resize', resize)

  type Grain = { x: number; y: number; vx: number; vy: number; s: number; a: number }
  const mkGrains = (count: number, layerSpeed: number): Grain[] => {
    const arr: Grain[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (200 + Math.random() * 220) * layerSpeed * (0.9 + intensity),
        vy: (Math.random() * 2 - 1) * 36 * layerSpeed,
        s: 0.3 + Math.random() * 0.8,
        a: 0.15 + Math.random() * (0.35 * (0.5 + intensity))
      })
    }
    return arr
  }
  const grains1 = mkGrains(140, 0.6)
  const grains2 = mkGrains(90, 1.0)

  let running = true
  let rafId = 0 as number
  const hardStopId = window.setTimeout(() => { if (running) { running = false; cleanup() } }, Math.ceil((duration + 0.2) * 1000))
  const start = performance.now()

  const draw = (L: { ctx: CanvasRenderingContext2D | null }, grains: Grain[]) => {
    const ctx = L.ctx
    if (!ctx) return
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.fillStyle = '#C2B280'
    for (const g of grains) {
      ctx.globalAlpha = g.a
      ctx.beginPath()
      ctx.ellipse(g.x, g.y, g.s * 2.0, g.s * 0.9, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const step = (t: number) => {
    if (!running) return
    const elapsed = (t - start) / 1000
    grains1.forEach(g => {
      g.x += g.vx * (1/60)
      g.y += g.vy * (1/60)
      if (g.x > window.innerWidth + 20) g.x = -20
      if (g.y < -10) g.y = window.innerHeight + 10
      if (g.y > window.innerHeight + 10) g.y = -10
    })
    grains2.forEach(g => {
      g.x += g.vx * (1/60)
      g.y += g.vy * (1/60)
      if (g.x > window.innerWidth + 20) g.x = -20
      if (g.y < -20) g.y = window.innerHeight + 20
      if (g.y > window.innerHeight + 20) g.y = -20
    })
    draw(L1, grains1)
    draw(L2, grains2)
    if (elapsed < duration) {
      rafId = requestAnimationFrame(step)
    } else {
      running = false
      cleanup()
    }
  }
  rafId = requestAnimationFrame(step)

  const cardTl = gsap.timeline({ repeat: Math.floor((duration * 1000) / 600), yoyo: true })
    .to(card, { x: 6 * intensity, skewX: 1.5 * intensity, filter: 'blur(0.5px)', duration: 0.3, ease: 'sine.inOut' })
    .to(card, { x: -5 * intensity, skewX: -1.0 * intensity, filter: 'blur(0px)', duration: 0.3, ease: 'sine.inOut' })

  const cleanup = () => {
    gsap.to(tint, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => tint.remove() })
    window.removeEventListener('resize', resize)
    L1.canvas.remove()
    L2.canvas.remove()
    cardTl.kill()
    gsap.set(card, { clearProps: 'transform,filter' })
    if (root.childElementCount === 0) {
      gsap.set(root, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
    }
  }
}

export type RainOptions = { duration?: number; intensity?: number; wind?: number; angleDeg?: number; variant?: 'drizzle' | 'downpour' | 'storm' }
export const rain5s = (
  root: HTMLElement | null,
  card: HTMLElement | null,
  opts?: RainOptions
) => {
  if (!root || !card) return
  const duration = Math.max(1, Math.min(12, opts?.duration ?? 5))
  const intensity = Math.max(0, Math.min(1, opts?.intensity ?? 0.7))
  const wind = Math.max(0, Math.min(2, opts?.wind ?? 0.4))
  const angleDeg = Math.max(0, Math.min(25, opts?.angleDeg ?? 10))
  const variant = opts?.variant ?? 'downpour'

  gsap.killTweensOf(root)
  gsap.killTweensOf(card)
  Array.from(root.querySelectorAll('.nc-rain-container')).forEach(n => n.remove())
  gsap.set(root, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })

  const container = document.createElement('div')
  container.className = 'nc-rain-container'
  Object.assign(container.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '70' } as CSSStyleDeclaration)
  root.appendChild(container)

  const tint = document.createElement('div')
  tint.className = 'nc-rain-tint'
  Object.assign(tint.style, {
    position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '70', opacity: '0',
    background: 'linear-gradient(180deg, rgba(120,150,180,0.15) 0%, rgba(90,120,155,0.10) 100%)',
    mixBlendMode: 'screen'
  } as CSSStyleDeclaration)
  container.appendChild(tint)
  gsap.to(tint, { opacity: 1, duration: 0.35, ease: 'power2.out' })

  const mkLayer = (z: number) => {
    const canvas = document.createElement('canvas')
    canvas.className = 'nc-rain-layer'
    Object.assign(canvas.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: String(z), willChange: 'transform, opacity' } as CSSStyleDeclaration)
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ;(ctx as any).imageSmoothingEnabled = false
    }
    return { canvas, ctx }
  }
  const L1 = mkLayer(71)
  const L2 = mkLayer(72)

  const dpr = window.devicePixelRatio || 1
  const resize = () => {
    ;[L1, L2].forEach(L => {
      if (!L.ctx) return
      L.canvas.width = window.innerWidth * dpr
      L.canvas.height = window.innerHeight * dpr
      L.canvas.style.width = window.innerWidth + 'px'
      L.canvas.style.height = window.innerHeight + 'px'
      L.ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    })
  }
  resize()
  window.addEventListener('resize', resize)

  type Drop = { x: number; y: number; vx: number; vy: number; len: number; a: number; lw: number }
  const mkDrops = (count: number, speedMul: number, baseLen: number, lw: number): Drop[] => {
    const arr: Drop[] = []
    for (let i = 0; i < count; i++) {
      const vy = (600 + Math.random() * 600) * speedMul * (0.6 + intensity)
      const vx = (Math.tan((angleDeg * Math.PI) / 180) * vy) * (0.5 + wind)
      arr.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx, vy,
        len: baseLen * (0.9 + Math.random() * 0.9),
        a: 0.22 + Math.random() * (0.38 * (0.5 + intensity)),
        lw
      })
    }
    return arr
  }

  const presets = {
    drizzle: { c1: 180, c2: 120, sp1: 0.7, sp2: 1.0, len: 16, lw: 0.8, blur: 0.2, splashes: false },
    downpour: { c1: 260, c2: 180, sp1: 1.0, sp2: 1.3, len: 28, lw: 1.2, blur: 0.3, splashes: true },
    storm: { c1: 320, c2: 220, sp1: 1.2, sp2: 1.6, len: 34, lw: 1.3, blur: 0.35, splashes: true }
  } as const
  const P = presets[variant]

  const drops1 = mkDrops(Math.round(P.c1 * (0.6 + intensity)), P.sp1, P.len, P.lw)
  const drops2 = mkDrops(Math.round(P.c2 * (0.6 + intensity)), P.sp2, P.len * 1.15, P.lw)

  type Splash = { x: number; y: number; r: number; a: number; vr: number; va: number }
  const splashes: Splash[] = []
  const spawnSplash = (x: number) => {
    if (!P.splashes) return
    const base = {
      y: window.innerHeight - 4,
      a: 0.3,
      vr: 40 + Math.random() * 24,
      va: 0.88 + Math.random() * 0.06
    }
    splashes.push({ x, r: 1.0, ...base })
    const dx = (Math.random() * 10 + 4) * (Math.random() < 0.5 ? -1 : 1)
    splashes.push({ x: x + dx, r: 0.8, ...base })
  }

  const cardTl = gsap.timeline({ repeat: Math.floor((duration * 1000) / 700), yoyo: true })
    .to(card, { x: 4 + 6 * wind, skewX: 0.8 + 1.2 * wind, filter: `blur(${P.blur}px)`, duration: 0.35, ease: 'sine.inOut' })
    .to(card, { x: -(3 + 5 * wind), skewX: -(0.6 + 0.9 * wind), filter: 'blur(0px)', duration: 0.35, ease: 'sine.inOut' })

  const drawLayer = (L: { ctx: CanvasRenderingContext2D | null }, arr: Drop[]) => {
    const ctx = L.ctx
    if (!ctx) return
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = 'rgba(205,230,255,0.95)'
    ctx.lineCap = 'round'
    for (const d of arr) {
      ctx.globalAlpha = d.a
      ctx.lineWidth = Math.max(1.2, d.lw)
      ctx.beginPath()
      ctx.moveTo(d.x, d.y)
      ctx.lineTo(d.x - (d.vx * 0.02), d.y - d.len)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  const drawSplashes = (L: { ctx: CanvasRenderingContext2D | null }) => {
    if (!P.splashes) return
    const ctx = L.ctx
    if (!ctx) return
    for (const s of splashes) {
      ctx.globalAlpha = s.a
      ctx.beginPath()
      const rr = Math.min(12, Math.max(0.6, s.r))
      ctx.arc(s.x, s.y, rr, 0, Math.PI, true)
      ctx.strokeStyle = 'rgba(200,220,245,0.85)'
      ctx.lineWidth = 1.0
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  let running = true
  let rafId = 0 as number
  const hardStopId = window.setTimeout(() => { if (running) { running = false; cleanup() } }, Math.ceil((duration + 0.2) * 1000))
  const start = performance.now()
  const step = (t: number) => {
    if (!running) return
    const elapsed = (t - start) / 1000
    try {
      const adv = (d: Drop) => {
        d.x += d.vx * (1/60)
        d.y += d.vy * (1/60)
        if (d.y > window.innerHeight + 20) { d.y = -10; d.x = Math.random() * window.innerWidth; spawnSplash(d.x) }
        if (d.x < -20) d.x = window.innerWidth + 10
        if (d.x > window.innerWidth + 20) d.x = -10
      }
      drops1.forEach(adv)
      drops2.forEach(adv)

      if (P.splashes) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i]
          s.r += s.vr * (1/60)
          s.a *= Math.pow(s.va, 1/60)
          if (s.r > 13.5 || s.a < 0.03) splashes.splice(i, 1)
        }
      }

      drawLayer(L1, drops1)
      drawLayer(L2, drops2)
      drawSplashes(L2)

      if (variant === 'storm' && Math.random() < 0.015) {
        const bolt = document.createElement('div')
        bolt.className = 'nc-rain-bolt'
        Object.assign(bolt.style, {
          position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '73',
          background: 'rgba(205, 227, 255, 0.0)', mixBlendMode: 'screen', opacity: '0'
        } as CSSStyleDeclaration)
        container.appendChild(bolt)
        const peak = 0.35 + 0.25 * intensity
        gsap.timeline({ onComplete: () => bolt.remove() })
          .to(bolt, { opacity: 1, background: `rgba(205, 227, 255, ${peak})`, duration: 0.06, ease: 'power1.out' })
          .to(bolt, { opacity: 0, duration: 0.12, ease: 'power1.in' })
      }
    } catch {
      // keep animation alive
    } finally {
      if (!running) return
      if (elapsed < duration) rafId = requestAnimationFrame(step)
      else { running = false; cleanup() }
    }
  }
  rafId = requestAnimationFrame(step)

  const cleanup = () => {
    gsap.to(tint, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => tint.remove() })
    window.removeEventListener('resize', resize)
    L1.canvas.remove(); L2.canvas.remove()
    cardTl.kill()
    gsap.set(card, { clearProps: 'transform,filter' })
    container.remove()
    try { cancelAnimationFrame(rafId) } catch {}
    try { window.clearTimeout(hardStopId) } catch {}
    if (!root.querySelector('.nc-rain-container') && !root.querySelector('.nc-sand-layer') && !root.querySelector('.nc-sand-tint')) {
      gsap.set(root, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
    }
  }
}
