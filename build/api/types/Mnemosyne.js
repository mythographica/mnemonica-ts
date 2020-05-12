'use strict';
Object.defineProperty(exports, '__esModule', { value : true });
const odp = Object.defineProperty;
const constants_1 = require('../../constants');
const { SymbolConstructorName, SymbolGaia, SymbolReplaceGaia, MNEMONICA, GAIA, URANUS } = constants_1.constants;
const utils_1 = require('./utils');
const { getTypeChecker, } = utils_1.default;
const extract_1 = require('../../utils/extract');
const parent_1 = require('../../utils/parent');
const pick_1 = require('../../utils/pick');
const exceptionConstructor_1 = require('./exceptionConstructor');
const InstanceCreator_1 = require('./InstanceCreator');
const Gaia = function (Uranus) {
    const gaiaProto = Uranus ? Uranus : this;
    const GaiaConstructor = function () { };
    GaiaConstructor.prototype = Object.create(gaiaProto);
    const gaia = new GaiaConstructor;
    odp(gaia, MNEMONICA, {
        get () {
            return !Uranus ? GAIA : URANUS;
        }
    });
    return gaia;
};
const MnemonicaProtoProps = {
    extract () {
        return function () {
            return extract_1.extract(this);
        };
    },
    pick () {
        return function (...args) {
            return pick_1.pick(this, ...args);
        };
    },
    parent () {
        return function (constructorLookupPath) {
            return parent_1.parent(this, constructorLookupPath);
        };
    },
    clone () {
        return this.fork();
    },
    fork () {
        const { __type__: type, __collection__: collection, __parent__: existentInstance, __args__, __self__ } = this;
        const { isSubType, TypeName } = type;
        // 'function', cause might be called with 'new'
        return function (...forkArgs) {
            var forked;
            const Constructor = isSubType ?
                existentInstance :
                collection;
            const args = forkArgs.length ? forkArgs : __args__;
            if (this === __self__) {
                forked = new (Constructor[TypeName])(...args);
            }
            else {
                // fork.call ? let's do it !
                forked = new InstanceCreator_1.InstanceCreator(type, this, args);
            }
            return forked;
        };
    },
    [SymbolReplaceGaia] () {
        return function (uranus) {
            Reflect.setPrototypeOf(Reflect.getPrototypeOf(this[SymbolGaia]), uranus);
        };
    },
    [SymbolConstructorName] () {
        return MNEMONICA;
    },
    exception () {
        const me = this;
        return function (error, ...args) {
            const target = new.target;
            return exceptionConstructor_1.default.call(me, target, error, ...args);
        };
    }
};
const Mnemosyne = function (namespace, gaia) {
    const Mnemonica = function () {
        odp(this, SymbolConstructorName, {
            get () {
                return namespace.name;
            }
        });
    };
    const mnemonica = Reflect.getPrototypeOf(gaia);
    Reflect.setPrototypeOf(Mnemonica.prototype, mnemonica);
    Mnemonica.prototype.constructor = Mnemonica;
    Object.entries(MnemonicaProtoProps).forEach(([name, method]) => {
        odp(Mnemonica.prototype, name, {
            get () {
                return method.call(this);
            }
        });
    });
    Object.getOwnPropertySymbols(MnemonicaProtoProps).forEach((symbol) => {
        odp(Mnemonica.prototype, symbol, {
            get () {
                return MnemonicaProtoProps[symbol].call(this);
            }
        });
    });
    // instance of self Constructor type
    odp(Mnemonica.prototype, Symbol.hasInstance, {
        get () {
            return getTypeChecker(this.constructor.name);
        }
    });
    odp(Mnemonica.prototype, SymbolGaia, {
        get () {
            return gaia;
        }
    });
    const proto = new Mnemonica();
    Reflect.setPrototypeOf(this, proto);
};
exports.default = {
    Gaia,
    Mnemosyne,
    get MnemosynePrototypeKeys () {
        return Object.keys(MnemonicaProtoProps);
    }
};