'use strict';
const wrapThis = (method) => {
    return function (instance, ...args) {
        return method(instance, ...args);
    };
};
const constants = require('./constants'), descriptors = require('./descriptors'), { defaultTypes } = descriptors;
const utils = Object.assign({}, Object.entries(Object.assign({}, require('./utils'))).reduce((methods, [name, fn]) => {
    methods[name] = wrapThis(fn);
    return methods;
}, {}));
const define = function (...args) {
    const types = this || defaultTypes;
    return types.define(...args);
};
const lookup = function (...args) {
    const types = this || defaultTypes;
    return types.lookup(...args);
};
const fascade = {};
Object.entries(Object.assign(Object.assign(Object.assign({ errors: Object.assign({}, require('./errors')) }, constants), descriptors), { utils,
    define,
    lookup })).forEach((entry) => {
    const [name, code] = entry;
    Object.defineProperty(fascade, name, {
        get() {
            return code;
        },
        enumerable: true
    });
});
// console.log(Object.keys(fascade));
module.exports = fascade;
