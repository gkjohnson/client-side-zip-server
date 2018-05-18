this.importScripts('./node_modules/jszip/dist/jszip.min.js');
this.importScripts('./ZipResolver.js');

this.clients.claim()
let resolver = new ZipResolver();
this.addEventListener('install', e => {

    this.skipWaiting();

});

this.addEventListener('activate', e => {

    e.waitUntil(this.clients.claim());

});


this.addEventListener('fetch', e => {
 
    const pr = resolver.retrieveFile(e.request.url);
    if (pr) {

        e.respondWith(
            pr.then(buffer => {

                const blob = new Blob([ buffer ]);
                return new Response(blob, { status: 200 });

            })
        );
        
    } else { 

        return e.request;

    }

});

this.addEventListener('message', e => {

    resolver.add(e.data.name, e.data.buffer);

});