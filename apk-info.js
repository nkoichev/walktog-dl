// Fills in the APK's version, date and size from the GitHub release, so the
// pages never go stale. The version comes from the release title
// ("WalkTog APK 1.3.0"); the date and size from the walktog.apk asset.
// Elements: [data-apk="version"], [data-apk="date"], [data-apk="size"].
// Their static text stays as the fallback if GitHub can't be reached.
(function () {
  var API = 'https://api.github.com/repos/nkoichev/walktog-dl/releases/tags/latest-apk';
  function set(key, value) {
    if (!value) return;
    document.querySelectorAll('[data-apk="' + key + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }
  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (rel) {
      var m = /(\d+\.\d+\.\d+)/.exec(rel.name || '');
      if (m) set('version', m[1]);
      var apk = (rel.assets || []).filter(function (a) { return a.name === 'walktog.apk'; })[0];
      if (!apk) return;
      var d = new Date(apk.updated_at);
      set('date', d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' }));
      set('size', '~' + Math.round(apk.size / 1048576) + ' MB');
    })
    .catch(function () {});
})();
