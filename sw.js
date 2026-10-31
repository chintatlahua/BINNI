// Service worker: guarda la app y los KML para abrirla sin conexión.
var CACHE = "binni-v5";
var CORE = ["./", "index.html", "manifest.webmanifest", "rutas/index.json", "icons/icon-192.png", "icons/apple-touch-icon.png", "lib/leaflet.js", "lib/leaflet.css", "rutas/RA-01.kml", "rutas/RA-02.kml", "rutas/RA-03.kml", "rutas/RA-04.kml", "rutas/RA-05.kml", "rutas/RA-06.kml", "rutas/RA-07.kml", "rutas/RA-08.kml", "rutas/RA-09.kml", "rutas/RA-10.kml", "rutas/RA-11.kml", "rutas/RA-12.kml", "rutas/RA-14.kml", "rutas/RA-15.kml", "rutas/RA-16.kml", "rutas/RA-17.kml", "rutas/RA-18.kml", "rutas/RA-19.kml", "rutas/RC-01.kml", "rutas/RC-02.kml", "rutas/RC-03.kml", "rutas/RC-04.kml", "rutas/RC-05.kml", "rutas/RC-06.kml", "rutas/RC-07.kml", "rutas/RC-08.kml", "rutas/RC-09.kml", "rutas/RC-10.kml", "rutas/RC-11.kml", "rutas/RC-12.kml", "rutas/RC-13.kml", "rutas/RC-14.kml", "rutas/RC-15.kml", "rutas/RT-01.kml", "rutas/RT-02.kml"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch", function(e){
  var req=e.request; if(req.method!=="GET") return;
  var u=new URL(req.url);
  // Mapa base (teselas): siempre de la red, no se guardan.
  if(/tile\.openstreetmap\.org|routing\.openstreetmap\.de/.test(u.host)) return;
  var same = u.origin===location.origin, lib = /cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(!same && !lib) return;
  // Primero la red (para recibir actualizaciones); si no hay conexión, lo guardado.
  e.respondWith(fetch(req).then(function(r){
    if(r && r.status===200){var cp=r.clone(); caches.open(CACHE).then(function(c){c.put(req,cp)})}
    return r;
  }).catch(function(){return caches.match(req).then(function(r){return r||caches.match("index.html")})}));
});
