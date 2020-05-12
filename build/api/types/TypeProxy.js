'use strict';
Object.defineProperty(exports, '__esModule', { value : true });
exports.TypeProxy = void 0;
const hop_1 = require('../../utils/hop');
const errors_1 = require('../../descriptors/errors');
const { WRONG_TYPE_DEFINITION, } = errors_1.ErrorsTypes;
const utils_1 = require('./utils');
const { checkProto, getTypeChecker, findParentSubType, } = utils_1.default;
const Mnemosyne_1 = require('./Mnemosyne');
const { Gaia, Mnemosyne, MnemosynePrototypeKeys } = Mnemosyne_1.default;
const InstanceCreator_1 = require('./InstanceCreator');
exports.TypeProxy = function (__type__, Uranus) {
    Object.assign(this, {
        __type__,
        Uranus
    });
    const typeProxy = new Proxy(InstanceCreator_1.InstanceCreator, this);
    return typeProxy;
};
exports.TypeProxy.prototype.get = function (target, prop) {
    const { __type__: type } = this;
    // prototype of proxy
    // const instance = Reflect.getPrototypeOf(receiver);
    if (prop === 'prototype') {
        return type.proto;
    }
    const propDeclaration = type[prop];
    if (propDeclaration) {
        return propDeclaration;
    }
    // used for existent props with value
    // undefined || null || false 
    if (hop_1.hop(type, prop)) {
        return propDeclaration;
    }
    // SomeType.SomeSubType
    if (type.subtypes.has(prop)) {
        return type.subtypes.get(prop);
    }
    return Reflect.get(target, prop);
};
exports.TypeProxy.prototype.set = function (__, name, value) {
    const { __type__: type } = this;
    // is about setting a prototype to Type
    if (name === 'prototype') {
        checkProto(value);
        type.proto = value;
        return true;
    }
    if (typeof name !== 'string' || !name.length) {
        throw new WRONG_TYPE_DEFINITION('should use non empty string as TypeName');
    }
    if (typeof value !== 'function') {
        throw new WRONG_TYPE_DEFINITION('should use function for type definition');
    }
    const TypeName = name;
    const Constructor = value;
    type.define(TypeName, Constructor);
    return true;
};
exports.TypeProxy.prototype.apply = function (__, Uranus, args) {
    const type = this.__type__;
    let instance = null;
    if (Uranus) {
        const InstanceCreatorProxy = new exports.TypeProxy(type, Uranus);
        instance = new InstanceCreatorProxy(...args);
    }
    else {
        instance = this.construct(null, args);
    }
    return instance;
};
const makeSubTypeProxy = function (subtype, inheritedInstance) {
    const subtypeProxy = new Proxy(InstanceCreator_1.InstanceCreator, {
        get (Target, _prop) {
            if (_prop === Symbol.hasInstance) {
                return getTypeChecker(subtype.TypeName);
            }
            return Reflect.get(Target, _prop);
        },
        construct (Target, _args) {
            return new Target(subtype, inheritedInstance, _args);
        },
        apply (Target, thisArg, _args) {
            // if we would make new keyword obligatory
            // then we should avoid it here, with throw Error
            const existentInstance = thisArg || inheritedInstance;
            return new Target(subtype, existentInstance, _args);
        },
    });
    return subtypeProxy;
};
const MnemonicaInstanceProps = [
    '__proto_proto__',
    '__type__',
    '__self__',
    '__args__',
    '__parent__',
    '__subtypes__',
    '__stack__',
    '__collection__',
    '__namespace__',
    '__timestamp__',
    '__creator__'
].concat(MnemosynePrototypeKeys);
const staticProps = [
    // builtins: functions + Promises
    'constructor',
    'prototype',
    'then',
    // builtins: errors
    'stack',
    'message',
    'domain',
    // builtins: EventEmitter
    'on',
    'once',
    'off',
    // mocha + chai => bug: ./utils.js .findParentSubType 'inspect'
    'inspect',
    'showDiff',
]
    .concat(MnemonicaInstanceProps)
    .concat(Object.getOwnPropertyNames(Object.prototype))
    .concat(Object.getOwnPropertyNames(Function.prototype))
    .reduce((obj, key) => {
    obj[key] = true;
    return obj;
}, Object.create(null));
const gaiaProxyHandlerGet = (target, prop, receiver) => {
    const result = Reflect.get(target, prop, receiver);
    if (result !== undefined) {
        return result;
    }
    if (typeof prop === 'symbol') {
        return result;
    }
    if (staticProps[prop]) {
        return result;
    }
    // prototype of proxy
    const instance = Reflect.getPrototypeOf(receiver);
    const { __type__: { config: { strictChain }, subtypes }, } = instance;
    let subtype = subtypes.has(prop) ?
        subtypes.get(prop) :
        strictChain ?
            undefined :
            findParentSubType(instance, prop);
    return subtype ? makeSubTypeProxy(subtype, receiver) : result;
};
exports.TypeProxy.prototype.construct = function (__, args) {
    // new.target id equal with target here
    const { __type__: type, Uranus } = this;
    // constructs new Gaia -> new Mnemosyne
    // 2 build the first instance in chain
    const gaia = new Mnemosyne(type.namespace, new Gaia(Uranus));
    const gaiaProxy = new Proxy(gaia, {
        get : gaiaProxyHandlerGet
    });
    const instance = new InstanceCreator_1.InstanceCreator(type, gaiaProxy, args);
    return instance;
};