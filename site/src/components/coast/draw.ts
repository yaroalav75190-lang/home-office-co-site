/**
 * Draw mode for animating a <Coast> with `stroke-dashoffset` (call from client motion code).
 *
 * Why: browsers do not honour `pathLength` for dashes on `vector-effect="non-scaling-stroke"`
 * paths (Chromium applies the dash in screen pixels scaled by the user-space length — checked
 * in Chrome, Nov 2026), so `stroke-dasharray: 1; stroke-dashoffset: 1 -> 0` would show the
 * whole line at once. Draw mode switches the base paths (`[data-coast-path]`) to
 * `vector-effect: none` with the same on-screen width expressed in user units, so the
 * `pathLength="1"` recipe works everywhere:
 *
 *   setCoastDrawMode(svg, true);                 // measure + switch
 *   gsap.fromTo(svg.querySelectorAll("[data-coast-path]"),
 *     { strokeDasharray: 1, strokeDashoffset: 1 },
 *     { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut",
 *       onComplete: () => setCoastDrawMode(svg, false) });   // back to non-scaling
 *
 * For a scroll-scrubbed draw keep draw mode on and call `setCoastDrawMode(svg, true)` again
 * after a resize (e.g. in ScrollTrigger's "refresh" callback). District segments
 * (`[data-district]`) are left alone: they stay non-scaling, so their 1.5 -> 3 px width
 * transition is in screen pixels.
 */
export function setCoastDrawMode(svg: SVGSVGElement, on: boolean): void {
  const paths = svg.querySelectorAll<SVGPathElement>("[data-coast-path]");
  paths.forEach((p) => {
    p.style.removeProperty("vector-effect");
    p.style.removeProperty("stroke-width");
  });
  if (!on) return;
  paths.forEach((p) => {
    const m = p.getScreenCTM();
    const scale = m ? Math.hypot(m.a, m.b) : 0;
    if (!scale) return; // not rendered (display: none): leave as is
    const px = parseFloat(getComputedStyle(p).strokeWidth) || 1.5;
    p.style.setProperty("vector-effect", "none");
    p.style.setProperty("stroke-width", String(px / scale));
  });
}
