# client-side-zip-server

Uses a service worker to set up a client-side service for intercepting fetch requests and responding with the contents of a loaded zip file. Request passes through to the server if no file is found.

## Use

### ZipServer

ZipServer registers a ServiceWorker and encapsulates everything necessary to fetch data from a zip file.

```js
// Import the service and jszip for creating zipped content
import './ZipServer.js'
import './node_modules/jszip/dist/jszip.min.js'

// Create the service
const zs = new ZipServer();
zs
    .register()
    .then(() => {
    
        // generate the zip file
        const zip = new JSZip();
        zip.file('test.text', 'hello!');
        zip.file('/folder/file.txt', 'I\'m in a folder!');
        return zip.generateAsync({ type: 'arraybuffer' });
        
    })
    .then(b => {
        
        // Add the file, save the id so it can be removed after
        // the requests are made
        const id = zs.addZip(b).id;
        fetch('test.py').then(res => res.text()).then(o => console.log(o))
        fetch('/folder/file.txt').then(res => res.text()).then(o => console.log(o))
        zs.remove(id);
        
        // hello!
        // I'm in a folder!
        
    });
            
```

### As an Addition

If a service worker is already being employed, then the `ZipResolver` class can be used independently. See [zipServerWorker.js](./zipServerWorker.js) for an example of how to extend an existing ServiceWorker.

## API

### ZipServer

#### ready

Getter indicating whether the service is ready to be used and intercept requests.

#### enabled

Getter / Setter for toggling serving zip files. If set to `false`, files from the zip folders will _not_ be resolved (though the files will not be removed). Set the `true` to reenable serving.

NOTE: This setting is optimistic and assumes nothing else has changed the enabled state in the ServiceWorker. If another client causes the ServiceWorker to be restarted then this setting could be out of sync.

#### register()

Registers a service worker for the zip service. If an equivelant service worker is already registered, then it uses the existing worker. If a different worker is registered, then the other worker is unregistered.

#### unregister()

Unregisters the worker if it has been registered. Keep in mind that service workers are shared across open webpages, so this could cause other pages to stop working. This should only be used when the the service should be uninstalled for good.

#### addZip(ArrayBuffer, transfer = true)

Registers the the zip file data with the request interceptor service so the data can be served. This makes the data accessible across all clients controlled by the zip service worker.

If `transfer` is true and the data is an ArrayBuffer, then it's ownership is transferred to the service worker, making it unavailable in the main thread.

Returns an object of the form `{ id, dispose }`. Call `dispose` to remove the zip file from the service.

#### addDataTransfer(dataTransfer)

Creates a zip from a [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object. This can be used to create and serve files that were dragged onto the page and captured using the `'drop'` event.

#### remove(id)

Removes the zip file from the service, meaning no fetch requests will return its data.
