/* Le notifiche sul telefono · 24/10/2026 (SQL 117, funzione «notifiche»). Solo notifiche: niente cache, le pagine arrivano sempre fresche. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function(e){
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch(x){ d = { titolo: 'FelicitasMundi', testo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titolo || 'FelicitasMundi', {
    body: d.testo || '', icon: 'icona-felicitas-192.png?v=1024', badge: 'favicon-felicitas-48.png?v=1024',
    data: { indirizzo: d.indirizzo || 'strumento.html' }
  }));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = new URL(e.notification.data && e.notification.data.indirizzo || 'strumento.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(ws){
    for (var i = 0; i < ws.length; i++) { if (ws[i].url.indexOf(self.registration.scope) === 0 && 'focus' in ws[i]) { ws[i].navigate(url); return ws[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
