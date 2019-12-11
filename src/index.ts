'use strict';

const wrapThis = (method: (instance: void, ...args: any[]) => any) => {
	return function (instance: void, ...args: any[]) {
		return method(instance, ...args);
	};
};

const
	constants = require('./constants'),
	descriptors = require('./descriptors'),
	{
		defaultTypes
	} = descriptors;


const utils = {

	...Object.entries({

		...require('./utils')

	}).reduce((methods: any, [name, fn]: [string, any]) => {
		methods[name] = wrapThis(fn);
		return methods;
	}, {}),

};

const define = function (this: any, ...args: any[]) {
	const types = this || defaultTypes;
	return types.define(...args);
};

const lookup = function (this: any, ...args: any[]) {
	const types = this || defaultTypes;
	return types.lookup(...args);
};

const fascade = {};

Object.entries({

	errors: { ...require('./errors') },

	...constants,

	...descriptors,

	utils,

	define,
	lookup

}).forEach((entry) => {
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
