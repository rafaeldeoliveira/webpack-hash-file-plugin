# About
This plugins emits a file named `[assetName].hash` containing assets hash.

Currently it looks for the query parameter `v` in the asset name.


# Usage

`yarn add -D webpack-file-hash-plugin`

```js
const WebpackFileHashPlugin = require('webpack-file-hash-plugin');

module.exports {
    output: {
        filename: '[name].js?v=[hash]',
        chunkFilename: '[id].js?v=[contenthash]',
    },
    plugins: [
        new WebpackFileHashPlugin()
    ]
}
```

Example output files:
- myEntry.js
- myEntry.js.hash 
- otherEntry.js
- otherEntry.js.hash 
- otherEntry.css
- otherEntry.css.hash 

# Options 

|Name|Description|Default|
|-----|----------|-----|
|`paramName`|Parameter containing tha hash|`v`|
|`hashFileExtension`|Extension of the generated hash file|`hash`|
|`extractHashFromAssetName(assetName, options)`|Function to extract the hash from asset name| -|



