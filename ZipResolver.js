class ZipResolver {

    constructor() {
        this._map = {};
    }

    /* Public API */
    add(name, buffer) {

        if (!name) return;

        if (!buffer) this.remove(name);
        else this._map[name] = new JSZip(buffer);
    
    }

    remove(name) {

        if (!name) return;

        delete this._map[name];
    
    }

    retrieveFile(path, strict = false) {

        // normalize the path
        // we assume the path does not have any up-directory requests
        path = path.replace(/\\/g, '/');

        // iterate over every zip
        const pathReg = new RegExp(`${path}$`);
        for (const name in this._map) {

            // see if we can find the name of the file
            // at the provided path
            const zip = this._map[name];
            const res = zip.file(pathReg);
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