'use strict';

// names
export const MNEMONICA = 'Mnemonica';

// O Great Mnemosyne! Please!
// Save us from Oblivion...
// https://en.wikipedia.org/wiki/Mnemosyne
export const MNEMOSYNE = 'Mnemosyne';

// Gaia - Wikipedia
// https://en.wikipedia.org/wiki/Gaia
export const GAIA = 'Gaia';
export const URANUS = 'Uranus';


// symbols
export const SymbolDefaultNamespace = Symbol(`default ${MNEMONICA} namespace`);
export const SymbolSubtypeCollection = Symbol('SubType Collection');
export const SymbolConstructorName = Symbol('Defined Constructor Name');
export const SymbolGaia = Symbol('Defined Gaia Constructor');


// etc...
export const TYPE_TITLE_PREFIX = 'modificator of : ';


// errors
export const ErrorMessages = {
	
	BASE_ERROR_MESSAGE             : 'UNPREDICTABLE BEHAVIOUR',
	TYPENAME_MUST_BE_A_STRING      : 'typename must be a string',
	HANDLER_MUST_BE_A_FUNCTION     : 'handler must be a function',
	WRONG_TYPE_DEFINITION          : 'wrong type definition',
	WRONG_INSTANCE_INVOCATION      : 'wrong instance invocation',
	WRONG_MODIFICATION_PATTERN     : 'wrong modification pattern',
	ALREADY_DECLARED               : 'this type has already been declared',
	EXISTENT_PROPERTY_REDEFINITION : 'attempt to re-define type constructor',
	WRONG_ARGUMENTS_USED           : 'wrong arguments : should use proper invocation',
	
	WRONG_HOOK_TYPE                : 'this hook type does not exist',
	MISSING_HOOK_CALLBACK          : 'hook definition requires callback',
	
	MISSING_CALLBACK_ARGUMENT      : 'callback is required argument',
	FLOW_CHECKER_REDEFINITION      : 'attempt to re-define flow checker callback',
	
	NAMESPACE_DOES_NOT_EXIST       : 'namespace does not exits',
	
};

