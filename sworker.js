self.addEventListener("install",e=>{
    
    e.waitUntil(
        caches.open("static").then(caches=>{
            return caches.addAll([
"logo 64.png","logo 512.png","index.html","assets/css/swiper.min.css","assets/css/style-starter.css","assets/css/contact.css","assets/fonts/fontawesome-webfont.eot","assets/fonts/fontawesome-webfont.svg", "assets/fonts/fontawesome-webfont.ttf","/assets/fonts/fontawesome-webfont.woff","assets/fonts/fontawesome-webfont.woff2","assets/fonts/FontAwesome.otf",
"assets/images/1.png","assets/images/2.png","assets/images/3.png","assets/images/5.png","assets/images/ajmal.jpg","assets/images/angular.jpg","assets/images/coding.jpg","assets/images/devops.jpg","assets/images/django.jpg",
"assets/images/flutter.jpg","assets/images/git.jpg","assets/images/git1.jpg","assets/images/git2.jpg","assets/images/git3.jpg",
"assets/images/git4.jpg","assets/images/git5.jpg","assets/images/git6.jpg","assets/images/git7.jpg","assets/images/kotlin.jpg",
"assets/images/logo.png","assets/images/logo1.png","assets/images/macbook-1.png","assets/images/macbook-2.png","assets/images/node js.jpg","assets/images/python.jpg",
"assets/images/react js.jpg","assets/images/screen-1.png","assets/images/screen-2.png","assets/images/screen-3.png","assets/images/screen-4.png","assets/images/web.jpg","assets/js/all.js",
"assets/js/all.js.map","assets/js/aos.js","assets/js/aosindex.js","assets/js/app.js","assets/js/bootstrap.min.js","assets/js/card.js","assets/js/jquery-3.3.1.min.js","assets/js/popper.min.js","assets/js/script.js","assets/js/swiper.min.js",
]);
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

