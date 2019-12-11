'use strict';

// 1. init default namespace
// 2. create default namespace in types

const odp = Object.defineProperty;

import {
	MNEMONICA,
	SymbolDefaultNamespace
} from '../../constants';

// namespace storage
// name + namespace config
// future feature : path of namespace
// shortcut for ns of module exports
// inter-mediator
const namespaces = new Map();

const Namespace = function (this: object, name: string | symbol, descrtiption: string, opts: object): object {

	const typesCollections = new WeakSet();

	// TODO : Check all arguments !

	Object.assign(this, {
		descrtiption,
		path : null
	}, opts);

	odp(this, 'name', {
		get () {
			return name;
		},
		enumerable : true
	});

	odp(this, 'typesCollections', {
		get () {
			return typesCollections;
		},
		enumerable : true
	});

	const hooks = Object.create(null);
	odp(this, 'hooks', {
		get () {
			return hooks;
		}
	});

	namespaces.set(name, this);
	
	return this;

};

Namespace.prototype = require('../../api/hooks');

const DEFAULT_NAMESPACE = new (Namespace as any)(SymbolDefaultNamespace, `default ${MNEMONICA} namespace`, {});

const fascade = Object.create(null);

odp(fascade, 'createNamespace', {
	get () {
		return (name: string, descrtiption: string, opts: object) => {
			const namespace: any = new (Namespace as any)(name, descrtiption, opts);
			return namespace;
		};
	},
	enumerable : true
});

odp(fascade, 'namespaces', {
	get () {
		return namespaces;
	},
	enumerable : true
});

odp(fascade, 'defaultNamespace', {
	get () {
		return DEFAULT_NAMESPACE;
	},
	enumerable : true
});

odp(fascade, SymbolDefaultNamespace, {
	get () {
		return DEFAULT_NAMESPACE;
	}
});

module.exports = fascade;
