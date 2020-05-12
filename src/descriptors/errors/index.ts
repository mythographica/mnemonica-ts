'use strict';

import { constants } from '../../constants';
const {
	ErrorMessages,
} = constants;

import errors from '../../api/errors';
const {
	BASE_MNEMONICA_ERROR,
	constructError,
} = errors;

export const ErrorsTypes: { [ index: string ]: any } = {};
ErrorsTypes[ 'BASE_MNEMONICA_ERROR' ] = BASE_MNEMONICA_ERROR;

Object.entries( ErrorMessages ).forEach( entry => {
	const [ ErrorConstructorName, message ] = entry;
	const ErrorConstructor: InstanceType<any> = constructError( ErrorConstructorName, message );
	ErrorsTypes[ ErrorConstructorName ] = ErrorConstructor;
} );
