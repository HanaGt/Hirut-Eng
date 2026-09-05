/* Overlay lock (profile dialog, mobile drawer).

   overflow:hidden on body drops window.scrollY in several browsers, so
   we pin the page with position:fixed at the current offset instead.

   restore:true  — same page, overlay closed: put the reader back.
   restore:false — the route changed while locked: the new page owns
   scroll (top, or a hash target). Replaying the previous page's offset
   onto it would look like "I came from elsewhere and landed mid-page". */

let locks = 0
let savedY = 0

export function jumpScroll(y: number) {
  const root = document.documentElement
  const prev = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, y)
  root.style.scrollBehavior = prev
}

export function lockPageScroll() {
  if (locks === 0) {
    savedY = window.scrollY
    document.documentElement.classList.add('is-scroll-locked')
    document.body.style.top = `-${savedY}px`
  }
  locks += 1
}

export function unlockPageScroll(restore = true) {
  if (locks === 0) return savedY
  locks -= 1
  if (locks > 0) return savedY
  document.documentElement.classList.remove('is-scroll-locked')
  document.body.style.top = ''
  if (restore) jumpScroll(savedY)
  return savedY
}
