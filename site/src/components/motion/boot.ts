// Inline <head> script (runs before first paint, appended to the boot script in components/layout/site-shell.tsx).
//
// Hero entry (art-direction §5) plays on a direct entry to any page: not when the visitor came
// from another page of this site (the curtain plays it then, transition-provider.tsx), not with a
// #hash, not under reduced motion. Same rule as the Enklawa intro (`src/layouts/Base.astro` +
// `src/scripts/intro.ts`): decide before paint and mark <html>, so the CSS entry in motion.css
// starts with the first frame and never depends on hydration (the h1 and the panorama are the
// LCP candidates). Pages without a hero simply match nothing.
//
// `data-hero-intro="boot"` is removed when the panorama animation ends (it is the longest,
// 1400 ms; pages without a panorama keep it until the safety net), on the first in-app navigation
// (transition-provider.tsx) and, as a safety net, after 6 s. The safety net only removes its own
// value: an arrival entry (`"enter"`, set by the transition) is not cut short by it.
// Removing it after the end changes nothing visually: the last keyframe equals the base style.
export const HERO_INTRO_ATTR = 'data-hero-intro'
export const HERO_INTRO_LAST_ANIMATION = 'hoc-hero-pano'
/** Longest entry on a page without a panorama: focus 1400 ms + the last line's 300 ms delay. */
export const HERO_ENTRY_MS = 1800

export const motionBootScript = `(function(){try{var r=document.documentElement;if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;var s=false;try{s=new URL(document.referrer).origin===location.origin}catch(e){}if(s)return;r.setAttribute("${HERO_INTRO_ATTR}","boot");var d=function(e){if(e&&e.animationName!=="${HERO_INTRO_LAST_ANIMATION}")return;if(r.getAttribute("${HERO_INTRO_ATTR}")==="boot")r.removeAttribute("${HERO_INTRO_ATTR}");document.removeEventListener("animationend",d)};document.addEventListener("animationend",d);setTimeout(d,6000)}catch(e){}})();`
