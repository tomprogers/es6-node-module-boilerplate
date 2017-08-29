# eztxt4fs

Ambidextrous sugar for reading and writing text files via the `fs` module found in nodejs, Electron, and react-native. Especially useful for loading and saving data like user preferences and other not-enormous data in OS-conventional locations.

## Installation

1. `npm install --save eztxt4fs`


## Examples

### Attempts to read a file located at `/Users/barney/myFile.json`:

```javascript
var Textfile = require('eztxt4fs');

Textfile.read('/Users/barney/myFile.json')
.then(function(data) {
    // data == JSON.parse(file contents) || undefined
});
```

### Attempts to store an object as a file located at `/Users/barney/someObject.json`:

```javascript
var Textfile = require('eztxt4fs');

var data = {
    letters: ['a','b','c'],
    number: 5
};

Textfile.write('/Users/barney/someObject.json', data)
.then(function() {
    // it's done
});
```


## Documentation


### <a id='newtextfilepathoptions'>`new Textfile( path `_`[, options]`_` )`</a>

Returns a new `Textfile`. Does not perform any filesystem operations.

Once a `Textfile` has been configured, it can be read from and written to as described below, but without having to supply `path` or `options` again.

The options set at creation can be overridden in any subsequent call, but such overrides apply to a single operation only.


### <a id='textfilereadpathoptions'>`Textfile.read( path `_`[, options]`_` )`</a>

Attempts to read the contents of a file:

- if the file doesn't exist, returns `undefined`
- attempts to parse as JSON (unless `options.json = false`)
- will throw if Textfile configured for JSON but file contents not well-formed

_When calling `.read()` on an instance, do not supply `path`._


### <a id='textfilewritepathvalueoptions'>`Textfile.write( path `_`[, value [, options]]`_` )`</a>

Attempts to write `value` to disk at the specified path.

- will create directories if necessary
- can throw permissions-related errors while creating files and directories
- will throw if Textfile configured for JSON but value cannot be serialized

_When calling `.write()` on an instance, do not supply `path`._

**Warning: `Textfile.write()` with no arguments will erase the contents of your file, regardless of configuration.**

- `Textfile.write(path, undefined, { json: true })` will write the word `undefined` to the file, which this library will re-interpret as `undefined` upon read, but which other libraries are likely to reject, as `JSON.parse("undefined")` throws in a vanilla JS environment.

**TODO: change so that writing `undefined` as JSON will delete the file**

**TODO: allow disabling deletion behavior with an option**


### <a id='options'>`options`</a>

All Textfile calls accept an `options` argument. The following properties and values modify Textfile's behavior:

| Name | Type | Default | Description |
| ---: | :--- | :---: | :--- |
|    `async` | Boolean           | `true`       | whether filesystem operations should be asynchronous; see [Async](#async) |
| `encoding` | String            | `'utf8'`     | file encoding |
|     `json` | Boolean           | `true`       | whether file contents should be JSON-encoded |
| `replacer` | Function or Array | `null`       | if `options.json`, passed to `JSON.stringify(value, replacer, space)` when writing |
|    `space` | Number or String  | `null`       | if `options.json`, passed to `JSON.stringify(value, replacer, space)` when writing |
|  `reviver` | Function          | `null`       | if `options.json`, passed to `JSON.parse(string, reviver)` when reading |


Default options:

```javascript
{
    async: true,
    encoding: 'utf8',
    json: true,
    replacer: null,
    space: null,
    reviver: null
}
```

Any additional properties will be passed down to the core nodejs methods, which are:

*  `fs.readFile` & `fs.readFileSync`
*  `fs.writeFile` & `fs.writeFileSync`
*  `fs.mkdir` & `fs.mkdirSync`
*  `fs.access` & `fs.accessSync`


### Async

Textfile's read and write methods are ambidextrous, meaning that they can be invoked in a blocking or non-blocking style as circumstances require.

By default, `Textfile.read()` & `Textfile.write()` operate asynchronously, and therefore return promises. However, if `options.async = false`, these methods will block until they can provide their return values. This is useful when e.g. writing data to disk when an Electron app is closing, under which circumstances async file operations are not guaranteed to complete before exit.

_Note: Textfile creation is always synchronous._

`async` can be set at creation time, and temporarily overridden at any call site.

```javascript
var Textfile = require('eztxt4fs');

// default configuration is async
var userPrefs = new Textfile(`~/Library/Preferences/MyApp/user1.myapp-settings`);

// read and write prefs asynchronously
var prefUpdatePromise = userPrefs.read()
.then(function(prefData) {
    var newPrefs = Object.assign({}, prefData, { updated: true });
    return userPrefs.write(newPrefs);
});

// read and write prefs synchronously
var prefData = userPrefs.read({ async: false });
var newPrefs = Object.assign({}, prefData, { updated: true });
userPrefs.write(newPrefs, { async: false });
```


### Static & instance-based invocation supported


#### Static invocation

You can read and write files without creating objects.

E.g.: write some data to disk and be done:

```javascript
var Textfile = require('eztxt4fs');

function readPersonFile(filing_name) {
    var filename = filingName + '.person';
    return Textfile.read(filename);
}

function writePersonFile(person) {
    var filename = filingName + '.person';
    return Textfile.write(filename, person);
}

```


#### Instance-based invocation

If you create an instance using `new`, its initial options will persist for its lifetime, allowing you to operate on the same file more succinctly.

```javascript
var Textfile = require('eztxt4fs');

var prefs = new Textfile('myapp.prefs');

function getPrefs() {
    return prefs.read();
}

function setPrefs(newPrefs) {
    return prefs.write(newPrefs);
}
```


## Supported Platforms

- node
- Electron
- react-native


### Caveats

- Has not been tested on Windows.
- Has not been tested in react-native (neither iOS nor Android).
- Has not been tested against an NTFS filesystem.

I think `eztxt4fs` will work as advertised in all of these cases, but haven't tested them yet. If you find out, please post an issue with your results.


## License

Copyright © 2017 Tom Rogers <tom@roguevendor.com>

This work is mine. You can't do anything with it yet. Once I declare it finished, I may grant you some rights.
