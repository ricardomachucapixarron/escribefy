import { gsap } from 'gsap'

export type MotoRideOptions = { duration?: number; intensity?: number; speed?: number; night?: boolean }

// Motorcycle ride (~5s): speed lines, wind overlay, lean sway and road vibration
export const motoRide5s = (
  root: HTMLElement | null,
  card: HTMLElement | null,
  opts?: MotoRideOptions
) => {
  if (!root || !card) return
  const duration = Math.max(1, Math.min(12, opts?.duration ?? 5))
  const intensity = Math.max(0, Math.min(1, opts?.intensity ?? 0.7))
  const speed = Math.max(0.4, Math.min(2.5, opts?.speed ?? 1.0))
  const night = !!opts?.night

  // Ensure overlay visible and clear previous moto instances
  gsap.killTweensOf(root)
  gsap.killTweensOf(card)
  Array.from(root.querySelectorAll('.nc-moto-container')).forEach(n => n.remove())
  gsap.set(root, { display: 'block', opacity: 1, backgroundColor: 'transparent', backgroundImage: 'none' })

  // Scoped container
  const container = document.createElement('div')
  container.className = 'nc-moto-container'
  Object.assign(container.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '70' } as CSSStyleDeclaration)
  root.appendChild(container)

  // Wind gradient overlay at top
  const wind = document.createElement('div')
  wind.className = 'nc-moto-wind'
  Object.assign(wind.style, {
    position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '71', opacity: '0',
    background: night
      ? 'linear-gradient(180deg, rgba(180,200,255,0.12) 0%, rgba(180,200,255,0.05) 30%, rgba(0,0,0,0) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%, rgba(0,0,0,0) 100%)',
    mixBlendMode: night ? 'screen' : 'overlay'
  } as CSSStyleDeclaration)
  container.appendChild(wind)
  gsap.to(wind, { opacity: 1, duration: 0.3, ease: 'power2.out' })

  // FPV starfield (3D) with lateral wedges
  const mkLayer = (z: number) => {
    const canvas = document.createElement('canvas')
    canvas.className = 'nc-moto-layer'
    Object.assign(canvas.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: String(z) } as CSSStyleDeclaration)
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (ctx) (ctx as any).imageSmoothingEnabled = false
    return { canvas, ctx }
  }
  const L1 = mkLayer(72) // back
  const L2 = mkLayer(73) // front

  const dpr = window.devicePixelRatio || 1

  let vpX = 0
  let vpY = 0
  let f = 1
  let viewW = window.innerWidth
  let viewH = window.innerHeight

  const updateViewport = () => {
    const W = window.innerWidth
    const H = window.innerHeight
    viewW = W
    viewH = H
    vpX = W / 2
    vpY = H * 0.45
    f = Math.min(W, H) * (night ? 0.9 : 0.8)
    ;[L1, L2].forEach(L => {
      if (!L.ctx) return
      L.canvas.width = W * dpr
      L.canvas.height = H * dpr
      L.canvas.style.width = W + 'px'
      L.canvas.style.height = H + 'px'
      L.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    })
  }
  updateViewport()
  const resize = () => updateViewport()
  window.addEventListener('resize', resize)

  type Star = { x: number; y: number; z: number; pz: number; a: number; hx: number }

  const wedgeSpread = Math.PI / 2.8 // ~64° wedge per side
  const yCompress = 0.55 // less vertical to emphasize laterals
  const corridorMargin = Math.max(16, Math.round(12 + 18 * intensity))

  const spawnStar = (): Star => {
    // Two wedges: right (0 rad) and left (pi rad)
    const side = Math.random() < 0.5 ? 1 : -1
    const base = side === 1 ? 0 : Math.PI
    const phi = base + (Math.random() - 0.5) * wedgeSpread
    const r = 0.05 + Math.random() * 0.22
    const x = Math.cos(phi) * r
    const y = Math.sin(phi) * r * yCompress
    const z = 0.65 + Math.random() * 0.6
    const a = 0.22 + Math.random() * (0.38 * (0.6 + intensity))
    // Horizontal bias in pixels to force appearance in lateral corridors
    const rect = card.getBoundingClientRect()
    let hxPixels = 0
    if (side === -1) {
      const leftMax = Math.max(0, rect.left - corridorMargin)
      const fallback = Math.min(180, viewW * 0.25)
      const centerX = leftMax > 0 ? Math.random() * (leftMax * 0.95) : Math.random() * fallback
      hxPixels = centerX - vpX
    } else {
      const rightMin = Math.min(viewW, rect.right + corridorMargin)
      const range = Math.max(0, viewW - rightMin)
      const fallback = Math.min(180, viewW * 0.25)
      const centerX = rightMin + (range > 0 ? Math.random() * (range * 0.95) : Math.random() * fallback)
      hxPixels = centerX - vpX
    }
    return { x, y, z, pz: z, a, hx: hxPixels }
  }

  const mkStars = (count: number): Star[] => Array.from({ length: count }, () => spawnStar())

  const backCount = Math.round(170 * (0.5 + intensity))
  const frontCount = Math.round(110 * (0.5 + intensity))
  let backStars = mkStars(backCount)
  let frontStars = mkStars(frontCount)

  // Speed ramp and yaw sway
  const speedState = { v: Math.max(0.3, speed * 0.6) }
  const speedTween = gsap.to(speedState, { v: speed, duration: 0.6 + 0.4 * intensity, ease: 'power2.out' })
  const yawState = { x: 0 }
  const yawTl = gsap.timeline({ repeat: Math.floor((duration * 1000) / 800), yoyo: true })
    .to(yawState, { x: 50 * intensity, duration: 0.4, ease: 'sine.inOut' })
    .to(yawState, { x: -50 * intensity, duration: 0.4, ease: 'sine.inOut' })

  const resetStar = (s: Star) => {
    const ns = spawnStar()
    s.x = ns.x; s.y = ns.y; s.z = ns.z; s.pz = ns.pz; s.a = ns.a
  }

  const drawLayer3D = (L: { ctx: CanvasRenderingContext2D | null }, stars: Star[], layerMul: number) => {
    const ctx = L.ctx
    if (!ctx) return
    const W = viewW
    const H = viewH
    ctx.clearRect(0, 0, W, H)
    // Clip to avoid drawing inside the text card
    const rect = card.getBoundingClientRect()
    const leftClipW = Math.max(0, rect.left - corridorMargin)
    const rightClipX = Math.min(W, rect.right + corridorMargin)
    const rightClipW = Math.max(0, W - rightClipX)
    ctx.save()
    ctx.beginPath()
    if (leftClipW > 0) ctx.rect(0, 0, leftClipW, H)
    if (rightClipW > 0) ctx.rect(rightClipX, 0, rightClipW, H)
    ctx.clip()
    ctx.strokeStyle = night ? 'rgb(180,210,255)' : 'rgb(255,255,255)'
    ctx.lineCap = 'round'

    const base = 0.9 + 2.8 * speedState.v
    const margin = 80
    for (const s of stars) {
      const px0 = vpX + yawState.x + s.hx + (s.x / s.pz) * f
      const py0 = vpY + (s.y / s.pz) * f
      s.pz = s.z
      s.z -= base * layerMul * (1 / 60)
      const px1 = vpX + yawState.x + s.hx + (s.x / s.z) * f
      const py1 = vpY + (s.y / s.z) * f

      // reset if outside or too close
      if (s.z <= 0.06 || px1 < -margin || px1 > W + margin || py1 < -margin || py1 > H + margin) {
        resetStar(s)
        continue
      }

      const thickness = Math.max(0.6, Math.min(4.0, (1 / s.z) * (0.7 + intensity * 1.2) * (layerMul > 1 ? 1.1 : 0.8)))
      ctx.lineWidth = thickness
      ctx.globalAlpha = Math.max(0.08, Math.min(0.95, s.a * (0.6 + 0.6 * (1 / s.z))))
      ctx.beginPath()
      ctx.moveTo(px0, py0)
      ctx.lineTo(px1, py1)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    ctx.restore()
  }

  let running = true
  const start = performance.now()
  let rafId = 0 as number

  const step = (t: number) => {
    if (!running) return
    const elapsed = (t - start) / 1000
    drawLayer3D(L1, backStars, 0.7)
    drawLayer3D(L2, frontStars, 1.1)
    if (elapsed < duration) { rafId = requestAnimationFrame(step) }
    else { running = false; cleanup() }
  }
  rafId = requestAnimationFrame(step)

  // Local bike dynamics: subtle vibration + lean sway
  const vib = gsap.to(card, {
    x: 2.5 * intensity, y: 0.8 * intensity, rotate: 0.35 * intensity,
    duration: 0.05, ease: 'sine.inOut', yoyo: true, repeat: -1
  })
  const sway = gsap.timeline({ repeat: Math.floor((duration * 1000) / 800), yoyo: true })
    .to(card, { x: 10 * intensity, rotate: 2.2 * intensity, duration: 0.4, ease: 'sine.inOut' })
    .to(card, { x: -10 * intensity, rotate: -2.0 * intensity, duration: 0.4, ease: 'sine.inOut' })

  const cleanup = () => {
    try { cancelAnimationFrame(rafId) } catch {}
    gsap.to(wind, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => wind.remove() })
    window.removeEventListener('resize', resize)
    L1.canvas.remove(); L2.canvas.remove()
    vib.kill(); sway.kill(); yawTl.kill(); speedTween.kill()
    gsap.set(card, { clearProps: 'transform,filter' })
    container.remove()
    // Hide overlay if empty
    if (root.childElementCount === 0) {
      gsap.set(root, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
    }
  }
}
