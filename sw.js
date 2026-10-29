// Service Worker der Uni App (erzeugt beim Bauen, Version mvtyaoyu)
const CACHE = 'uni-app-mvtyaoyu';
const KERN = ["./","./index.html","./manifest.webmanifest","./assets/index-B8FG2Yzt.css","./assets/index-Cy47gObT.js"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(KERN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  const url = new URL(r.url);
  if (r.method !== 'GET' || url.origin !== location.origin) return; // Google-Anfragen nie anfassen
  if (r.mode === 'navigate') {
    // Seite: erst Netz (neue Version), sonst Zwischenspeicher
    e.respondWith(fetch(r).then((res) => { const k = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', k)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  // Dateien mit Prüfsumme im Namen ändern sich nie: Zwischenspeicher zuerst
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {
    if (res.ok) { const k = res.clone(); caches.open(CACHE).then((c) => c.put(r, k)); }
    return res;
  })));
});
