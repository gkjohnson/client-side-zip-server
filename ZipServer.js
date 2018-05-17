class ZipServer {

    constructor() {

        this._names = [];
        this._serviceworker = null;

        // before unload, clear all files

    }

    async register() {

        // is this already registered? Then
        // don't do anything and just use the
        // existing one

    }

    async unregister() {

        // what happens to other pages?
        // do we detect an unregister on our service
        // so we can inform when it goes down?

    }

    add(name, buffer) {

        // add the buffer

    }

    remove(name) {

        // remove the buffer

    }

    clearAll() {

        this._names.forEach(n => this.remove(n));

    }

}