/* ============================================================
   [BrandName] VPN — Hash Router
   Routes: #/download, #/download/:platform
            #/features, #/features/:usecase
   ============================================================ */

const Router = (() => {

  /* ── Route table ───────────────────────────────────────── */
  const ROUTES = {
    /* Default */
    ''                      : () => App.showDownloadMain(),

    /* Download */
    'download'              : () => App.showDownloadMain(),
    'download/windows'      : () => App.showDownloadSub('windows'),
    'download/mac'          : () => App.showDownloadSub('mac'),
    'download/android'      : () => App.showDownloadSub('android'),
    'download/ios'          : () => App.showDownloadSub('ios'),
    'download/linux'        : () => App.showDownloadSub('linux'),
    'download/chrome'       : () => App.showDownloadSub('chrome'),
    'download/firefox'      : () => App.showDownloadSub('firefox'),
    'download/smarttv'      : () => App.showDownloadSub('smarttv'),

    /* Features */
    'features'              : () => App.showFeaturesMain(),
    'features/streaming'    : () => App.showFeaturesSub('streaming'),
    'features/torrent'      : () => App.showFeaturesSub('torrent'),
    'features/gaming'       : () => App.showFeaturesSub('gaming'),
    'features/browsing'     : () => App.showFeaturesSub('browsing'),
    'features/core'         : () => App.showFeaturesSub('features'),

    /* VPN Locations hub */
    'vpn-locations'         : () => App.showLocationsMain(),

    /* VPN Location sub-pages \u2014 add new countries here */
    'vpn-locations/usa'         : () => App.showLocationSub('usa'),
    'vpn-locations/uk'          : () => App.showLocationSub('uk'),
    'vpn-locations/canada'      : () => App.showLocationSub('canada'),
    'vpn-locations/germany'     : () => App.showLocationSub('germany'),
    'vpn-locations/australia'   : () => App.showLocationSub('australia'),
    'vpn-locations/japan'       : () => App.showLocationSub('japan'),
    'vpn-locations/singapore'   : () => App.showLocationSub('singapore'),
    /* \u2500\u2500 Scale: paste new entries below \u2500\u2500
    'vpn-locations/france'      : () => App.showLocationSub('france'),
    'vpn-locations/netherlands' : () => App.showLocationSub('netherlands'),
    'vpn-locations/india'       : () => App.showLocationSub('india'),
    'vpn-locations/uae'         : () => App.showLocationSub('uae'),
    */
  };

  /* ── Resolve current hash ──────────────────────────────── */
  function resolve() {
    const raw  = window.location.hash.replace(/^#\/?/, '').trim();
    const path = raw.toLowerCase();
    const handler = ROUTES[path];
    if (handler) {
      handler();
    } else {
      /* fallback: try parent route (e.g. unknown sub → main) */
      const parent = path.split('/')[0];
      (ROUTES[parent] || ROUTES[''])();
    }
    updateNavActive(path);
    window.scrollTo(0, 0);
  }

  /* ── Highlight active nav item ─────────────────────────── */
  function updateNavActive(path) {
    document.querySelectorAll('.nav-menu a[data-route]').forEach(a => {
      a.classList.remove('on');
      const r = a.dataset.route;
      if (path === r || path.startsWith(r + '/')) a.classList.add('on');
    });
  }

  /* ── Navigate programmatically ─────────────────────────── */
  function go(path) {
    window.location.hash = '/' + path;
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    window.addEventListener('hashchange', resolve);
    resolve(); /* handle page load / refresh */
  }

  return { init, go, resolve };
})();