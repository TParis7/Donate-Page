(function() {
  /* ══════════════════════════════════════════════════════════════
     donate-combined.js v1.0.0 — Donate page injection.
     Mirrors Pulse Summit / Mentorship Guide pattern: hide Webflow
     native chrome (this page ships its own dn-nav + footer), then
     inject the full Donate HTML/CSS into a scoped #dn-root. All
     CSS scoped with --dn- prefix vars.
     Source HTML: /Website Folder/Donate Page/index.html
     Mockup:      https://tparis7.github.io/Donate-Page/
     Payments:    Monthly → Kindest (?amount=X&frequency=monthly)
                  One-time → Kindest (?amount=X)
                  Workplace → Benevity (mailto:)
     ══════════════════════════════════════════════════════════════ */

  // Guard against double execution
  if (document.getElementById('dn-root')) return;

  // ═══ 0. CANCEL WEBFLOW IX2 BODY ANIMATION ═══
  function cancelBodyAnimations() {
    if (document.body && document.body.getAnimations) {
      document.body.getAnimations().forEach(function(a) { a.cancel(); });
    }
    if (document.body) document.body.style.setProperty('opacity', '1', 'important');
  }
  cancelBodyAnimations();
  document.addEventListener('DOMContentLoaded', cancelBodyAnimations);
  window.addEventListener('load', cancelBodyAnimations);
  setTimeout(cancelBodyAnimations, 100);
  setTimeout(cancelBodyAnimations, 500);
  setTimeout(cancelBodyAnimations, 1500);

  // ═══ 1. ASSET URLS ═══
  // P3 logo hosted on Webflow CDN (same asset homepage uses) so the dn-nav loads instantly.
  var LOGO = 'https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0df1_P3%20Logo.svg';
  // Impact tile photos + dn-trust card logos live in the tparis7/Donate-Page GitHub repo.
  var IMG_BASE = 'https://tparis7.github.io/Donate-Page/';

  // Ensure Inter + Space Grotesk are loaded
  (function ensureFonts() {
    if (document.querySelector('link[data-dn-fonts]')) return;
    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    pc1.setAttribute('data-dn-fonts', '1');
    document.head.appendChild(pc1);
    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    pc2.setAttribute('data-dn-fonts', '1');
    document.head.appendChild(pc2);
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';
    l.setAttribute('data-dn-fonts', '1');
    document.head.appendChild(l);
  })();

  // ═══ 2. INJECT CSS — scoped to #dn-root with --dn- prefix ═══
  var style = document.createElement('style');
  style.setAttribute('data-dn-css', '1');
  style.innerHTML = `
/* ─── Root vars (scoped) ─── */
#dn-root {
  --dn-crimson: #D93A3A;
  --dn-crimson-dark: #B82E2E;
  --dn-crimson-tint: #FCEEEE;
  --dn-maroon: #4A1020;
  --dn-maroon-deep: #2a0a14;
  --dn-warm-gray: #FAF7F4;
  --dn-warm-gray-2: #F0EBE5;
  --dn-dark: #1a1a1a;
  --dn-light-text: #6E6A66;
  --dn-border: #E6DED4;
  --dn-green: #16A34A;
  --dn-green-tint: #E8F7EE;
  --dn-radius: 14px;
  --dn-radius-lg: 20px;
  --dn-radius-xl: 28px;
  --dn-shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
  --dn-shadow-card: 0 8px 32px rgba(0,0,0,0.06);
  --dn-shadow-hover: 0 16px 48px rgba(217,58,58,0.12);
  --dn-transition: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ─── Hide Webflow native chrome while Donate page is dn-active ─── */
body.dn-active { background: #fff; margin: 0; padding: 0; opacity: 1 !important; overflow-x: hidden; }
body.dn-active > *:not(#dn-root):not(script):not(style):not(link):not(noscript):not([data-dn-keep]) { display: none !important; }
html.dn-active { scroll-behavior: smooth; }

/* ─── Universal reset inside #dn-root ─── */
#dn-root *, #dn-root *::before, #dn-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
#dn-root {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--dn-dark); background: #fff;
  line-height: 1.6; -webkit-font-smoothing: antialiased;
}
#dn-root h1, #dn-root h2, #dn-root h3, #dn-root h4 { font-family: 'Space Grotesk', sans-serif; line-height: 1.2; }
#dn-root a { color: inherit; text-decoration: none; text-transform: none; }
#dn-root img { max-width: 100%; display: block; }
#dn-root button { font-family: inherit; cursor: pointer; border: none; background: none; text-transform: none; }
#dn-root ul { list-style: none; }

/* ═══════════ NAV (homepage parity) ═══════════ */
#dn-root .dn-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: transparent;
  transition: background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s;
}
#dn-root .dn-nav.dn-scrolled {
  background: rgba(26,26,26,0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-shadow: 0 2px 20px rgba(0,0,0,0.15);
}
/* Match homepage .p3-nav: full-width flex (NO max-width), padding 16px 40px, height driven by content (CTA 50 + 16+16 = 82). */
#dn-root .dn-nav-inner {
  max-width: none !important;
  margin: 0 !important;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 40px !important;
  min-height: 0 !important;
  height: auto !important;
}
#dn-root .dn-nav-logo {
  display: block; line-height: normal;
}
#dn-root .dn-nav-logo img {
  height: 36px !important; max-height: 36px !important;
  width: auto; object-fit: contain; display: block;
  filter: brightness(0) invert(1);
}
#dn-root .dn-nav-links {
  display: flex !important; align-items: center !important; gap: 32px !important;
  margin-left: auto !important;
}
#dn-root .dn-nav-links a {
  display: block !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important; font-weight: 500 !important;
  line-height: 30px !important;
  color: rgba(255,255,255,0.85) !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  padding: 0 !important;
  -webkit-font-smoothing: auto !important;
  -moz-osx-font-smoothing: auto !important;
  transition: color 0.2s;
}
#dn-root .dn-nav-links a:hover { color: #fff !important; }
/* Homepage .p3-nav-cta parity */
#dn-root .dn-nav .dn-nav-cta {
  display: flex !important; align-items: center !important; justify-content: center !important;
  background: var(--dn-crimson) !important;
  color: #fff !important;
  padding: 10px 24px !important;
  border-radius: 50px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important; font-weight: 600 !important;
  line-height: 30px !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  -webkit-font-smoothing: auto !important;
  -moz-osx-font-smoothing: auto !important;
  margin-left: 24px;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(217,58,58,0.3);
}
#dn-root .dn-nav .dn-nav-cta:hover {
  background: var(--dn-crimson-dark) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(217,58,58,0.4);
}
#dn-root .dn-mobile-toggle {
  display: none; background: none; border: none; cursor: pointer;
  width: 32px; height: 32px; position: relative; z-index: 1001;
}
#dn-root .dn-mobile-toggle span {
  display: block; width: 22px; height: 2px; background: #fff;
  position: absolute; left: 5px; transition: all 0.3s; border-radius: 2px;
}
#dn-root .dn-mobile-toggle span:nth-child(1) { top: 10px; }
#dn-root .dn-mobile-toggle span:nth-child(2) { top: 16px; }
#dn-root .dn-mobile-toggle span:nth-child(3) { top: 22px; }
#dn-root .dn-mobile-toggle.dn-open span:nth-child(1) { top: 16px; transform: rotate(45deg); }
#dn-root .dn-mobile-toggle.dn-open span:nth-child(2) { opacity: 0; }
#dn-root .dn-mobile-toggle.dn-open span:nth-child(3) { top: 16px; transform: rotate(-45deg); }

/* Mobile overlay menu */
#dn-root .dn-mob-overlay {
  display: none;
  position: fixed; inset: 0; z-index: 999;
  background: rgba(26,26,26,0.98);
  flex-direction: column; align-items: center; justify-content: center;
  gap: 24px;
  animation: dnFadeIn 0.25s ease;
}
#dn-root .dn-mob-overlay.dn-open { display: flex; }
#dn-root .dn-mob-overlay a {
  color: #fff; font-size: 1.4rem; font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  opacity: 0.8; transition: opacity 0.3s;
}
#dn-root .dn-mob-overlay a:hover { opacity: 1; }
#dn-root .dn-mob-overlay .dn-mob-cta {
  display: inline-flex; padding: 12px 28px;
  border-radius: 100px; background: var(--dn-crimson);
  color: #fff; font-weight: 600; font-size: 1rem;
  margin-top: 12px; opacity: 1;
}
@keyframes dnFadeIn { from { opacity: 0 } to { opacity: 1 } }

/* ═══════════ HERO ═══════════ */
#dn-root .dn-hero {
  position: relative;
  padding: 100px 48px 40px;
  background:
    radial-gradient(ellipse 60% 50% at 20% 40%, rgba(217,58,58,0.18), transparent 60%),
    radial-gradient(ellipse 50% 60% at 85% 70%, rgba(74,16,32,0.4), transparent 65%),
    linear-gradient(135deg, #1a0510 0%, var(--dn-maroon) 45%, #2a0a14 100%);
  color: #fff;
  overflow: hidden;
}
#dn-root .dn-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 1px, transparent 1px),
    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 56px 56px, 72px 72px;
  pointer-events: none;
}
#dn-root .dn-hero-inner {
  max-width: 1160px; margin: 0 auto;
  display: grid; grid-template-columns: 1.1fr 1fr;
  gap: 56px; align-items: center;
  position: relative; z-index: 2;
}
#dn-root .dn-hero-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 100px; padding: 7px 18px; margin-bottom: 22px;
  font-size: 12px; font-weight: 600;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.5px; text-transform: uppercase;
  backdrop-filter: blur(8px);
}
#dn-root .dn-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 50px; font-weight: 700;
  line-height: 1.2; letter-spacing: normal;
  color: #fff; margin-bottom: 16px;
}
#dn-root .dn-hero h1 .dn-accent { color: var(--dn-crimson); }
#dn-root .dn-impact-card h3 .dn-accent { color: var(--dn-crimson); }
#dn-root .dn-hero-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.65);
  max-width: 540px; margin-bottom: 28px;
  line-height: 1.7;
}
#dn-root .dn-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 36px; }
#dn-root .dn-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--dn-crimson); color: #fff;
  padding: 14px 32px;
  border-radius: 100px;
  font-weight: 600; font-size: 0.9rem;
  transition: all var(--dn-transition);
}
#dn-root .dn-btn-primary:hover {
  background: #fff; color: var(--dn-crimson);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
#dn-root .dn-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 14px 32px; border-radius: 100px;
  font-weight: 600; font-size: 0.9rem;
  transition: all var(--dn-transition);
}
#dn-root .dn-btn-ghost:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.6);
}
#dn-root .dn-hero-trust {
  display: flex; gap: 32px;
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.12);
}
#dn-root .dn-hero-trust-stat { display: flex; flex-direction: column; }
#dn-root .dn-hero-trust-stat .dn-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem; font-weight: 700;
  color: #fff; line-height: 1.2;
}
#dn-root .dn-hero-trust-stat .dn-lbl {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}

#dn-root .dn-hero-visual {
  position: relative;
  display: flex; justify-content: center; align-items: center;
}
#dn-root .dn-impact-card {
  width: 100%; max-width: 440px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 28px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 30px 70px -20px rgba(0,0,0,0.5);
  position: relative; overflow: hidden;
}
#dn-root .dn-impact-card::before {
  content: '';
  position: absolute; top: -20%; right: -10%;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(217,58,58,0.25), transparent 65%);
  pointer-events: none;
}
#dn-root .dn-impact-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px; font-weight: 700;
  color: #fff; margin-bottom: 6px;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
#dn-root .dn-impact-card p { font-size: 13.5px; color: rgba(255,255,255,0.65); margin-bottom: 20px; line-height: 1.5; }
#dn-root .dn-impact-stats {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px; position: relative; z-index: 1;
}
#dn-root .dn-impact-stat {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 16px 18px;
}
#dn-root .dn-impact-stat .dn-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 26px; font-weight: 700;
  color: #fff; line-height: 1; letter-spacing: -0.01em;
}
#dn-root .dn-impact-stat .dn-num .dn-unit { font-size: 16px; color: var(--dn-crimson); margin-left: 2px; }
#dn-root .dn-impact-stat .dn-lbl {
  font-size: 11.5px; color: rgba(255,255,255,0.55);
  margin-top: 6px; line-height: 1.4;
}
#dn-root .dn-impact-progress {
  margin-top: 20px; padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
  position: relative; z-index: 1;
}
#dn-root .dn-impact-progress-row {
  display: flex; justify-content: space-between;
  font-size: 12px; color: rgba(255,255,255,0.7);
  margin-bottom: 8px;
}
#dn-root .dn-impact-progress-row strong { color: #fff; font-weight: 600; }
#dn-root .dn-impact-track {
  height: 8px; background: rgba(255,255,255,0.08);
  border-radius: 50px; overflow: hidden;
}
#dn-root .dn-impact-fill {
  width: 32.87%; height: 100%;
  background: linear-gradient(90deg, var(--dn-crimson), #ff6b6b);
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(217,58,58,0.4);
}

/* ══════════════ SHARED SECTION ══════════════ */
#dn-root .dn-section-tag {
  display: inline-block; padding: 6px 16px; border-radius: 50px;
  font-size: 12px; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; margin-bottom: 16px;
}
#dn-root .dn-tag-crimson { background: var(--dn-crimson-tint); color: var(--dn-crimson); }
#dn-root .dn-tag-light { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
#dn-root .dn-tag-dark { background: rgba(26,26,26,0.06); color: var(--dn-dark); }

#dn-root .dn-section-header { text-align: center; margin-bottom: 28px; }
#dn-root .dn-section-header h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 3.2vw, 40px); font-weight: 700;
  line-height: 1.2; letter-spacing: normal;
  max-width: 720px; margin: 0 auto;
}
#dn-root .dn-section-header h2 .dn-accent { color: var(--dn-crimson); }
#dn-root .dn-section-header p {
  font-size: 16px; color: var(--dn-light-text);
  max-width: 620px; margin: 14px auto 0; line-height: 1.6;
}

/* ══════════════ GIVE NOW ══════════════ */
#dn-root .dn-give-now {
  padding: 36px 32px 36px;
  background: var(--dn-warm-gray);
  position: relative;
}
#dn-root .dn-give-inner { max-width: 1040px; margin: 0 auto; }
#dn-root .dn-give-tabs {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #fff;
  border: 1px solid var(--dn-border);
  border-radius: 18px;
  padding: 8px;
  margin-bottom: 12px;
  box-shadow: var(--dn-shadow-card);
}
#dn-root .dn-give-tab {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  background: transparent;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px; font-weight: 600;
  color: var(--dn-light-text);
  transition: all 0.25s;
  text-align: left;
  position: relative;
}
#dn-root .dn-give-tab svg { width: 20px; height: 20px; stroke: currentColor; flex-shrink: 0; }
#dn-root .dn-give-tab:hover { background: var(--dn-warm-gray-2); color: var(--dn-dark); }
#dn-root .dn-give-tab.dn-active {
  background: var(--dn-dark);
  color: #fff;
  box-shadow: 0 10px 24px -10px rgba(26,26,26,0.5);
}
#dn-root .dn-give-tab .dn-tab-title { display: block; font-size: 14.5px; line-height: 1.2; }
#dn-root .dn-give-tab .dn-tab-sub { display: block; font-size: 11px; font-weight: 500; opacity: 0.7; letter-spacing: 0.3px; margin-top: 2px; }
#dn-root .dn-give-tab-body { display: flex; flex-direction: column; gap: 1px; text-align: left; flex: 1; min-width: 0; }
#dn-root .dn-tab-pill {
  position: absolute; top: -8px; right: 10px;
  background: var(--dn-crimson); color: #fff;
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.8px;
  padding: 3px 8px; border-radius: 50px;
  text-transform: uppercase;
}

#dn-root .dn-give-panel {
  display: none;
  background: #fff;
  border: 1px solid var(--dn-border);
  border-radius: 22px;
  padding: 36px;
  box-shadow: var(--dn-shadow-card);
  animation: dnPanelIn 0.4s ease;
}
#dn-root .dn-give-panel.dn-active { display: grid; grid-template-columns: 1.1fr 1fr; gap: 36px; align-items: center; }
@keyframes dnPanelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

#dn-root .dn-panel-left h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 26px; font-weight: 700;
  color: var(--dn-dark); letter-spacing: normal;
  line-height: 1.2; margin-bottom: 10px;
}
#dn-root .dn-panel-left h3 .dn-accent { color: var(--dn-crimson); }
#dn-root .dn-panel-left p.dn-lede {
  font-size: 15px; color: var(--dn-light-text);
  line-height: 1.65; margin-bottom: 22px;
}
#dn-root .dn-panel-bullets { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
#dn-root .dn-panel-bullet {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; color: var(--dn-dark);
}
#dn-root .dn-panel-bullet svg {
  width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
  color: var(--dn-green); stroke: currentColor; stroke-width: 2;
}
#dn-root .dn-panel-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--dn-crimson); color: #fff;
  padding: 14px 26px;
  border-radius: 50px;
  font-family: 'Inter', sans-serif;
  font-size: 15px; font-weight: 600;
  line-height: 1;
  transition: all var(--dn-transition);
  box-shadow: 0 6px 20px -4px rgba(217,58,58,0.4);
}
#dn-root .dn-panel-cta .dn-cta-text { display: inline-flex; align-items: baseline; white-space: nowrap; }
#dn-root .dn-panel-cta .dn-cta-amount {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; margin: 0 2px;
}
#dn-root .dn-panel-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -4px rgba(217,58,58,0.55);
}
#dn-root .dn-panel-meta {
  margin-top: 14px;
  font-size: 12px; color: var(--dn-light-text);
}

#dn-root .dn-panel-right {
  background: var(--dn-warm-gray);
  border: 1px solid var(--dn-border);
  border-radius: 16px;
  padding: 24px;
}
#dn-root .dn-panel-right h4 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--dn-light-text);
  margin-bottom: 14px;
}
#dn-root .dn-amount-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin-bottom: 16px;
}
#dn-root .dn-amount-chip {
  background: #fff;
  border: 1.5px solid var(--dn-border);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; font-size: 18px;
  color: var(--dn-dark);
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  user-select: none;
}
#dn-root .dn-amount-chip:hover { border-color: var(--dn-crimson); transform: translateY(-1px); }
#dn-root .dn-amount-chip.dn-selected {
  background: var(--dn-crimson); color: #fff; border-color: var(--dn-crimson);
  box-shadow: 0 8px 20px -6px rgba(217,58,58,0.4);
}
#dn-root .dn-amount-chip .dn-impact {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10.5px; font-weight: 500;
  color: var(--dn-light-text);
  margin-top: 3px; letter-spacing: 0.2px;
  text-transform: none;
}
#dn-root .dn-amount-chip.dn-selected .dn-impact { color: rgba(255,255,255,0.85); }
#dn-root .dn-amount-chip.dn-custom {
  font-size: 14px; font-weight: 600;
  color: var(--dn-light-text); grid-column: 1 / -1;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
#dn-root .dn-amount-chip.dn-custom input {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; font-size: 16px;
  background: transparent; border: none; outline: none;
  color: var(--dn-dark); width: 80px; text-align: center;
  border-bottom: 1.5px dashed var(--dn-border);
}
#dn-root .dn-amount-chip.dn-custom input:focus { border-bottom-color: var(--dn-crimson); }
#dn-root .dn-benev-logo-row {
  display: flex; align-items: center; gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--dn-border);
  font-size: 12px; color: var(--dn-light-text);
}
#dn-root .dn-benev-id {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; color: var(--dn-dark); font-size: 13px;
  background: #fff; border: 1px solid var(--dn-border);
  padding: 6px 12px; border-radius: 8px;
  letter-spacing: 0.5px;
}

/* ══════════════ IMPACT TILES ══════════════ */
#dn-root .dn-impact-section { padding: 36px 32px; background: #fff; }
#dn-root .dn-impact-inner { max-width: 1160px; margin: 0 auto; }
#dn-root .dn-impact-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
#dn-root .dn-impact-tile {
  background: #fff;
  border: 1px solid var(--dn-border);
  border-radius: 18px;
  overflow: hidden;
  transition: all var(--dn-transition);
  display: flex; flex-direction: column;
  text-align: left;
}
#dn-root .dn-impact-tile:hover {
  transform: translateY(-4px);
  border-color: rgba(217,58,58,0.3);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
}
#dn-root .dn-impact-tile-photo {
  width: 100%; height: 180px;
  background-size: cover; background-position: center top;
  transition: transform 0.4s;
}
#dn-root .dn-impact-tile:hover .dn-impact-tile-photo { transform: scale(1.03); }
#dn-root .dn-impact-tile-body {
  padding: 22px 22px 26px;
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 8px; flex: 1;
}
#dn-root .dn-impact-tile h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem; font-weight: 700;
  color: var(--dn-dark); margin: 0;
  letter-spacing: normal; line-height: 1.25;
}
#dn-root .dn-impact-tile p { font-size: 0.92rem; color: var(--dn-light-text); line-height: 1.55; margin: 0; }
#dn-root .dn-impact-tile-stat {
  display: inline-flex; align-items: baseline; gap: 5px;
  margin-top: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}
#dn-root .dn-impact-tile-stat .dn-num { font-size: 1.35rem; color: var(--dn-crimson); letter-spacing: -0.01em; }
#dn-root .dn-impact-tile-stat .dn-num .dn-unit { font-size: 1rem; color: var(--dn-crimson); margin-left: 2px; }
#dn-root .dn-impact-tile-stat .dn-lbl { font-size: 0.72rem; color: var(--dn-light-text); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

/* ══════════════ PATRONS WALL ══════════════ */
#dn-root .dn-patrons {
  padding: 44px 32px 48px;
  background: linear-gradient(180deg, #FCF9F7 0%, #FFFFFF 100%);
  border-top: 1px solid var(--dn-border);
  border-bottom: 1px solid var(--dn-border);
}
#dn-root .dn-patrons-inner { max-width: 1060px; margin: 0 auto; }
#dn-root .dn-patrons-stack { display: flex; flex-direction: column; gap: 14px; margin-top: 6px; }
#dn-root .dn-patron-tier {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 28px;
  padding: 22px 26px;
  background: #fff;
  border: 1px solid var(--dn-border);
  border-radius: 16px;
  align-items: start;
  transition: border-color 0.2s, box-shadow 0.2s;
}
#dn-root .dn-patron-tier:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
#dn-root .dn-patron-tier.dn-tier-founders {
  background: linear-gradient(135deg, rgba(217,58,58,0.06) 0%, #fff 65%);
  border-color: rgba(217,58,58,0.22);
}
#dn-root .dn-patron-tier.dn-tier-champions {
  background: linear-gradient(135deg, rgba(201,149,55,0.06) 0%, #fff 65%);
  border-color: rgba(201,149,55,0.22);
}
#dn-root .dn-patron-tier.dn-tier-visionaries {
  background: linear-gradient(135deg, rgba(166,140,106,0.05) 0%, #fff 65%);
  border-color: rgba(166,140,106,0.2);
}
#dn-root .dn-tier-head { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
#dn-root .dn-patron-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}
#dn-root .dn-patron-icon svg {
  width: 20px; height: 20px;
  stroke: currentColor; stroke-width: 2;
  fill: none; stroke-linecap: round; stroke-linejoin: round;
}
#dn-root .dn-patron-tier.dn-tier-founders   .dn-patron-icon { background: rgba(217,58,58,0.13); color: var(--dn-crimson); }
#dn-root .dn-patron-tier.dn-tier-champions  .dn-patron-icon { background: rgba(201,149,55,0.14); color: #B8862E; }
#dn-root .dn-patron-tier.dn-tier-visionaries .dn-patron-icon { background: rgba(166,140,106,0.15); color: #8F7857; }
#dn-root .dn-tier-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem; font-weight: 700;
  color: var(--dn-dark); line-height: 1.2;
}
#dn-root .dn-patron-tier.dn-tier-founders .dn-tier-name { color: var(--dn-crimson); }
#dn-root .dn-patron-tier.dn-tier-champions .dn-tier-name { color: #B8862E; }
#dn-root .dn-patron-tier.dn-tier-visionaries .dn-tier-name { color: #8F7857; }
#dn-root .dn-tier-amt {
  font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 600;
  color: var(--dn-light-text);
  letter-spacing: 0.6px; text-transform: uppercase;
}
#dn-root .dn-tier-names {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem; color: var(--dn-dark);
  line-height: 1.9; letter-spacing: 0;
}
#dn-root .dn-tier-names .dn-patron { white-space: nowrap; }
#dn-root .dn-tier-names .dn-sep {
  color: var(--dn-crimson); opacity: 0.45;
  margin: 0 9px; font-weight: 600;
}
#dn-root .dn-patrons-cta {
  margin-top: 22px; text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px; color: var(--dn-light-text);
}
#dn-root .dn-patrons-cta a {
  color: var(--dn-crimson); font-weight: 600;
  border-bottom: 1px solid rgba(217,58,58,0.3);
  transition: border-color 0.2s;
}
#dn-root .dn-patrons-cta a:hover { border-bottom-color: var(--dn-crimson); }

/* ══════════════ OTHER WAYS ══════════════ */
#dn-root .dn-other-ways {
  padding: 36px 32px; background: var(--dn-dark); color: #fff;
  position: relative; overflow: hidden;
}
#dn-root .dn-other-ways::before {
  content: '';
  position: absolute; top: -150px; right: -150px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(217,58,58,0.08), transparent 70%);
}
#dn-root .dn-other-ways-inner { max-width: 1160px; margin: 0 auto; position: relative; z-index: 1; }
#dn-root .dn-other-ways .dn-section-header h2 { color: #fff; }
#dn-root .dn-other-ways .dn-section-header p { color: rgba(255,255,255,0.6); }
#dn-root .dn-other-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
#dn-root .dn-other-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 28px;
  transition: all var(--dn-transition);
  display: flex; flex-direction: column;
}
#dn-root .dn-other-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(217,58,58,0.3);
  transform: translateY(-3px);
}
#dn-root .dn-other-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(217,58,58,0.15);
  color: var(--dn-crimson);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
#dn-root .dn-other-icon svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2; fill: none; }
#dn-root .dn-other-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px; font-weight: 700;
  color: #fff; margin-bottom: 8px;
  letter-spacing: normal; line-height: 1.2;
}
#dn-root .dn-other-card p {
  font-size: 13.5px; color: rgba(255,255,255,0.6);
  line-height: 1.65; margin-bottom: 18px; flex: 1;
}
#dn-root .dn-other-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #fff;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
  transition: color 0.2s;
}
#dn-root .dn-other-link:hover { color: var(--dn-crimson); }
#dn-root .dn-other-link svg { width: 14px; height: 14px; transition: transform 0.2s; }
#dn-root .dn-other-link:hover svg { transform: translateX(2px); }

/* ══════════════ TRUST ══════════════ */
#dn-root .dn-trust { padding: 36px 32px; background: var(--dn-warm-gray); }
#dn-root .dn-trust-inner { max-width: 1160px; margin: 0 auto; }
#dn-root .dn-trust-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 36px;
}
#dn-root .dn-trust-card {
  background: #fff;
  border: 1px solid var(--dn-border);
  border-radius: 16px;
  padding: 24px;
  transition: all var(--dn-transition);
  display: flex; flex-direction: column; gap: 10px;
}
#dn-root .dn-trust-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--dn-shadow-card);
  border-color: rgba(217,58,58,0.3);
}
#dn-root .dn-trust-logo {
  height: 44px; display: flex; align-items: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800; letter-spacing: -0.01em;
  margin-bottom: 4px;
}
#dn-root .dn-trust-logo img {
  max-height: 40px; max-width: 180px;
  width: auto; height: auto;
  object-fit: contain; display: block;
}
#dn-root .dn-trust-logo .dn-irs { color: #0A3161; font-size: 18px; }
#dn-root .dn-trust-card h4 {
  font-size: 13px; font-weight: 700;
  color: var(--dn-dark); letter-spacing: 0.3px;
  text-transform: uppercase;
}
#dn-root .dn-trust-card p { font-size: 13px; color: var(--dn-light-text); line-height: 1.5; flex: 1; }
#dn-root .dn-trust-card .dn-trust-meta {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px; color: var(--dn-dark); font-weight: 600;
  padding: 6px 10px; background: var(--dn-warm-gray);
  border-radius: 8px; align-self: flex-start;
  letter-spacing: 0.3px;
}
#dn-root .dn-trust-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 600;
  color: var(--dn-crimson);
  transition: gap 0.2s;
}
#dn-root .dn-trust-link:hover { gap: 9px; }
#dn-root .dn-trust-link svg { width: 13px; height: 13px; }

/* ══════════════ FOOTER ══════════════ */
#dn-root .dn-footer {
  background: var(--dn-dark);
  color: rgba(255,255,255,0.5);
  padding: 56px 40px 32px;
}
#dn-root .dn-footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1.2fr repeat(3, 1fr);
  gap: 40px 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
#dn-root .dn-footer-brand img {
  height: 36px; width: auto; display: block;
  filter: brightness(0) invert(1);
  opacity: 0.9; margin-bottom: 14px;
}
#dn-root .dn-footer-brand p {
  font-size: 13px; line-height: 1.65;
  color: rgba(255,255,255,0.45);
  max-width: 300px;
}
#dn-root .dn-footer-brand p.dn-footer-location {
  font-size: 12px; color: rgba(255,255,255,0.35);
  margin-top: 10px; letter-spacing: 0.2px;
}
#dn-root .dn-footer-bottom-right {
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
#dn-root .dn-footer-bottom-right a {
  font-size: 12px; color: rgba(255,255,255,0.55);
  transition: color 0.2s;
}
#dn-root .dn-footer-bottom-right a:hover { color: #fff; }
#dn-root .dn-footer-col h5 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  color: #fff; margin-bottom: 16px;
}
#dn-root .dn-footer-col a {
  display: block;
  font-size: 13.5px; color: rgba(255,255,255,0.55);
  padding: 5px 0; transition: color 0.2s;
}
#dn-root .dn-footer-col a:hover { color: #fff; }
#dn-root .dn-footer-bottom {
  max-width: 1200px; margin: 24px auto 0;
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 16px;
  font-size: 12px; color: rgba(255,255,255,0.4);
}
#dn-root .dn-footer-socials { display: flex; gap: 14px; }
#dn-root .dn-footer-socials a {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
#dn-root .dn-footer-socials a:hover { background: var(--dn-crimson); }
#dn-root .dn-footer-socials svg { width: 14px; height: 14px; fill: rgba(255,255,255,0.7); }
#dn-root .dn-footer-socials a:hover svg { fill: #fff; }

/* ══════════════ RESPONSIVE ══════════════ */
@media (max-width: 991px) {
  #dn-root .dn-nav-inner { padding: 16px !important; min-height: 64px !important; height: auto !important; }
  #dn-root .dn-nav-links { display: none !important; }
  #dn-root .dn-nav .dn-nav-cta { display: none !important; }
  #dn-root .dn-mobile-toggle { display: block; }

  #dn-root .dn-hero { padding: 96px 24px 40px; }
  #dn-root .dn-hero-inner { grid-template-columns: 1fr; gap: 32px; }
  #dn-root .dn-hero-visual { max-width: 440px; margin: 0 auto; }

  #dn-root .dn-give-now, #dn-root .dn-impact-section, #dn-root .dn-other-ways, #dn-root .dn-trust {
    padding-left: 20px; padding-right: 20px;
  }
  #dn-root .dn-give-panel.dn-active { grid-template-columns: 1fr; gap: 24px; padding: 28px; }
  #dn-root .dn-impact-grid, #dn-root .dn-other-grid { grid-template-columns: repeat(2, 1fr); }
  #dn-root .dn-trust-grid { grid-template-columns: repeat(2, 1fr); }
  #dn-root .dn-hero-trust { gap: 20px; flex-wrap: wrap; }
  #dn-root .dn-footer-inner { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
  #dn-root .dn-footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 768px) {
  #dn-root .dn-hero { padding: 96px 20px 36px; }
  #dn-root .dn-hero-text { text-align: center; }
  #dn-root .dn-hero h1 { font-size: 1.9rem; line-height: 1.15; }
  #dn-root .dn-hero-sub { font-size: 1rem; max-width: 100%; margin-left: auto; margin-right: auto; }
  #dn-root .dn-hero-actions { flex-direction: column; align-items: stretch; }
  #dn-root .dn-hero-actions .dn-btn-primary, #dn-root .dn-hero-actions .dn-btn-ghost { justify-content: center; padding: 14px 24px; font-size: 14px; }
  #dn-root .dn-hero-trust {
    gap: 16px; margin-top: 24px; padding-top: 20px;
    justify-content: center; text-align: center;
  }
  #dn-root .dn-hero-trust-stat { align-items: center; }
  #dn-root .dn-hero-trust-stat .dn-num { font-size: 1.2rem; }
  #dn-root .dn-hero-trust-stat .dn-lbl { font-size: 0.68rem; }

  #dn-root .dn-impact-card { display: none !important; }
  #dn-root .dn-give-now, #dn-root .dn-impact-section, #dn-root .dn-other-ways, #dn-root .dn-trust, #dn-root .dn-patrons {
    padding-top: 32px; padding-bottom: 32px;
  }
  #dn-root .dn-patrons { padding-left: 20px; padding-right: 20px; }
  #dn-root .dn-patron-tier {
    grid-template-columns: 1fr; gap: 10px;
    padding: 18px 18px 20px; text-align: center;
  }
  #dn-root .dn-tier-head { align-items: center; }
  #dn-root .dn-tier-names { font-size: 0.9rem; line-height: 1.85; text-align: center; }
  #dn-root .dn-tier-names .dn-sep { margin: 0 7px; }
  #dn-root .dn-patron-icon { margin-left: auto; margin-right: auto; }
  #dn-root .dn-section-header { margin-bottom: 20px; }
  #dn-root .dn-section-header h2 { font-size: 26px; }
  #dn-root .dn-section-header p { font-size: 14.5px; }

  #dn-root .dn-give-tabs { grid-template-columns: repeat(3, 1fr); padding: 4px; gap: 4px; margin-bottom: 10px; }
  #dn-root .dn-give-tab { padding: 10px 6px; flex-direction: column; text-align: center; gap: 4px; }
  #dn-root .dn-give-tab svg { margin: 0 auto; }
  #dn-root .dn-give-tab-body { align-items: center; }
  #dn-root .dn-tab-title { font-size: 13px; }
  #dn-root .dn-tab-sub { display: none; }
  #dn-root .dn-tab-pill { top: 4px; right: 4px; font-size: 9px; padding: 2px 6px; }

  #dn-root .dn-give-panel.dn-active { padding: 20px; }
  #dn-root .dn-panel-left h3 { font-size: 22px; }
  #dn-root .dn-amount-grid { gap: 8px; }
  #dn-root .dn-amount-chip { padding: 12px 8px; font-size: 16px; }

  #dn-root .dn-impact-grid { grid-template-columns: 1fr; }
  #dn-root .dn-impact-tile { text-align: center; }
  #dn-root .dn-impact-tile-body { align-items: center; }
  #dn-root .dn-impact-tile-stat { justify-content: center; }

  #dn-root .dn-other-grid { grid-template-columns: 1fr; }
  #dn-root .dn-other-card { text-align: center; align-items: center; }
  #dn-root .dn-other-icon { margin-left: auto; margin-right: auto; }
  #dn-root .dn-other-link { align-self: center; }

  #dn-root .dn-trust-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  #dn-root .dn-trust-card { padding: 20px; }
  #dn-root .dn-trust-card h4 { font-size: 12px; }
  #dn-root .dn-trust-card p { font-size: 12.5px; }

  #dn-root .dn-footer-inner { grid-template-columns: 1fr 1fr; gap: 28px 20px; padding-bottom: 24px; }
  #dn-root .dn-footer-brand { grid-column: 1 / -1; }
  #dn-root .dn-footer-bottom { flex-direction: column; text-align: center; }
}
@media (max-width: 440px) {
  #dn-root .dn-hero h1 { font-size: 1.75rem; }
  #dn-root .dn-impact-stats { grid-template-columns: 1fr; }
  #dn-root .dn-hero-trust { gap: 14px; }
  #dn-root .dn-tab-title { font-size: 12px; }
  #dn-root .dn-trust-grid { gap: 10px; }
}
`;
  document.head.appendChild(style);

  // ═══ 3. ACTIVATE BODY + HTML ═══
  document.documentElement.classList.add('dn-active');
  document.body.classList.add('dn-active');

  // ═══ 4. BUILD #dn-root CONTENT ═══
  var root = document.createElement('div');
  root.id = 'dn-root';
  root.innerHTML = `

<!-- ═══ NAV ═══ -->
<div class='dn-nav' id='dn-nav'>
  <div class='dn-nav-inner'>
    <a class='dn-nav-logo' href="https://www.pulseofp3.org" aria-label="Pulse of Perseverance Project">
      <img src="${LOGO}" alt="The Pulse of Perseverance Project">
    </a>
    <div class='dn-nav-links' id="dn-navLinks">
      <a href="https://www.pulseofp3.org/for-students">For Students</a>
      <a href="https://www.pulseofp3.org/partner">For Institutions</a>
      <a href="https://www.pulseofp3.org/for-mentors">For Mentors</a>
      <a href="https://www.pulseofp3.org/about/about">About</a>
      <a href="https://www.pulseofp3.org/download" class='dn-nav-cta'>Get the App</a>
    </div>
    <button class='dn-mobile-toggle' id="dn-mobileToggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</div>

<!-- Mobile overlay -->
<div class='dn-mob-overlay' id="dn-mobOverlay">
  <a href="https://www.pulseofp3.org">Home</a>
  <a href="https://www.pulseofp3.org/for-students">For Students</a>
  <a href="https://www.pulseofp3.org/partner">For Institutions</a>
  <a href="https://www.pulseofp3.org/for-mentors">For Mentors</a>
  <a href="https://www.pulseofp3.org/about/about">About</a>
  <a href="https://www.pulseofp3.org/download" class='dn-mob-cta'>Get the App</a>
</div>

<!-- ═══ HERO ═══ -->
<section class='dn-hero'>
  <div class='dn-hero-inner'>
    <div class='dn-hero-text'>
      <h1>Fuel the next<br><span class="dn-accent">young visionary.</span></h1>
      <p class='dn-hero-sub'>Your gift fuels P3 &mdash; the mobile-first career accelerator connecting underserved students with mentors, scholarships, and workforce opportunities through AI-powered smart matching.</p>
      <div class='dn-hero-actions'>
        <a href="https://kindest.com/the-pulse-of-perseverance" target="_blank" rel="noopener" class='dn-btn-primary'>
          Give Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="#dn-give-now" class='dn-btn-ghost'>Donation Options</a>
      </div>
      <div class='dn-hero-trust'>
        <div class='dn-hero-trust-stat'><div class='dn-num'>100%</div><div class='dn-lbl'>Tax-deductible</div></div>
        <div class='dn-hero-trust-stat'><div class='dn-num'>$100K+</div><div class='dn-lbl'>In monthly scholarships</div></div>
        <div class='dn-hero-trust-stat'><div class='dn-num'>501(c)(3)</div><div class='dn-lbl'>Candid &amp; CN verified</div></div>
      </div>
    </div>
    <div class='dn-hero-visual'>
      <div class='dn-impact-card'>
        <h3>Rapidly <span class="dn-accent">Growing</span> Community.</h3>
        <p>Help us reach 3,000 students by December.</p>
        <div class='dn-impact-stats'>
          <div class='dn-impact-stat'><div class='dn-num'>850<span class='dn-unit'>+</span></div><div class='dn-lbl'>Mentees dn-active on the app</div></div>
          <div class='dn-impact-stat'><div class='dn-num'>150<span class='dn-unit'>+</span></div><div class='dn-lbl'>Professional mentors</div></div>
          <div class='dn-impact-stat'><div class='dn-num'>12<span class='dn-unit'>+</span></div><div class='dn-lbl'>Annual Scholarships</div></div>
          <div class='dn-impact-stat'><div class='dn-num'>94<span class='dn-unit'>%</span></div><div class='dn-lbl'>Program retention rate</div></div>
        </div>
        <div class='dn-impact-progress'>
          <div class='dn-impact-progress-row'><span>Path to 3,000 students</span><strong>1,000 / 3,000</strong></div>
          <div class='dn-impact-track'><div class='dn-impact-fill'></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ GIVE NOW ═══ -->
<section class='dn-give-now' id='dn-give-now'>
  <div class='dn-give-inner'>
    <div class='dn-section-header'>
      <span class="dn-section-tag dn-tag-crimson">Donations</span>
      <h2>Choose how you'd like to <span class="dn-accent">give</span>.</h2>
      <p>Sleek, secure, and tax-deductible. Pick the platform that works best for you &mdash; every path goes to the same mission.</p>
    </div>

    <div class='dn-give-tabs' role="tablist">
      <button class="dn-give-tab dn-active" data-tab="monthly" role="tab" aria-selected="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.4 0 4.6.9 6.2 2.5"/><polyline points="21 3 21 9 15 9"/></svg>
        <span class='dn-give-tab-body'>
          <span class='dn-tab-title'>Monthly</span>
          <span class='dn-tab-sub'>Kindest</span>
        </span>
        <span class='dn-tab-pill'>Most popular</span>
      </button>
      <button class='dn-give-tab' data-tab="onetime" role="tab" aria-selected="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span class='dn-give-tab-body'>
          <span class='dn-tab-title'>One-time</span>
          <span class='dn-tab-sub'>Kindest</span>
        </span>
      </button>
      <button class='dn-give-tab' data-tab="workplace" role="tab" aria-selected="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M12 11v6M9 14h6"/></svg>
        <span class='dn-give-tab-body'>
          <span class='dn-tab-title'>Workplace</span>
          <span class='dn-tab-sub'>Benevity &middot; matched</span>
        </span>
      </button>
    </div>

    <!-- Panel: Monthly (Kindest, frequency=monthly) -->
    <div class="dn-give-panel dn-active" id="panel-monthly">
      <div class='dn-panel-left'>
        <h3>Join the <span class="dn-accent">P3 Power Circle</span>.</h3>
        <p class='dn-lede'>Sustained monthly giving is the most powerful kind of support. Power Circle members fund the monthly scholarships, mentor vetting, and platform infrastructure that turn potential into workforce-ready outcomes.</p>
        <div class='dn-panel-bullets'>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Tax-deductible receipt every month</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Pause, change, or cancel anytime</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Quarterly dn-impact reports from the field</span></div>
        </div>
        <a href="https://kindest.com/the-pulse-of-perseverance?amount=25&frequency=monthly" target="_blank" rel="noopener" class='dn-panel-cta'
           data-cta-base="https://kindest.com/the-pulse-of-perseverance?frequency=monthly" data-cta="monthly">
          <span class='dn-cta-text'>Give <span class='dn-cta-amount'>$25</span>/mo on Kindest</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <div class='dn-panel-meta'>Powered by Kindest &middot; 0% platform fee</div>
      </div>
      <div class='dn-panel-right'>
        <h4>Suggested monthly gift</h4>
        <div class='dn-amount-grid' data-panel="monthly">
          <button type="button" class='dn-amount-chip' data-amount="10">$10<span class='dn-impact'>Sustains one mentorship all year</span></button>
          <button type="button" class="dn-amount-chip dn-selected" data-amount="25">$25<span class='dn-impact'>A student's full milestone year</span></button>
          <button type="button" class='dn-amount-chip' data-amount="50">$50<span class='dn-impact'>Co-sponsor an annual scholarship</span></button>
          <button type="button" class='dn-amount-chip' data-amount="100">$100<span class='dn-impact'>Sponsor scholarship in your name</span></button>
          <label class="dn-amount-chip dn-custom">Custom: $<input type="number" min="1" step="1" placeholder="Other" data-custom="monthly"></label>
        </div>
        <div class='dn-benev-logo-row'>
          <span>Sustain $100/mo for a year and an annual P3 scholarship is awarded in your name.</span>
        </div>
      </div>
    </div>

    <!-- Panel: One-time (Kindest) -->
    <div class='dn-give-panel' id="panel-onetime">
      <div class='dn-panel-left'>
        <h3>Make a <span class="dn-accent">one-time gift</span>.</h3>
        <p class='dn-lede'>Fast, secure, and flexible. A one-time donation powers monthly scholarships for visionary students, expands our mentor bench, and keeps the P3 app free for the 850+ mentees who rely on it.</p>
        <div class='dn-panel-bullets'>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Card, Apple Pay, Google Pay, bank transfer, crypto</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Instant tax-deductible receipt by email</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Option to dedicate your gift in honor of someone</span></div>
        </div>
        <a href="https://kindest.com/the-pulse-of-perseverance?amount=250" target="_blank" rel="noopener" class='dn-panel-cta'
           data-cta-base="https://kindest.com/the-pulse-of-perseverance" data-cta="onetime">
          <span class='dn-cta-text'>Donate <span class='dn-cta-amount'>$250</span> on Kindest</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <div class='dn-panel-meta'>Powered by Kindest &middot; 0% platform fee</div>
      </div>
      <div class='dn-panel-right'>
        <h4>Suggested one-time gift</h4>
        <div class='dn-amount-grid' data-panel="onetime">
          <button type="button" class='dn-amount-chip' data-amount="50">$50<span class='dn-impact'>A named shoutout on our socials</span></button>
          <button type="button" class='dn-amount-chip' data-amount="100">$100<span class='dn-impact'>A personal note from our Founder</span></button>
          <button type="button" class="dn-amount-chip dn-selected" data-amount="250">$250<span class='dn-impact'>Named in our Impact Report</span></button>
          <button type="button" class='dn-amount-chip' data-amount="1000">$1,000<span class='dn-impact'>Spotlight on P3 Patrons Wall</span></button>
          <label class="dn-amount-chip dn-custom">Custom: $<input type="number" min="1" step="1" placeholder="Other" data-custom="onetime"></label>
        </div>
        <div class='dn-benev-logo-row'>
          <span>Gifts of $1,000+ earn your spot on our public Patrons wall.</span>
        </div>
      </div>
    </div>

    <!-- Panel: Workplace (Benevity) -->
    <div class='dn-give-panel' id="panel-workplace">
      <div class='dn-panel-left'>
        <h3>Give through your <span class="dn-accent">workplace</span>.</h3>
        <p class='dn-lede'>Many employers &mdash; Google, Microsoft, Salesforce, and thousands more &mdash; match employee donations 1:1 or even 2:1 through Benevity. Find Pulse of Perseverance in your company's giving portal and double (or triple) your impact.</p>
        <div class='dn-panel-bullets'>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Corporate matching &mdash; often 1:1 or higher</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Payroll deduction &mdash; set it and forget it</span></div>
          <div class='dn-panel-bullet'><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>Volunteer Time Off (VTO) rewards convertible to grants</span></div>
        </div>
        <a href="mailto:thomas@pulseofp3.org?subject=Workplace%20Giving%20%E2%80%94%20P3%20Match" class='dn-panel-cta'>
          Get help setting this up
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <div class='dn-panel-meta'>Powered by Benevity &middot; Available in 20,000+ company giving portals</div>
      </div>
      <div class='dn-panel-right'>
        <h4>Search us in your portal</h4>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
          <div style="font-size:13px;color:var(--dn-light-text);line-height:1.55">Search for <strong style="color:var(--dn-dark)">Pulse of Perseverance Project</strong> or paste our unique identifier below:</div>
          <div class='dn-benev-id' style="text-align:center;padding:14px;font-size:15px">EIN &middot; 82-3649154</div>
          <div style="font-size:12px;color:var(--dn-light-text);text-align:center;margin-top:4px">Chicago, IL &middot; 501(c)(3) nonprofit</div>
        </div>
        <div class='dn-benev-logo-row' style="justify-content:space-between">
          <span style="flex:1">Company not listed?</span>
          <a href="mailto:thomas@pulseofp3.org" style="color:var(--dn-crimson);font-weight:600;font-size:12.5px">We'll help &rarr;</a>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- ═══ IMPACT ═══ -->
<section class='dn-impact-section'>
  <div class='dn-impact-inner'>
    <div class='dn-section-header'>
      <span class="dn-section-tag dn-tag-crimson">Your Impact</span>
      <h2>Where every dollar <span class="dn-accent">goes to work</span>.</h2>
      <p>89&cent; of every dollar funds programs. Here's the breakdown, in plain English.</p>
    </div>
    <div class='dn-impact-grid'>
      <div class='dn-impact-tile'>
        <div class='dn-impact-tile-photo' style="background-image:url('${IMG_BASE}Scholarships.jpg')"></div>
        <div class='dn-impact-tile-body'>
          <h3>Monthly Scholarships</h3>
          <p>Every month, we award scholarships directly to students through the P3 app &mdash; no essay gatekeeping, just opportunity.</p>
          <div class='dn-impact-tile-stat'><span class='dn-num'>12+</span> <span class='dn-lbl'>awarded annually</span></div>
        </div>
      </div>
      <div class='dn-impact-tile'>
        <div class='dn-impact-tile-photo' style="background-image:url('${IMG_BASE}Matching.jpg')"></div>
        <div class='dn-impact-tile-body'>
          <h3>Mentor Matching</h3>
          <p>Your gift covers the vetting, onboarding, and AI-powered smart matching of professional mentors to mentees who need them.</p>
          <div class='dn-impact-tile-stat'><span class='dn-num'>1,000<span class='dn-unit'>+</span></span> <span class='dn-lbl'>users matched</span></div>
        </div>
      </div>
      <div class='dn-impact-tile'>
        <div class='dn-impact-tile-photo' style="background-image:url('${IMG_BASE}Mobile-app.jpg'); background-position: center center;"></div>
        <div class='dn-impact-tile-body'>
          <h3>App Infrastructure</h3>
          <p>The P3 app stays free and forever will. Servers, security, and engineering make the mission run &mdash; and your gift keeps it up.</p>
          <div class='dn-impact-tile-stat'><span class='dn-num'>100%</span> <span class='dn-lbl'>free for students</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ PATRONS WALL ═══ -->
<section class='dn-patrons' id='dn-patrons'>
  <div class='dn-patrons-inner'>
    <div class='dn-section-header'>
      <span class="dn-section-tag dn-tag-crimson">Patrons Wall</span>
      <h2>Built with <span class="dn-accent">changemakers like these</span>.</h2>
      <p>Every mentor match, milestone, and scholarship happens because of them.</p>
    </div>

    <div class='dn-patrons-stack'>

      <div class="dn-patron-tier dn-tier-founders">
        <div class='dn-tier-head'>
          <div class='dn-patron-icon' aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7l4 4 5-7 5 7 4-4v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"/>
              <line x1="3" y1="19" x2="21" y2="19"/>
            </svg>
          </div>
          <span class='dn-tier-name'>Founders Circle</span>
          <span class='dn-tier-amt'>$5,000+</span>
        </div>
        <div class='dn-tier-names'>
          <span class='dn-patron'>Michelle Browder</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Lauren Cox</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Tondra Taylor</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Aubrey Thompson</span>
        </div>
      </div>

      <div class="dn-patron-tier dn-tier-champions">
        <div class='dn-tier-head'>
          <div class='dn-patron-icon' aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
          <span class='dn-tier-name'>P3 Champions</span>
          <span class='dn-tier-amt'>$1,000+</span>
        </div>
        <div class='dn-tier-names'>
          <span class='dn-patron'>Ronald Andrews</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Paulette Barrett</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Darius Bonton</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Walter Bringaze</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Grant Chavin</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Quanita Crable</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Stephanie Easton</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Ajaji Jackson</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Steffen Lewis</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Kiyan Mehdizadeh</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Geoffrey Mount Varner</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Teshona Nathaniel</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Muddassir Sana</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Matthew Valliere</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Wendell Wilkins</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Chris Williams</span>
        </div>
      </div>

      <div class="dn-patron-tier dn-tier-visionaries">
        <div class='dn-tier-head'>
          <div class='dn-patron-icon' aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class='dn-tier-name'>Visionaries</span>
          <span class='dn-tier-amt'>$500+</span>
        </div>
        <div class='dn-tier-names'>
          <span class='dn-patron'>Donald Carson</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Miangel Cody</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Michael Conners</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Edward Gleason</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Kristal J.</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>June Jesunathadas</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Cre Johnson</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Greg Madhere</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Anthony Owusu</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Aldric Pace</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Carol Pate</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Renita Rhodes</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Ernst Robinson</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Kaneda Sercye</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Leah Simmons</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Sharis Steib</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Christopher Tyson</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>James A. Washington III</span> <span class='dn-sep'>&middot;</span> <span class='dn-patron'>Parker (Matt) Word</span>
        </div>
      </div>

    </div>

    <div class='dn-patrons-cta'>
      Want your name here? <a href="#dn-give-now">Become a dn-patron with $500+ &rarr;</a>
    </div>
  </div>
</section>

<!-- ═══ TRUST ═══ -->
<section class='dn-trust'>
  <div class='dn-trust-inner'>
    <div class='dn-section-header'>
      <span class="dn-section-tag dn-tag-dark">Verified &amp; Transparent</span>
      <h2>Your trust, <span class="dn-accent">independently verified</span>.</h2>
      <p>P3 is a registered 501(c)(3) nonprofit with full transparency across the sector's major accountability platforms.</p>
    </div>
    <div class='dn-trust-grid'>
      <a class='dn-trust-card' href="https://www.charitynavigator.org/ein/823649154" target="_blank" rel="noopener">
        <div class='dn-trust-logo'><img src="${IMG_BASE}Charity-Navigator.png" alt="Charity Navigator" loading="lazy"></div>
        <h4>Charity Navigator</h4>
        <p>America's largest independent charity evaluator. Our full profile, rating, and financial transparency live here.</p>
        <span class='dn-trust-link'>View profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
      </a>
      <a class='dn-trust-card' href="https://app.candid.org/profile/9676735/pulse-of-perseverance-82-3649154" target="_blank" rel="noopener">
        <div class='dn-trust-logo'><img src="${IMG_BASE}Candid-GuideStar.png" alt="Candid GuideStar" loading="lazy"></div>
        <h4>Candid (GuideStar)</h4>
        <p>The gold standard for nonprofit transparency. See our 990, governance, and program data in full detail.</p>
        <span class='dn-trust-link'>View profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
      </a>
      <a class='dn-trust-card' href="mailto:thomas@pulseofp3.org?subject=Benevity%20Workplace%20Giving" rel="noopener">
        <div class='dn-trust-logo'><img src="${IMG_BASE}Benevity.png" alt="Benevity" loading="lazy"></div>
        <h4>Benevity Workplace</h4>
        <p>Accessible through 20,000+ corporate giving portals. Unique identifier: 82-3649154. We'll help you find us.</p>
        <span class='dn-trust-meta'>ID &middot; 82-3649154</span>
      </a>
      <div class='dn-trust-card'>
        <div class='dn-trust-logo'><span class='dn-irs'>IRS 501(c)(3)</span></div>
        <h4>Federal Tax-Exempt</h4>
        <p>Your donations are fully tax-deductible to the extent allowed by law. Receipts issued on every gift.</p>
        <span class='dn-trust-meta'>EIN &middot; 82-3649154</span>
      </div>
    </div>
  </div>
</section>

<!-- ═══ OTHER WAYS ═══ -->
<section class='dn-other-ways'>
  <div class='dn-other-ways-inner'>
    <div class='dn-section-header'>
      <span class="dn-section-tag dn-tag-light">Beyond the usual</span>
      <h2>Other <span class="dn-accent" style="color:var(--dn-crimson)">ways to give</span>.</h2>
      <p>For donors who want to build something lasting &mdash; or multiply their dn-impact through partnership.</p>
    </div>
    <div class='dn-other-grid'>
      <div class='dn-other-card'>
        <div class='dn-other-icon'><svg viewBox="0 0 24 24"><path d="M12 2L15 8.5 22 9.5 17 14.5 18 21.5 12 18 6 21.5 7 14.5 2 9.5 9 8.5 12 2z"/></svg></div>
        <h3>Named Scholarships</h3>
        <p>Fund a named award in perpetuity. Your legacy, a mentee's launchpad. Starting at $5,000 per scholarship year.</p>
        <a href="mailto:thomas@pulseofp3.org?subject=Named%20Scholarship%20Inquiry" class='dn-other-link'>
          Start the conversation
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      <div class='dn-other-card'>
        <div class='dn-other-icon'><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        <h3>Legacy &amp; Planned Giving</h3>
        <p>Include P3 in your will, trust, or donor-advised fund. We'll work with your financial advisor to structure dn-impact that outlasts you.</p>
        <a href="mailto:thomas@pulseofp3.org?subject=Legacy%20Giving%20Inquiry" class='dn-other-link'>
          Request planning guide
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      <div class='dn-other-card'>
        <div class='dn-other-icon'><svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/></svg></div>
        <h3>Corporate Partnerships</h3>
        <p>Stock gifts, multi-year sponsorships, cause-marketing campaigns, and CSR co-branding. Let's build something big together.</p>
        <a href="mailto:alex@pulseofp3.org?subject=Corporate%20Partnership%20Inquiry" class='dn-other-link'>
          Talk to our CRO
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer class='dn-footer'>
  <div class='dn-footer-inner'>
    <div class='dn-footer-brand'>
      <img src="${LOGO}" alt="Pulse of Perseverance Project">
      <p>Unlocking life-changing opportunities for young visionaries. Free on iOS &amp; Android.</p>
      <p class='dn-footer-location'>Chicago, IL &middot; Founded 2018</p>
    </div>
    <div class="dn-footer-col">
      <h5>Platform</h5>
      <a href="https://www.pulseofp3.org/for-students">For Students</a>
      <a href="https://www.pulseofp3.org/for-mentors">For Mentors</a>
      <a href="https://www.pulseofp3.org/partner">For Institutions</a>
      <a href="https://www.pulseofp3.org/scholarships">Scholarships</a>
    </div>
    <div class="dn-footer-col">
      <h5>About</h5>
      <a href="https://www.pulseofp3.org/about/about">Our Story</a>
      <a href="https://www.pulseofp3.org/about/about#team">Team</a>
      <a href="https://www.pulseofp3.org/about/annual-report">Annual Report</a>
      <a href="https://www.pulseofp3.org/about/in-the-press">Press</a>
    </div>
    <div class="dn-footer-col">
      <h5>Connect</h5>
      <a href="https://www.instagram.com/pulseofp3/" target="_blank" rel="noopener">Instagram</a>
      <a href="https://www.linkedin.com/company/pulseofperserverance/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://www.youtube.com/@pulseofperseverance" target="_blank" rel="noopener">YouTube</a>
      <a href="https://www.pulseofp3.org/donate">Donate</a>
    </div>
  </div>
  <div class='dn-footer-bottom'>
    <div>&copy; 2026 Pulse of Perseverance Project. All rights reserved.</div>
    <div class='dn-footer-bottom-right'>
      <a href="https://www.pulseofp3.org/app-terms-conditions">Terms &amp; Conditions</a>
      <div class='dn-footer-socials'>
        <a href="https://www.facebook.com/theofficialpulseofp3/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></a>
        <a href="https://www.instagram.com/pulseofp3/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
        <a href="https://www.linkedin.com/company/pulseofperserverance/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
        <a href="https://www.youtube.com/@pulseofperseverance" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
      </div>
    </div>
  </div>
</footer>
`;
  document.body.appendChild(root);

  // ═══ 5. BEHAVIOR ═══
  // Nav scroll darken
  var navEl = document.getElementById('dn-nav');
  window.addEventListener('scroll', function() {
    if (navEl) navEl.classList.toggle('dn-scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  var mobToggle = document.getElementById('dn-mobileToggle');
  var mobOverlay = document.getElementById('dn-mobOverlay');
  if (mobToggle && mobOverlay) {
    mobToggle.addEventListener('click', function() {
      mobToggle.classList.toggle('dn-open');
      mobOverlay.classList.toggle('dn-open');
      document.body.style.overflow = mobOverlay.classList.contains('dn-open') ? 'hidden' : '';
    });
    mobOverlay.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobToggle.classList.remove('dn-open');
        mobOverlay.classList.remove('dn-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Give tabs
  var tabs = root.querySelectorAll('.dn-give-tab');
  var panels = root.querySelectorAll('.dn-give-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var key = tab.dataset.tab;
      tabs.forEach(function(t) {
        var active = t.dataset.tab === key;
        t.classList.toggle('dn-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function(p) {
        p.classList.toggle('dn-active', p.id === 'panel-' + key);
      });
    });
  });

  // Amount chip selection → drive CTA URL + label
  // Handles both Kindest bases:
  //   Monthly  → https://kindest.com/the-pulse-of-perseverance?frequency=monthly  (needs &amount=X)
  //   One-time → https://kindest.com/the-pulse-of-perseverance                    (needs ?amount=X)
  function updateCta(panelKey, amount) {
    amount = parseInt(amount, 10);
    if (!amount || amount < 1) return;
    var cta = root.querySelector('.dn-panel-cta[data-cta="' + panelKey + '"]');
    if (!cta) return;
    var base = cta.getAttribute('data-cta-base');
    var joiner = base.indexOf('?') !== -1 ? '&' : '?';
    cta.href = base + joiner + 'amount=' + amount;
    var label = cta.querySelector('.dn-cta-amount');
    if (label) label.textContent = '$' + amount;
  }

  root.querySelectorAll('.dn-amount-grid').forEach(function(grid) {
    var panelKey = grid.dataset.panel;
    var chips = grid.querySelectorAll('.dn-amount-chip');
    var customInput = grid.querySelector('.dn-amount-chip.dn-custom input');

    chips.forEach(function(chip) {
      if (chip.tagName === 'BUTTON' && chip.dataset.amount) {
        chip.addEventListener('click', function() {
          chips.forEach(function(c) { c.classList.remove('dn-selected'); });
          chip.classList.add('dn-selected');
          if (customInput) customInput.value = '';
          updateCta(panelKey, chip.dataset.amount);
        });
      }
    });

    if (customInput) {
      var customLabel = customInput.closest('.dn-amount-chip.dn-custom');
      customInput.addEventListener('focus', function() {
        chips.forEach(function(c) { c.classList.remove('dn-selected'); });
        customLabel.classList.add('dn-selected');
      });
      customInput.addEventListener('input', function() {
        var v = parseInt(customInput.value, 10);
        if (v && v > 0) {
          chips.forEach(function(c) { c.classList.remove('dn-selected'); });
          customLabel.classList.add('dn-selected');
          updateCta(panelKey, v);
        }
      });
    }
  });

})();
