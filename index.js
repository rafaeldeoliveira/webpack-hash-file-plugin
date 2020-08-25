const { RawSource } = require('webpack-sources');
const validateOptions = require('schema-utils');

const schema = {
    type: 'object',
    properties: {
        paramName: {
            type: 'string'
        },
        hashFileExtension: {
            type: 'string'
        },
        extractHashFromAssetName: {
            instanceof: "Function"
        }
    }
};

const defaultOptions = {
    paramName: 'v',
    hashFileExtension: 'hash',
    extractHashFromAssetName(name, options) {
        const params = extractQueryParams(name);
        return params[options.paramName] || null;
    }
};

function extractQueryParams(uri) {
    const paramsIdx = uri.indexOf('?');
    if (paramsIdx === -1) {
        return {};
    }
    const params = {};
    uri.substr(paramsIdx + 1).split('&').forEach(p => {
        const [key, value] = p.split('=');
        params[key] = value || '';
    });
    return params;
}




class WebpackHashFilePlugin {

    constructor(options = {}) {
        validateOptions(schema, options, {name: 'HashFilePlugin'});
        this.options = {...defaultOptions, ...options};
    }


    generateHashFileName(name) {
        const queryIdx = name.indexOf('?');
        let newName = name;
        if (queryIdx >= 0) {
            newName = newName.substr(0, queryIdx);
        }
        return newName + '.' + this.options.hashFileExtension;
    }

    apply(compiler) {

        compiler.hooks.emit.tap('WebpackHashFilePlugin', (
            compilation, callback
        ) => {
            let hashes = {};
            for (let asset in compilation.assets) {
                if (compilation.assets.hasOwnProperty(asset)) {
                    const hash = this.options.extractHashFromAssetName(asset, this.options);
                    if (hash !== null) {
                        if (!(typeof hash === 'string')) {
                            compilation.errors.push(new Error('Hash must be a string.'))
                            continue;
                        }
                        const hashFileName = this.generateHashFileName(asset);
                        hashes[hashFileName] = new RawSource(hash);
                    }
                }
            }

            for (let asset in hashes) {
                compilation.assets[asset] = hashes[asset];
            }

            if (typeof callback === 'function') {
                callback();
            }
        });
    }
}

module.exports = WebpackHashFilePlugin;