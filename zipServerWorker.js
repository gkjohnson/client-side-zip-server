this.importScripts('./node_modules/jszip/dist/jszip.min.js');
this.importScripts('./ZipResolver.js');

let resolver = new ZipResolver();
this.addEventListener('install', e => {

    // activate immediately so we can start serving
    // files as soon as possible
    this.skipWaiting();

});

this.addEventListener('activate', e => {

    e.waitUntil(this.clients.claim());

});

this.addEventListener('fetch', e => {

    // Check if a file is available in one of the zip
    // files and return that instead
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

// Add a zip file when a request is made. Send 'null'
// to remove the zip file
this.addEventListener('message', e => {

    resolver.add(e.data.id, e.data.buffer);

});