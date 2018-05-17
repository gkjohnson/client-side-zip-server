this.importScripts('./node_modules/jszip/dist/jszip.min.js');
this.importScripts('./ZipResolver.js');

let resolver;
this.addEventListener('install', e => { });

this.addEventListener('activate', e => {

    resolver = new ZipResolver();
    e.waitUntil(this.clients.claim());

});

this.addEventListener('fetch', e => {
 
    console.log("ASDFFETCH")

    const pr = resolver.retrieveFile(e.request.url);
    if (pr) {

        e.respondWith(
            pr.then(buffer => {

                const blob = new Blob([ buffer ]);
                return Response(blob, { status: 200 });

            })
        );
    } else { 

        return e.request;

    }

});

this.addEventListener('message', e => {

    resolver.add(e.message.name, e.message.buffer);

});