/* ============================================================
   [BrandName] VPN — Application Controller
   Depends on: router.js · data-download.js · data-features.js
   ============================================================ */

/* ================================================================
   SHARED RENDER HELPERS
   ================================================================ */
const H = {

  /* Escape HTML */
  esc: s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),

  /* Render breadcrumb */
  breadcrumb(items) {
    const links = items.map((item, i) => {
      if (i === items.length - 1) return `<span class="bc-cur">${item.label}</span>`;
      if (item.route) return `<span class="bc-link" onclick="Router.go('${item.route}')">${item.label}</span>`;
      return `<a href="/">${item.label}</a>`;
    }).join('<span class="bc-sep">›</span>');
    return `<nav class="breadcrumb" aria-label="Breadcrumb"><div class="wrap breadcrumb-in">${links}</div></nav>`;
  },

  /* Render app mock widget */
  appMock(mock, label) {
    const speeds = mock.upload !== '–'
      ? `<div class="mock-speeds">
           <div class="mock-speed"><div>Upload</div><div class="mock-speed-val">${mock.upload}</div></div>
           <div class="mock-speed"><div>Download</div><div class="mock-speed-val">${mock.download}</div></div>
         </div>` : '';
    const srvs = mock.servers.map(s => `
      <div class="mock-srv">
        <span class="mock-flag">${s.flag}</span>
        <div><div class="mock-srv-name">${s.name}</div><div class="mock-srv-ping">${s.ping}</div></div>
        <div class="ping-dot" style="background:${s.color}"></div>
      </div>`).join('');
    return `
      <div class="app-mock">
        <div class="mock-bar">
          <div class="mock-dot" style="background:#F87171"></div>
          <div class="mock-dot" style="background:#FBBF24"></div>
          <div class="mock-dot" style="background:#34D399"></div>
          <div class="mock-title">[BrandName] VPN${label ? ' — ' + label : ''}</div>
        </div>
        <div class="mock-body">
          <div class="mock-status">
            <div class="mock-circle">
              <svg viewBox="0 0 36 36"><path d="M18 3L30 8V16C30 23 24.6 29.4 18 31C11.4 29.4 6 23 6 16V8L18 3Z"/></svg>
            </div>
            <div class="mock-connected">${mock.connected}</div>
            <div class="mock-server">${mock.location} · WireGuard®</div>
            ${speeds}
          </div>
          <div class="mock-servers">${srvs}</div>
        </div>
      </div>`;
  },

  /* Render screenshot mock */
  ssMock(screens, label) {
    const cards = screens.map(s => {
      const body = s.bars
        ? s.bars.map(b => `
            <div class="ss-prog-row">
              <span style="min-width:72px;font-size:10px">${b.l}</span>
              <div class="ss-prog"><div class="ss-prog-fill" style="width:${b.v}%;background:${b.c}"></div></div>
              <span style="font-size:10px;color:var(--t3)">${b.v}%</span>
            </div>`).join('')
        : `<div style="font-size:12px;color:var(--t2);margin-top:4px">${s.desc}</div>
           ${s.tag ? `<div style="margin-top:6px"><span class="ss-tag" style="background:${s.tag.bg};color:${s.tag.c || s.tag.color};border:1px solid ${s.tag.bd || s.tag.border}">${s.tag.t || s.tag.text}</span></div>` : ''}`;
      return `<div class="ss-card"><div class="ss-ct">${s.title || s.t}</div>${body}</div>`;
    }).join('');
    return `
      <div class="ss-mock">
        <div class="ss-bar">
          <div class="ss-dot" style="background:#F87171"></div>
          <div class="ss-dot" style="background:#FBBF24"></div>
          <div class="ss-dot" style="background:#34D399"></div>
          <div class="ss-title">[BrandName] VPN — ${label}</div>
        </div>
        <div class="ss-body">${cards}</div>
      </div>`;
  },

  /* Render FAQ items */
  faqItems(faqs) {
    return faqs.map(([q, a]) => `
      <div class="faq-item">
        <button class="faq-btn" onclick="UI.toggleFaq(this)">${q}<span class="faq-ico">+</span></button>
        <div class="faq-ans">${a}</div>
      </div>`).join('');
  },

  /* Render SEO extended FAQ */
  seoFaqItems(faqs) {
    return faqs.map(([q, a]) => `
      <div class="seo-faq-item">
        <button class="seo-faq-btn" onclick="UI.toggleSeoFaq(this)">${q}<span class="seo-faq-ico">+</span></button>
        <div class="seo-faq-ans">${a}</div>
      </div>`).join('');
  },

  /* Render vertical steps */
  vsteps(steps) {
    return steps.map((s, i) => `
      <div class="vstep">
        <div class="vstep-num">${i + 1}</div>
        <div class="vstep-body">
          <div class="vstep-t">${s.title}</div>
          <div class="vstep-d">${s.desc}</div>
          ${s.code ? `<div class="vstep-code">${s.code.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
      </div>`).join('');
  },

  /* Render feature cards */
  featCards(feats) {
    return feats.map(f => `
      <div class="feat-card">
        <div class="feat-ico">${f.icon}</div>
        <div class="feat-t">${f.title}</div>
        <div class="feat-d">${f.desc}</div>
        <div class="feat-badge">${f.badge}</div>
      </div>`).join('');
  },

  /* Render benefit cards */
  benCards(bens) {
    return bens.map(b => `
      <div class="ben-card">
        <div class="ben-ico">${b.icon}</div>
        <div class="ben-t">${b.title}</div>
        <div class="ben-d">${b.desc}</div>
      </div>`).join('');
  },

  /* Render keyword pills */
  kwPills(kws) {
    return kws.map(k => `<span class="seo-kw">${k}</span>`).join('');
  },

  /* Render internal SEO link cards */
  seoLinks(links) {
    return links.map(l => `
      <div class="seo-link-card" onclick="${l.onclick || ''}">
        <div class="slc-label">${l.label}</div>
        <div class="slc-title">${l.title}</div>
        <div class="slc-desc">${l.desc}</div>
        <div class="slc-url">→ ${l.url}</div>
      </div>`).join('');
  },

  /* Render sub-pages directory cards */
  subpageCards(subpages) {
    return subpages.map(sp => `
      <a href="${sp.href}" class="subpage-card">
        <div class="subpage-card-top">
          <span class="subpage-card-ico">${sp.icon}</span>
          <span class="subpage-card-t">${sp.title}</span>
        </div>
        <div class="subpage-card-d">${sp.desc}</div>
        <div class="subpage-card-footer">
          <span class="tag tag-brand">${sp.badge}</span>
          <span style="font-size:12px;color:var(--brand);font-weight:600">Learn more →</span>
        </div>
      </a>`).join('');
  },

  /* CTA banner */
  ctaBanner(title, note, btns) {
    const btnHTML = btns.map(b =>
      `<button class="btn-lg ${b.primary ? 'btn-lg-p' : 'btn-lg-o'}"
        ${!b.primary ? 'style="border:1px solid var(--bdr)"' : ''}>${b.label}</button>`
    ).join('');
    return `
      <div class="cta-banner">
        <div class="wrap"><div class="cta-banner-in">
          <h2>${title}</h2>
          <p>7-day free trial. No credit card required. Cancel anytime.</p>
          <div class="cta-btns">${btnHTML}</div>
          <p class="cta-note">${note || '30-day money-back guarantee · 5 devices · All platforms'}</p>
        </div></div>
      </div>`;
  },

  /* Page visibility */
  showOnly(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    const el = document.getElementById(id);
    if (el) el.classList.add('on');
  },

  /* Inject sub-page content */
  renderSub(html) {
    const root = document.getElementById('sub-root');
    if (root) root.innerHTML = html;
    H.showOnly('pg-sub');
  },

};

/* ================================================================
   UI INTERACTIONS
   ================================================================ */
const UI = {
  toggleFaq(btn) {
    const ans = btn.nextElementSibling;
    const ico = btn.querySelector('.faq-ico');
    const open = ans.classList.toggle('op');
    ico.classList.toggle('op', open);
    ico.textContent = open ? '−' : '+';
  },
  toggleSeoFaq(btn) {
    const ans = btn.nextElementSibling;
    const ico = btn.querySelector('.seo-faq-ico');
    const open = ans.classList.toggle('op');
    ico.classList.toggle('op', open);
    ico.textContent = open ? '−' : '+';
  },
};

/* ================================================================
   SHARED SEO LINK SECTIONS
   ================================================================ */
const SHARED_SEO_LINKS_DOWNLOAD = [
  { label:'Use cases', title:'🎬 VPN for Streaming',   desc:'Unblock Netflix, Disney+, BBC iPlayer worldwide.',         url:'/vpn-for-streaming',    onclick:"Router.go('features/streaming')" },
  { label:'Use cases', title:'🎮 VPN for Gaming',      desc:'Lower ping, stop DDoS, unlock regional servers.',          url:'/vpn-for-gaming',       onclick:"Router.go('features/gaming')" },
  { label:'Use cases', title:'⬇ VPN for Torrenting',  desc:'P2P-optimized anonymous downloads.',                       url:'/vpn-for-torrenting',   onclick:"Router.go('features/torrent')" },
  { label:'Features',  title:'🛡 Kill Switch',          desc:'How our kill switch prevents IP leaks on all platforms.',  url:'/features/kill-switch', onclick:"Router.go('features/core')" },
  { label:'Features',  title:'📋 No-log Policy',        desc:'Our verified, audited no-log policy explained.',           url:'/features/no-logs',     onclick:"Router.go('features/core')" },
  { label:'Guide',     title:'📖 Setup guides',         desc:'Step-by-step setup for every platform.',                  url:'/guides/setup',         onclick:"" },
  { label:'Pricing',   title:'💰 Pricing plans',        desc:'Monthly, annual, 2-year — 30-day money-back.',            url:'/pricing',              onclick:"" },
  { label:'Blog',      title:'📰 Blog & guides',        desc:'VPN tips, how-tos, and security news.',                   url:'/blog',                 onclick:"" },
  { label:'Download',  title:'📥 All platforms',        desc:'Download page for all 8 supported platforms.',             url:'/download',             onclick:"Router.go('download')" },
];

const SHARED_SEO_LINKS_FEATURES = [
  { label:'Download',  title:'🪟 Download for Windows', desc:'Full-featured VPN app for Windows 10/11.',                url:'/download/windows',     onclick:"Router.go('download/windows')" },
  { label:'Download',  title:'🍎 Download for Mac',     desc:'Native Apple Silicon build for macOS.',                   url:'/download/mac',         onclick:"Router.go('download/mac')" },
  { label:'Download',  title:'🤖 Download for Android', desc:'Lightweight VPN app for Android 8+.',                    url:'/download/android',     onclick:"Router.go('download/android')" },
  { label:'Features',  title:'🛡 Kill Switch',           desc:'How our kill switch prevents IP leaks on all platforms.', url:'/features/kill-switch', onclick:"Router.go('features/core')" },
  { label:'Features',  title:'🔀 Split Tunneling',       desc:'Route specific apps outside the VPN tunnel.',            url:'/features/split-tunnel',onclick:"Router.go('features/core')" },
  { label:'Pricing',   title:'💰 Pricing plans',         desc:'Monthly, annual, 2-year — 30-day money-back.',           url:'/pricing',              onclick:"" },
  { label:'Guide',     title:'📖 Setup guides',          desc:'Step-by-step guides for all devices.',                   url:'/guides/setup',         onclick:"" },
  { label:'Blog',      title:'📰 VPN blog & news',       desc:'Tips, guides, and security news.',                      url:'/blog',                 onclick:"" },
  { label:'Use cases', title:'🎬 VPN for Streaming',    desc:'Unblock Netflix, Disney+, and 30+ services.',            url:'/vpn-for-streaming',    onclick:"Router.go('features/streaming')" },
];

/* ================================================================
   DOWNLOAD PAGE CONTROLLER
   ================================================================ */
const App = {

  /* ── Download main page ── */
  showDownloadMain() {
    H.showOnly('pg-main-download');
    /* update meta */
    document.title = 'Download [BrandName] VPN – Windows, Mac, iOS, Android & More';
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Download [BrandName] VPN for all devices. Secure, fast VPN apps for Windows, Mac, iOS, Android, Linux, Chrome, Firefox and Smart TV. Free 7-day trial.');
  },

  /* ── Download sub-page ── */
  showDownloadSub(id) {
    const d = DOWNLOAD_DATA[id];
    if (!d) return App.showDownloadMain();

    /* Update meta */
    document.title = d.seo.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.seo.metaDesc);

    /* Build platform buttons (quick nav) */
    const btnsHTML = d.btns.map(b =>
      `<button class="${b.primary ? 'dl-btn-primary' : 'dl-btn-secondary'}">${b.label}</button>`
    ).join('');

    /* Related platforms */
    const relHTML = d.related.map(r => {
      const m = PLATFORM_META[r];
      return `<div class="rel-card" onclick="Router.go('download/${r}')">
        <span class="rel-ico">${m.icon}</span>
        <div><div class="rel-name">VPN for ${m.name}</div><div class="rel-os">${DOWNLOAD_DATA[r].compat.split('·')[0].trim()}</div></div>
        <span class="rel-arr">→</span>
      </div>`;
    }).join('');

    H.renderSub(`
      ${H.breadcrumb([
        { label: 'Home', route: null },
        { label: 'Download VPN', route: 'download' },
        { label: d.h1 },
      ])}

      <!-- HERO -->
      <div class="sub-hero-wrap">
        <div class="wrap sub-hero-in">
          <div>
            <div class="sub-plat-badge">${d.icon} ${d.name}</div>
            <h1>${d.h1}</h1>
            <p class="sub-subtitle">${d.sub}</p>
            <p class="sub-lead">${d.lead}</p>
            <div class="dl-btns-col">${btnsHTML}</div>
            <div class="meta-pills">${d.meta.map(m => `<span class="meta-pill">${m}</span>`).join('')}</div>
            <div class="sub-rating"><span class="stars">★★★★★</span><span>${d.rating}</span></div>
          </div>
          ${H.appMock(d.mock, d.name)}
        </div>
      </div>

      <!-- SEO BLOCK 1: Keyword-rich intro -->
      <div class="seo-intro">
        <div class="wrap seo-intro-in">
          <div class="seo-intro-text">
            <h2>${d.seo.introH2}</h2>
            <p>${d.seo.introText}</p>
          </div>
          <div>
            <div class="seo-kw-title">Related searches</div>
            <div class="seo-kw-list">${H.kwPills(d.seo.keywords)}</div>
          </div>
        </div>
      </div>

      <!-- SCREENSHOT + DOWNLOAD BOX + BENEFITS -->
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div style="margin-bottom:32px">${H.ssMock(d.screens, d.name + ' app')}</div>
          <div style="display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start">
            <div>
              <div class="sec-lbl" style="margin-bottom:12px">Platform benefits</div>
              <div class="ben-grid-3">${H.benCards(d.benefits)}</div>
            </div>
            <div>
              <div class="sec-lbl" style="margin-bottom:12px">Download details</div>
              <div class="dl-box">
                <div class="dl-box-head">
                  <div class="dl-box-ico">${d.icon}</div>
                  <div><div class="dl-box-t">${d.h1}</div><div class="dl-box-sub">${d.sub}</div></div>
                </div>
                <div class="dl-box-meta">
                  <div class="dl-meta-i"><div class="dl-meta-l">Version</div><div class="dl-meta-v">${d.version}</div></div>
                  <div class="dl-meta-i"><div class="dl-meta-l">File size</div><div class="dl-meta-v">${d.size}</div></div>
                  <div class="dl-meta-i"><div class="dl-meta-l">Updated</div><div class="dl-meta-v">${d.updated}</div></div>
                  <div class="dl-meta-i"><div class="dl-meta-l">OS</div><div class="dl-meta-v">${d.compat.split('·')[0].trim()}</div></div>
                </div>
                <div class="dl-btns-col">${btnsHTML}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEO BLOCK 2: "Why Choose" editorial -->
      <div class="seo-editorial">
        <div class="wrap">
          <div style="margin-bottom:24px">
            <div class="sec-lbl">In depth</div>
            <h2 class="sec-h2">${d.seo.editorialH}</h2>
          </div>
          <div class="seo-editorial-in">
            <div class="seo-editorial-col">
              <p>${d.seo.editorialP1}</p>
              <ul>${d.seo.editorialBullets.map(b => `<li><span class="ed-chk">✓</span>${b}</li>`).join('')}</ul>
            </div>
            <div class="seo-editorial-col"><p>${d.seo.editorialP2}</p></div>
          </div>
        </div>
      </div>

      <!-- HOW TO INSTALL + FEATURES -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px">
            <div>
              <div class="sec-lbl">Installation guide</div>
              <h2 class="sec-h2" style="margin-bottom:28px">How to install</h2>
              <div class="vsteps">${H.vsteps(d.steps)}</div>
            </div>
            <div>
              <div class="sec-lbl" style="margin-bottom:12px">Features</div>
              <div class="feat-grid-3">${H.featCards(d.features)}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEO BLOCK 3: Internal links -->
      <div class="seo-links">
        <div class="wrap">
          <div class="seo-links-head">
            <div class="sec-lbl">Related pages</div>
            <h2>Explore related guides</h2>
            <p>More from [BrandName] VPN — use cases, features, and setup guides.</p>
          </div>
          <div class="seo-links-grid">${H.seoLinks(SHARED_SEO_LINKS_DOWNLOAD.slice(0, 6))}</div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="sec">
        <div class="wrap" style="max-width:760px">
          <div class="sc"><div class="sec-lbl">FAQ</div><h2 class="sec-h2">Questions about ${d.h1}</h2></div>
          <div class="faq-list">${H.faqItems(d.faqs)}</div>
        </div>
      </section>

      <!-- RELATED PLATFORMS -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Other platforms</div><h2 class="sec-h2">Also available on</h2></div>
          <div class="rel-grid">${relHTML}</div>
        </div>
      </section>

      ${H.ctaBanner(d.h1 + ' — Download Now', '30-day money-back guarantee · 5 simultaneous devices', d.btns)}
    `);
  },

  /* ── Features main page ── */
  showFeaturesMain() {
    H.showOnly('pg-main-features');
    document.title = 'VPN Uses & Features – [BrandName] VPN';
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Explore how [BrandName] VPN helps with streaming, gaming, torrenting, and secure browsing. All core features included in every plan.');
  },

  /* ── Features sub-page ── */
  showFeaturesSub(id) {
    const d = FEATURES_DATA[id];
    if (!d) return App.showFeaturesMain();

    document.title = d.seo.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.seo.metaDesc);

    /* Build hero visual */
    const visRows = d.vis.rows.map(r => `
      <div class="feat-vis-row">
        <div class="feat-vis-row-ico">${r.icon}</div>
        <div>
          <div class="feat-vis-row-t">${r.title}</div>
          <div class="feat-vis-row-d">${r.desc}</div>
        </div>
        <div class="feat-vis-row-tag">
          <span class="tag" style="background:${r.tag.bg};color:${r.tag.color};border:1px solid ${r.tag.border}">${r.tag.text}</span>
        </div>
      </div>`).join('');
    const visMetrics = d.vis.metrics.map(m => `
      <div class="feat-vis-metric">
        <div class="feat-vis-metric-v">${m.value}</div>
        <div class="feat-vis-metric-l">${m.label}</div>
      </div>`).join('');

    /* Related use cases */
    const FEAT_META = {
      streaming:{ n:'Streaming VPN', i:'🎬' },
      torrent:  { n:'Torrent VPN',   i:'⬇' },
      gaming:   { n:'Gaming VPN',    i:'🎮' },
      browsing: { n:'Secure Browsing',i:'🛡' },
      features: { n:'Core Features', i:'⚙' },
    };
    const FEAT_ROUTE = { streaming:'streaming', torrent:'torrent', gaming:'gaming', browsing:'browsing', features:'core' };

    const relHTML = d.related.map(r => {
      const m = FEAT_META[r];
      return `<div class="rel-card" onclick="Router.go('features/${FEAT_ROUTE[r]}')">
        <span class="rel-ico">${m.i}</span>
        <div><div class="rel-name">${m.n}</div><div class="rel-os">${FEATURES_DATA[r].sub.substring(0, 40)}…</div></div>
        <span class="rel-arr">→</span>
      </div>`;
    }).join('');

    /* Problem / Solution */
    const probsHTML = d.problems.map(p => `<li><span class="ps-x">✗</span><span>${p}</span></li>`).join('');
    const solsHTML  = d.solutions.map(s => `<li><span class="ps-ok">✓</span><span>${s}</span></li>`).join('');

    /* Steps (3-col for features) */
    const stepsHTML = `
      <div class="how-steps-row">
        ${d.steps.map((s, i) => `
          <div class="how-step">
            <div class="how-num">${i + 1}</div>
            <div class="how-t">${s.title}</div>
            <div class="how-d">${s.desc}</div>
          </div>`).join('')}
      </div>`;

    /* Scenarios */
    const scenHTML = d.scenarios.map(s => `
      <div class="scen-card">
        <div class="scen-ico">${s.icon}</div>
        <div class="scen-t">${s.title}</div>
        <div class="scen-d">${s.desc}</div>
        <div class="scen-badge">${s.badge}</div>
      </div>`).join('');

    H.renderSub(`
      ${H.breadcrumb([
        { label: 'Home', route: null },
        { label: 'Uses & Features', route: 'features' },
        { label: d.h1 },
      ])}

      <!-- HERO -->
      <div class="feat-sub-hero">
        <div class="wrap feat-sub-hero-in">
          <div>
            <div class="feat-sub-badge" style="background:${d.badge.bg};color:${d.badge.color};border:1px solid ${d.badge.border}">
              ${d.icon} ${d.badge.text}
            </div>
            <h1>${d.h1}</h1>
            <p class="sh-sub">${d.sub}</p>
            <p style="font-size:15px;color:var(--t2);line-height:1.7;margin-bottom:28px;max-width:520px">${d.lead}</p>
            <div class="feat-sub-btns">
              ${d.btns.map(b => `<button class="btn-lg ${b.primary ? 'btn-lg-p' : 'btn-lg-o'}" ${!b.primary ? 'style="border:1px solid var(--bdr)"' : ''}>${b.label}</button>`).join('')}
            </div>
            <div class="feat-sub-trust">
              <span class="stars">★★★★★</span>
              <span>${d.trust}</span>
            </div>
          </div>
          <div class="feat-vis">
            <div class="feat-vis-bar">
              <div class="feat-vis-dot" style="background:#F87171"></div>
              <div class="feat-vis-dot" style="background:#FBBF24"></div>
              <div class="feat-vis-dot" style="background:#34D399"></div>
              <div class="feat-vis-title">[BrandName] — ${d.badge.text}</div>
            </div>
            <div class="feat-vis-body">
              ${visRows}
              <div class="feat-vis-metrics">${visMetrics}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO BLOCK 1: Keyword-rich intro -->
      <div class="seo-intro">
        <div class="wrap seo-intro-in">
          <div class="seo-intro-text">
            <h2>${d.seo.introH2}</h2>
            <p>${d.seo.introText}</p>
          </div>
          <div>
            <div class="seo-kw-title">Related searches</div>
            <div class="seo-kw-list">${H.kwPills(d.seo.keywords)}</div>
          </div>
        </div>
      </div>

      <!-- PROBLEM / SOLUTION -->
      <section class="sec">
        <div class="wrap">
          <div class="sc">
            <div class="sec-lbl">The problem & solution</div>
            <h2 class="sec-h2">Why you need a VPN for ${d.badge.text.replace(' VPN','')}</h2>
          </div>
          <div class="ps-grid">
            <div class="ps-card ps-bad"><div class="ps-title">❌ Problems without VPN</div><ul class="ps-list">${probsHTML}</ul></div>
            <div class="ps-card ps-good"><div class="ps-title">✅ How [BrandName] VPN helps</div><ul class="ps-list">${solsHTML}</ul></div>
          </div>
        </div>
      </section>

      <!-- BENEFITS -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Key benefits</div><h2 class="sec-h2">What you get with [BrandName]</h2></div>
          <div class="ben-grid-3">${H.benCards(d.benefits)}</div>
        </div>
      </section>

      <!-- HOW IT WORKS (3 steps) -->
      <section class="sec">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">How it works</div><h2 class="sec-h2">Get started in 3 steps</h2></div>
          ${stepsHTML}
        </div>
      </section>

      <!-- SEO BLOCK 2: "Why Choose" editorial -->
      <div class="seo-editorial">
        <div class="wrap">
          <div style="margin-bottom:24px">
            <div class="sec-lbl">In depth</div>
            <h2 class="sec-h2">${d.seo.editorialH}</h2>
          </div>
          <div class="seo-editorial-in">
            <div class="seo-editorial-col">
              <p>${d.seo.editorialP1}</p>
              <ul>${d.seo.editorialBullets.map(b => `<li><span class="ed-chk">✓</span>${b}</li>`).join('')}</ul>
            </div>
            <div class="seo-editorial-col"><p>${d.seo.editorialP2}</p></div>
          </div>
        </div>
      </div>

      <!-- FEATURES GRID -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Features</div><h2 class="sec-h2">Everything included on ${d.badge.text}</h2></div>
          <div class="feat-grid-3">${H.featCards(d.features)}</div>
        </div>
      </section>

      <!-- SCENARIOS -->
      <section class="sec">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Real-world scenarios</div><h2 class="sec-h2">See it in action</h2></div>
          <div class="scen-grid">${scenHTML}</div>
        </div>
      </section>

      <!-- SCREENSHOT MOCK -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">App preview</div><h2 class="sec-h2">${d.h1} — inside the app</h2></div>
          ${H.ssMock(d.screens, d.badge.text)}
        </div>
      </section>

      <!-- SUB-PAGES DIRECTORY -->
      <section class="sec">
        <div class="wrap">
          <div class="sc">
            <div class="sec-lbl">Explore in depth</div>
            <h2 class="sec-h2" id="subpages-h2">Detailed ${d.badge.text} guides</h2>
            <p class="sec-lead">Platform-specific and service-specific guides for ${d.badge.text.toLowerCase()}.</p>
          </div>
          <div class="subpages-grid">${H.subpageCards(d.subpages)}</div>
        </div>
      </section>

      <!-- SEO BLOCK 3: Internal links -->
      <div class="seo-links">
        <div class="wrap">
          <div class="seo-links-head">
            <div class="sec-lbl">Related pages</div>
            <h2>Explore more from [BrandName] VPN</h2>
            <p>Download pages, feature guides, pricing, and setup resources.</p>
          </div>
          <div class="seo-links-grid">${H.seoLinks(SHARED_SEO_LINKS_FEATURES.slice(0, 6))}</div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="sec">
        <div class="wrap" style="max-width:760px">
          <div class="sc"><div class="sec-lbl">FAQ</div><h2 class="sec-h2">Questions about ${d.badge.text}</h2></div>
          <div class="faq-list">${H.faqItems(d.faqs)}</div>
        </div>
      </section>

      <!-- RELATED USE CASES -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Other use cases</div><h2 class="sec-h2">Also explore</h2></div>
          <div class="rel-grid">${relHTML}</div>
        </div>
      </section>

      ${H.ctaBanner('Try VPN for ' + d.badge.text, '30-day money-back guarantee · 5 simultaneous devices', d.btns)}
    `);
  },

  /* ══════════════════════════════════════════════
     LOCATIONS — MAIN HUB
  ══════════════════════════════════════════════ */
  showLocationsMain() {
    H.showOnly('pg-main-locations');
    document.title = 'VPN Servers Worldwide \u2013 60+ Countries | [BrandName] VPN';
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Browse [BrandName] VPN servers in 60+ countries. Fast, secure VPN servers for streaming, gaming, and private browsing worldwide.');
  },

  /* ══════════════════════════════════════════════
     LOCATIONS — SUB-PAGE (per country)
  ══════════════════════════════════════════════ */
  showLocationSub(id) {
    const d = LOCATIONS_DATA[id];
    if (!d) return App.showLocationsMain();

    document.title = d.seo.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.seo.metaDesc);

    /* Download buttons */
    const btnsHTML = d.btns.map(b =>
      `<button class="btn-lg ${b.primary ? 'btn-lg-p' : 'btn-lg-o'}" ${!b.primary ? 'style="border:1px solid var(--bdr)"' : ''}>${b.label}</button>`
    ).join('');

    /* Problem / Solution */
    const probHTML = d.problems.map(p => `<li><span class="ps-x">\u2717</span><span>${p}</span></li>`).join('');
    const solHTML  = d.solutions.map(s => `<li><span class="ps-ok">\u2713</span><span>${s}</span></li>`).join('');

    /* Benefits */
    const benHTML = d.benefits.map(b => `
      <div class="ben-card">
        <div class="ben-ico">${b.icon}</div>
        <div class="ben-t">${b.title}</div>
        <div class="ben-d">${b.desc}</div>
      </div>`).join('');

    /* Steps */
    const stepsHTML = `
      <div class="how-steps-row">
        ${d.steps.map((s, i) => `
          <div class="how-step">
            <div class="how-num">${i + 1}</div>
            <div class="how-t">${s.title}</div>
            <div class="how-d">${s.desc}</div>
          </div>`).join('')}
      </div>`;

    /* Features */
    const featHTML = H.featCards(d.features);

    /* Scenarios */
    const scenHTML = d.scenarios.map(s => `
      <div class="scen-card">
        <div class="scen-ico">${s.icon}</div>
        <div class="scen-t">${s.title}</div>
        <div class="scen-d">${s.desc}</div>
        <div class="scen-badge">${s.badge}</div>
      </div>`).join('');

    /* Related countries */
    const relHTML = d.related.map(r => {
      const m = LOCATIONS_DATA[r] || LOCATIONS_HUB_LIST.find(x => x.id === r);
      if (!m) return '';
      const flag = m.flag || '';
      const name = m.fullName || m.name || r;
      return `<div class="rel-card" onclick="Router.go('vpn-locations/${r}')">
        <span class="rel-ico">${flag}</span>
        <div><div class="rel-name">VPN for ${name}</div><div class="rel-os">${(LOCATIONS_DATA[r]?.serverCount || '') + (LOCATIONS_DATA[r] ? ' servers' : '')}</div></div>
        <span class="rel-arr">\u2192</span>
      </div>`;
    }).join('');

    /* FAQ */
    const faqHTML = H.faqItems(d.faqs);

    /* Server info box */
    const si = d.serverInfo;

    /* Legal status badge */
    const legalBadge = `<span style="display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:${d.legal.statusColor}20;color:${d.legal.statusColor};border:1px solid ${d.legal.statusColor}40">\u25cf ${d.legal.status}</span>`;

    H.renderSub(`
      ${H.breadcrumb([
        { label: 'Home', route: null },
        { label: 'VPN Locations', route: 'vpn-locations' },
        { label: d.h1 },
      ])}

      <!-- HERO -->
      <div class="feat-sub-hero">
        <div class="wrap feat-sub-hero-in">
          <div>
            <div class="feat-sub-badge" style="background:${d.badgeBg};color:${d.badgeColor};border:1px solid ${d.badgeBorder}">
              ${d.flag} ${d.trustBadge}
            </div>
            <h1>${d.h1}</h1>
            <p class="sh-sub">${d.sub}</p>
            <p style="font-size:15px;color:var(--t2);line-height:1.7;margin-bottom:28px;max-width:520px">${d.lead}</p>
            <div class="feat-sub-btns">${btnsHTML}</div>
            <div class="feat-sub-trust">
              <span class="stars">\u2605\u2605\u2605\u2605\u2605</span>
              <span>4.8/5 \u00b7 10M+ Users \u00b7 ${d.serverCount} servers in ${d.fullName}</span>
            </div>
          </div>
          <!-- Server info box -->
          <div style="background:var(--bg2);border:1px solid var(--bdr);border-radius:var(--rxl);padding:28px">
            <div style="font-size:36px;margin-bottom:12px">${d.flag}</div>
            <div style="font-size:20px;font-weight:800;letter-spacing:-.4px;margin-bottom:4px">VPN for ${d.fullName}</div>
            <div style="font-size:13px;color:var(--t2);margin-bottom:20px">${d.sub}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
              <div class="dl-meta-i"><div class="dl-meta-l">Servers</div><div class="dl-meta-v">${si.count}+</div></div>
              <div class="dl-meta-i"><div class="dl-meta-l">Cities</div><div class="dl-meta-v">${si.cities} cities</div></div>
              <div class="dl-meta-i"><div class="dl-meta-l">Bandwidth</div><div class="dl-meta-v">${si.speed}</div></div>
              <div class="dl-meta-i"><div class="dl-meta-l">Speciality</div><div class="dl-meta-v" style="font-size:12px">${si.speciality}</div></div>
            </div>
            <div style="font-size:12px;color:var(--t2);margin-bottom:12px;font-weight:600">Protocols</div>
            <div style="font-size:13px;color:var(--t2);margin-bottom:20px">${si.protocols}</div>
            <div style="font-size:12px;color:var(--t2);font-weight:600;margin-bottom:8px">Cities covered</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${d.cities.map(c => `<span style="font-size:12px;padding:3px 10px;border-radius:20px;border:1px solid var(--bdr);color:var(--t2);background:#fff">${c}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- SEO BLOCK 1: Keyword-rich intro -->
      <div class="seo-intro">
        <div class="wrap seo-intro-in">
          <div class="seo-intro-text">
            <h2>${d.seo.introH2}</h2>
            <p>${d.seo.introText}</p>
          </div>
          <div>
            <div class="seo-kw-title">Related searches</div>
            <div class="seo-kw-list">${H.kwPills(d.seo.keywords)}</div>
          </div>
        </div>
      </div>

      <!-- PROBLEM / SOLUTION -->
      <section class="sec">
        <div class="wrap">
          <div class="sc">
            <div class="sec-lbl">The problem & solution</div>
            <h2 class="sec-h2">Why you need a VPN for ${d.fullName}</h2>
          </div>
          <div class="ps-grid">
            <div class="ps-card ps-bad"><div class="ps-title">\u274c Problems without VPN</div><ul class="ps-list">${probHTML}</ul></div>
            <div class="ps-card ps-good"><div class="ps-title">\u2705 How [BrandName] VPN helps</div><ul class="ps-list">${solHTML}</ul></div>
          </div>
        </div>
      </section>

      <!-- KEY BENEFITS -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Key benefits</div><h2 class="sec-h2">What you get with ${d.h1}</h2></div>
          <div class="ben-grid-3">${benHTML}</div>
        </div>
      </section>

      <!-- HOW TO CONNECT -->
      <section class="sec">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">How to connect</div><h2 class="sec-h2">Get a ${d.fullName} IP in 3 steps</h2></div>
          ${stepsHTML}
        </div>
      </section>

      <!-- SEO BLOCK 2: "Why Choose" editorial -->
      <div class="seo-editorial">
        <div class="wrap">
          <div style="margin-bottom:24px">
            <div class="sec-lbl">In depth</div>
            <h2 class="sec-h2">${d.seo.editorialH}</h2>
          </div>
          <div class="seo-editorial-in">
            <div class="seo-editorial-col">
              <p>${d.seo.editorialP1}</p>
              <ul>${d.seo.editorialBullets.map(b => `<li><span class="ed-chk">\u2713</span>${b}</li>`).join('')}</ul>
            </div>
            <div class="seo-editorial-col"><p>${d.seo.editorialP2}</p></div>
          </div>
        </div>
      </div>

      <!-- FEATURES -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Features</div><h2 class="sec-h2">${d.fullName} VPN server details</h2></div>
          <div class="feat-grid-3">${featHTML}</div>
        </div>
      </section>

      <!-- USE CASE SCENARIOS -->
      <section class="sec">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Real-world scenarios</div><h2 class="sec-h2">What people use ${d.h1} for</h2></div>
          <div class="scen-grid">${scenHTML}</div>
        </div>
      </section>

      <!-- LEGAL NOTICE -->
      <section class="sec sec-alt">
        <div class="wrap" style="max-width:760px">
          <div class="sec-lbl">Legal information</div>
          <h2 class="sec-h2" style="margin-bottom:16px">VPN legality in ${d.fullName} ${legalBadge}</h2>
          <p style="font-size:14px;color:var(--t2);line-height:1.8">${d.legal.text}</p>
        </div>
      </section>

      <!-- SEO BLOCK 3: Internal links -->
      <div class="seo-links">
        <div class="wrap">
          <div class="seo-links-head">
            <div class="sec-lbl">Related pages</div>
            <h2>Explore more from [BrandName] VPN</h2>
            <p>Other country VPN pages, use cases, and download guides.</p>
          </div>
          <div class="seo-links-grid">
            <div class="seo-link-card" onclick="Router.go('features/streaming')">
              <div class="slc-label">Use case</div><div class="slc-title">\ud83c\udfac Best VPN for Streaming</div>
              <div class="slc-desc">All streaming platforms and supported services explained.</div>
              <div class="slc-url">\u2192 /features/streaming</div>
            </div>
            <div class="seo-link-card" onclick="Router.go('features/gaming')">
              <div class="slc-label">Use case</div><div class="slc-title">\ud83c\udfae VPN for Gaming</div>
              <div class="slc-desc">Reduce ping and stop DDoS across all regions.</div>
              <div class="slc-url">\u2192 /features/gaming</div>
            </div>
            <div class="seo-link-card" onclick="Router.go('download')">
              <div class="slc-label">Download</div><div class="slc-title">\ud83d\udce5 Download VPN apps</div>
              <div class="slc-desc">Apps for Windows, Mac, Android, iOS, and more.</div>
              <div class="slc-url">\u2192 /download</div>
            </div>
            <div class="seo-link-card" onclick="Router.go('vpn-locations')">
              <div class="slc-label">Locations</div><div class="slc-title">\ud83c\udf0d All VPN locations</div>
              <div class="slc-desc">Browse all 60+ countries in our server network.</div>
              <div class="slc-url">\u2192 /vpn-locations</div>
            </div>
            <div class="seo-link-card" onclick="Router.go('features/core')">
              <div class="slc-label">Feature</div><div class="slc-title">\ud83d\udee1 Kill switch & more</div>
              <div class="slc-desc">All core VPN features included in every plan.</div>
              <div class="slc-url">\u2192 /features/core</div>
            </div>
            <div class="seo-link-card">
              <div class="slc-label">Pricing</div><div class="slc-title">\ud83d\udcb0 VPN pricing plans</div>
              <div class="slc-desc">Monthly, annual, 2-year \u2014 30-day money-back.</div>
              <div class="slc-url">\u2192 /pricing</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="sec">
        <div class="wrap" style="max-width:760px">
          <div class="sc"><div class="sec-lbl">FAQ</div><h2 class="sec-h2">Questions about VPN for ${d.fullName}</h2></div>
          <div class="faq-list">${faqHTML}</div>
        </div>
      </section>

      <!-- RELATED COUNTRIES -->
      <section class="sec sec-alt">
        <div class="wrap">
          <div class="sc"><div class="sec-lbl">Other locations</div><h2 class="sec-h2">Also explore</h2></div>
          <div class="rel-grid">${relHTML}</div>
        </div>
      </section>

      ${H.ctaBanner('Get VPN for ' + d.fullName, '30-day money-back guarantee \u00b7 5 devices \u00b7 All platforms', d.btns)}
    `);
  },

}; /* end App */

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => Router.init());