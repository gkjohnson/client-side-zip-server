class ZipResolver {

    constructor() {
        this._map = {};
    }

    /* Public API */
    add(id, buffer) {

        if (!id) return;

        if (!buffer) {
            this.remove(id);
        } else {
        
            new JSZip()
                .loadAsync(buffer)
                .then(zip => this._map[id] = zip);

        }
    
    }

    remove(id) {

        if (!id) return;

        delete this._map[id];
    
    }

    retrieveFile(path, strict = false) {

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