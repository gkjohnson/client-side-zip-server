class ZipServer {

    static _generateId() {

        return Math.random().toString(36).substr(2, 9);

    }

    static _getWorkerUrl() {

        if (!this._workerUrl) {
            const el = document.create('a');
            el.href = './zipServerWorker.js';
            this._workerUrl = el.href;
        }

        return this._workerUrl;

    }

    get ready() { return !!this._serviceWorker; }
    get serviceWorker() { return this._serviceWorker; }

    constructor() {

        this._ids = [];
        this._serviceWorker = null;
        this._id = this._generateId();

        // before unload, clear all files
        window.addEventListener('beforeunload', () => this.clear());
    }

    /* Public API */
    async register() {

        return new Promise((resolve, reject) => {
            const reg = await navigator.serviceWorker.register(this._getWorkerUrl);
            if (!reg.active) {
                (reg.installing || reg.waiting)
                    .addEventListener('statechange', () => resolve(reg.active));
            } else {
                requestAnimationFrame(() => resolve(reg.active));
            }
        });

    }

    async unregister() {

        if (!this.serviceWorker) {

            throw new Error('ZipServer has no service worker to unregister');
        
        }

        this._serviceWorker.unregister();
        this._serviceWorker = null;

    }

    add(buffer, transfer = true) {

        if (!this.ready) {

            throw new Error('ZipServer service worker not intialized, yet.');

        }

        // add the buffer
        const id = this._generateFileId();
        const transferable = [];

        if (buffer instanceof ArrayBuffer && transfer) transferable.push(buffer);
        this._serviceWorker.postMessage({ id, buffer }, transferable);

        this._ids.push(id);

        return {

            id,
            dispose: () => this.remove(id)
        
        }

    }

    remove(id) {

        if (!this.ready) {

            throw new Error('ZipServer service worker not intialized, yet.');

        }

        // remove the buffer
        this._serviceWorker.postMessage({ id, buffer: null });

    }

    clearAll() {

        this._ids.forEach(n => this.remove(n));

    }

    /* Private Functions */
    _generateFileId() {

        let id;
        while (id && this._ids.indexOf(id) !== -1) {

            id = `${ this._id }_${ this._generateId() }`;

        }

        return id;

    }

}