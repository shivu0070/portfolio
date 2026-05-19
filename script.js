'use strict'

const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches

/* ------------------------------------------------------------------
   current year in footer
------------------------------------------------------------------ */
const dateEl = document.getElementById('date')
if (dateEl) dateEl.textContent = new Date().getFullYear()

/* ------------------------------------------------------------------
   mobile hamburger menu
------------------------------------------------------------------ */
const hamburger = document.querySelector('.hamburger')
const navList = document.querySelector('.nav-list')
const socials = document.querySelector('.social-nav')
const navLinks = document.querySelectorAll('.nav-links')

const toggleMobileMenu = () => {
	hamburger?.classList.toggle('open')
	navList?.classList.toggle('open')
	socials?.classList.toggle('open')
	document.body.classList.toggle('open')
}
const closeMobileMenu = () => {
	hamburger?.classList.remove('open')
	navList?.classList.remove('open')
	socials?.classList.remove('open')
	document.body.classList.remove('open')
}

navLinks.forEach(link => link.addEventListener('click', closeMobileMenu))
hamburger?.addEventListener('click', toggleMobileMenu)
hamburger?.addEventListener('keydown', e => {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault()
		toggleMobileMenu()
	}
})

/* ------------------------------------------------------------------
   typewriter effect (hero)
------------------------------------------------------------------ */
;(() => {
	const el = document.getElementById('typing')
	if (!el) return
	const words = [
		'real-time voice AI agents.',
		'computer-vision pipelines.',
		'OCR document intelligence.',
		'CNN image classifiers.',
		'ML & predictive models.',
		'Power BI analytics dashboards.',
		'AI systems that work in the real world.',
	]

	if (prefersReducedMotion) {
		el.textContent = 'AI, computer vision & data systems.'
		return
	}

	let wordIndex = 0
	let charIndex = 0
	let deleting = false

	const tick = () => {
		const current = words[wordIndex]
		el.textContent = current.slice(0, charIndex)

		if (!deleting && charIndex < current.length) {
			charIndex++
			setTimeout(tick, 70)
		} else if (!deleting && charIndex === current.length) {
			deleting = true
			setTimeout(tick, 1500)
		} else if (deleting && charIndex > 0) {
			charIndex--
			setTimeout(tick, 35)
		} else {
			deleting = false
			wordIndex = (wordIndex + 1) % words.length
			setTimeout(tick, 250)
		}
	}
	tick()
})()

/* ------------------------------------------------------------------
   scroll progress bar + sticky-nav shrink
------------------------------------------------------------------ */
;(() => {
	const bar = document.getElementById('scrollProgress')
	const nav = document.getElementById('nav')
	let ticking = false

	const update = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight
		const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
		if (bar) bar.style.width = pct + '%'
		if (nav) nav.classList.toggle('scrolled', scrollTop > 40)
		ticking = false
	}

	window.addEventListener(
		'scroll',
		() => {
			if (!ticking) {
				window.requestAnimationFrame(update)
				ticking = true
			}
		},
		{ passive: true }
	)
	update()
})()

/* ------------------------------------------------------------------
   reveal-on-scroll
------------------------------------------------------------------ */
;(() => {
	const revealEls = document.querySelectorAll('.reveal')
	if (!('IntersectionObserver' in window) || prefersReducedMotion) {
		revealEls.forEach(el => el.classList.add('in-view'))
		return
	}
	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view')
					obs.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	)
	revealEls.forEach(el => io.observe(el))
})()

/* ------------------------------------------------------------------
   active nav link based on visible section
------------------------------------------------------------------ */
;(() => {
	const sections = document.querySelectorAll('main section[id]')
	const linkFor = id =>
		document.querySelector('.nav-links[href="#' + id + '"]')
	if (!('IntersectionObserver' in window) || !sections.length) return

	const io = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				const link = linkFor(entry.target.id)
				if (!link) return
				if (entry.isIntersecting) {
					document
						.querySelectorAll('.nav-links.active')
						.forEach(a => a.classList.remove('active'))
					link.classList.add('active')
				}
			})
		},
		{ threshold: 0.5, rootMargin: '-20% 0px -55% 0px' }
	)
	sections.forEach(s => io.observe(s))
})()

