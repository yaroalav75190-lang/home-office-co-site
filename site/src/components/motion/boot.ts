// Inline <head> script (runs before first paint, appended to the boot script in app/layout.tsx).
//
// Home hero entry (art-direction §5) plays only on a direct entry: not when the visitor came from
// another page of this site, not with a #hash, not under reduced motion. Same rule as the
// Enklawa intro (`src/layouts/Base.astro` + `src/scripts/intro.ts`): decide before paint and mark
// <html>, so the CSS entry in motion.css starts with the first frame and never depends on
// hydration (the h1 and the panorama are the LCP candidates).
//
// `data-hero-intro` is removed when the panorama animation ends (it is the longest, 1400 ms),
// on the first in-app navigation (transition-provider.tsx) and, as a safety net, after 6 s.
// Removing it after the end changes nothing visually: the last keyframe equals the base style.
export const HERO_INTRO_ATTR = 'data-hero-intro'
export const HERO_INTRO_LAST_ANIMATION = 'hoc-hero-pano'

export const motionBootScript = `(function(){try{var r=document.documentElement;if(location.pathname!=="/"||location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;var s=false;try{s=new URL(document.referrer).origin===location.origin}catch(e){}if(s)return;r.setAttribute("${HERO_INTRO_ATTR}","");var d=function(e){if(e&&e.animationName!=="${HERO_INTRO_LAST_ANIMATION}")return;r.removeAttribute("${HERO_INTRO_ATTR}");document.removeEventListener("animationend",d)};document.addEventListener("animationend",d);setTimeout(d,6000)}catch(e){}})();`
