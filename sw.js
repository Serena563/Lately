const C='lately-2026-11-03m';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='lately-config').map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{e.waitUntil((async()=>{
  let msg={title:'Lately',body:'Even inchecken? Kort, beloofd.',url:'./'};
  try{const c=await caches.open('lately-config'); const r=await c.match('cfg'); if(r){const cfg=await r.json(); const m=await fetch(cfg.url+'/latest?k='+encodeURIComponent(cfg.key)); if(m.ok) msg=await m.json();}}catch(err){}
  await self.registration.showNotification(msg.title,{body:msg.body,icon:'icon-192.png',badge:'icon-192.png',data:{url:msg.url||'./'}});
})());});
self.addEventListener('notificationclick',e=>{e.notification.close(); const url=new URL(e.notification.data&&e.notification.data.url||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){ if('navigate' in c){ return c.navigate(url).then(x=>x&&x.focus()); } } return self.clients.openWindow(url);}));});