/* ------------------------------------------------------------------
   custom cursor (pointer devices only)
------------------------------------------------------------------ */
;(() => {
	const dot = document.getElementById('cursorDot')
	const ring = document.getElementById('cursorRing')
	if (!dot || !ring) return
	if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) {
		dot.style.display = 'none'
		ring.style.display = 'none'
		return
	}

	let mouseX = window.innerWidth / 2
	let mouseY = window.innerHeight / 2
	let ringX = mouseX
	let ringY = mouseY

	window.addEventListener(
		'mousemove',
		e => {
			mouseX = e.clientX
			mouseY = e.clientY
			dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
		},
		{ passive: true }
	)

	const render = () => {
		ringX += (mouseX - ringX) * 0.18
		ringY += (mouseY - ringY) * 0.18
		ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
		requestAnimationFrame(render)
	}
	render()

	const hoverTargets =
		'a, button, .btn, .hamburger, .skills-list li, .education-item, .certification-item, .tech-stack li, [data-cursor="hover"]'
	document.querySelectorAll(hoverTargets).forEach(el => {
		el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'))
		el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'))
	})

	document.addEventListener('mouseleave', () => {
		dot.style.opacity = '0'
		ring.style.opacity = '0'
	})
	document.addEventListener('mouseenter', () => {
		dot.style.opacity = '1'
		ring.style.opacity = '1'
	})
})()

/* ------------------------------------------------------------------
   3D tilt on project media
------------------------------------------------------------------ */
;(() => {
	if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return
	const MAX = 8 // degrees
	document.querySelectorAll('.project-media').forEach(card => {
		card.addEventListener('mousemove', e => {
			const r = card.getBoundingClientRect()
			const px = (e.clientX - r.left) / r.width - 0.5
			const py = (e.clientY - r.top) / r.height - 0.5
			card.style.transform = `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-6px)`
		})
		card.addEventListener('mouseleave', () => {
			card.style.transform = ''
		})
	})
})()

/* ------------------------------------------------------------------
   subtle magnetic pull on primary buttons
------------------------------------------------------------------ */
;(() => {
	if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return
	document.querySelectorAll('.hire-btn, .mail-link').forEach(btn => {
		btn.addEventListener('mousemove', e => {
			const r = btn.getBoundingClientRect()
			const x = e.clientX - r.left - r.width / 2
			const y = e.clientY - r.top - r.height / 2
			btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`
		})
		btn.addEventListener('mouseleave', () => {
			btn.style.transform = ''
		})
	})
})()

/* ------------------------------------------------------------------
   hero avatar video — force-autoplay loop everywhere
   Strategy: muted + playsinline + many retry hooks so autoplay
   survives file://, autoplay-blocking browsers, tab-switches, etc.
------------------------------------------------------------------ */
;(() => {
	const video = document.getElementById('heroVideo')
	const btn = document.getElementById('videoToggle')
	if (!video) return

	// Belt-and-braces: every autoplay precondition set explicitly
	video.muted = true
	video.defaultMuted = true
	video.setAttribute('muted', '')
	video.setAttribute('playsinline', '')
	video.setAttribute('webkit-playsinline', '')
	video.loop = true
	video.autoplay = true

	const tryPlay = () => {
		const p = video.play()
		if (p && typeof p.catch === 'function') p.catch(() => {})
	}

	// Try as soon as data is available
	if (video.readyState >= 2) tryPlay()
	video.addEventListener('loadedmetadata', tryPlay)
	video.addEventListener('loadeddata', tryPlay)
	video.addEventListener('canplay', tryPlay)

	// Fallback: kick off on the FIRST user gesture (covers strict autoplay policies)
	const events = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove']
	const kickstart = () => {
		if (video.paused) tryPlay()
		events.forEach(e => document.removeEventListener(e, kickstart))
	}
	events.forEach(e =>
		document.addEventListener(e, kickstart, { passive: true, once: false })
	)

	// Resume after returning to the tab or unlocking the screen
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden && video.paused) tryPlay()
	})

	// If the browser ever pauses it on its own, restart immediately
	video.addEventListener('pause', () => {
		if (!video.ended && document.visibilityState === 'visible') {
			// micro-delay so the user's own pause-button click still wins this frame
			setTimeout(() => {
				if (video.paused && !btn?.dataset.userPaused) tryPlay()
			}, 30)
		}
	})

	// Pause toggle (still functional if the user really wants to stop it)
	if (btn) {
		const icon = btn.querySelector('i')
		const setPlayingUI = () => {
			icon.classList.remove('bx-play')
			icon.classList.add('bx-pause')
			btn.setAttribute('aria-label', 'Pause animation')
		}
		const setPausedUI = () => {
			icon.classList.remove('bx-pause')
			icon.classList.add('bx-play')
			btn.setAttribute('aria-label', 'Play animation')
		}
		btn.addEventListener('click', () => {
			if (video.paused) {
				delete btn.dataset.userPaused
				tryPlay()
			} else {
				btn.dataset.userPaused = '1'
				video.pause()
			}
		})
		video.addEventListener('play', setPlayingUI)
		video.addEventListener('pause', () => {
			if (!video.ended) setPausedUI()
		})
	}
})()

/* ------------------------------------------------------------------
   AOS (kept for any data-aos elements)
------------------------------------------------------------------ */
if (typeof AOS !== 'undefined') {
	AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' })
}
