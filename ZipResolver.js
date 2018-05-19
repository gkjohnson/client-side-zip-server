// Holds a list of zip files to test when resolving
// a request to retrieve a file path

class ZipResolver {

    get count() { return Object.keys(this._map).length; }
    get empty() { return this.count === 0; }

    constructor() {

        this._map = {};

    }

    /* Public API */
    // Adds a zip buffer with the provided id
    add(id, buffer) {

        if (!id) return;

        if (!buffer) {

            this.remove(id);
        
        } else {
        
            this._map[id] = null;
            new JSZip()
                .loadAsync(buffer)
                .then(zip => this._map[id] = zip);

        }
    
    }

    // Removes a zip with the provided id
    remove(id) {

        if (!id) return;

        delete this._map[id];
    
    }

    // Retrieves a file at the given path. If `strict` is enabled, then
    // the file path must match exactly in the zip file. Otherwise, the path
    // is progressively shortened until a file is found. Retursn a promise
    // that resolves with the file data, null if no file is found.
    retrieveFile(path, strict = false) {

        if (!path) return null;

        // normalize the path
        // we assume the path does not have any up-directory requests
        path = path.replace(/\\/g, '/');

        // iterate over every zip
        const pathReg = new RegExp(`${path}$`);
        for (const id in this._map) {

            // see if we can find the id of the file
            // at the provided path
            const zip = this._map[id];
            const res = zip.file(pathReg).pop();

            if (res) return res.async("arraybuffer");

        }

        if (!strict) {
            
            const split = path.split(/\//g);
            if (split.length === 1) return null;

            split.shift();
            return this.retrieveFile(split.join('/'));
        
        } else {

            return null;

        }
    }


}