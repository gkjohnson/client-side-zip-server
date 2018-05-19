this.importScripts('./node_modules/jszip/dist/jszip.min.js');
this.importScripts('./ZipResolver.js');

const resolvers = {};
const disabled = {};
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
    const r = resolvers[e.clientId];
    const pr = r && !disabled[e.clientId] ? r.retrieveFile(e.request.url) : null;

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

    resolvers[e.source.id] = resolvers[e.source.id] || new ZipResolver();
    
    const r = resolvers[e.source.id];
    r.add(e.data.id, e.data.buffer);

    if (r.empty) delete resolvers[e.source.id];

    if ('disabled' in e.data) {
        if (e.data.disabled) disabled[e.source.id] = true;
        else delete disabled[e.source.id];
    }

});