self.addEventListener("install",e=>{
    
    e.waitUntil(
        caches.open("static").then(caches=>{
            return caches.addAll([
"logo 64.png","logo 512.png","index.html",]);
        })
    )

});

self.addEventListener("fetch" ,e=>{
    e.respondWith(
        caches.match(e.request).then(Response=>{
            return Response || fetch(e.request)
        })
    )
});

