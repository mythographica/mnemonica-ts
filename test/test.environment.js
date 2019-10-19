'use strict';

const { assert, expect } = require('chai');

const {
	define,
	defaultTypes : types,
	defaultNamespace,
	namespaces,
	SymbolDefaultNamespace,
	SymbolSubtypeCollection,
	SymbolConstructorName,
	MNEMONICA,
	MNEMOSYNE,
	createTypesCollection
} = require('..');

const test = (opts) => {
		
	const {
		userTC,
		UserType,
		overMore,
		moreOver,
		anotherNamespace,
		anotherTypesCollection,
		oneElseTypesCollection,
		AnotherCollectionInstance,
		AnotherCollectionType,
		OneElseCollectionInstance,
		OneElseCollectionType
	} = opts;
	
	describe('Check Environment', () => {
		const {
			errors,
			ErrorMessages,
		} = require('..');
		
		describe('core env tests', () => {
			
			it('.SubTypes definition is correct Regular', () => {
				expect(userTC.hasOwnProperty('WithoutPassword')).is.false;
			});
			it('.SubTypes definition is correct Regular FirstChild', () => {
				expect(Object.getPrototypeOf(Object.getPrototypeOf(userTC)).hasOwnProperty('WithoutPassword')).is.true;
			});

			it('.SubTypes definition is correct Regular Nested Children', () => {
				assert.notEqual(
					Object.getPrototypeOf(Object.getPrototypeOf(overMore)),
					Object.getPrototypeOf(Object.getPrototypeOf(moreOver))
				);
				expect(Object.getPrototypeOf(Object.getPrototypeOf(overMore)).hasOwnProperty('EvenMore')).is.true;
				expect(Object.getPrototypeOf(Object.getPrototypeOf(moreOver)).hasOwnProperty('OverMore')).is.true;
			});
			
			it('namespaces shoud be defined', () => {
				expect(namespaces).exist.and.is.a('map');
			});
			it('defaultNamespace shoud be defined', () => {
				expect(defaultNamespace).to.be.an('object')
					.and.equal(namespaces.get(SymbolDefaultNamespace));
				expect(defaultNamespace.name).to.be.a('symbol')
					.and.equal(SymbolDefaultNamespace);
			});
			it('MNEMONICA shoud be defined', () => {
				expect(MNEMONICA).to.be.a('string').and.equal('Mnemonica');
			});
			it('MNEMOSYNE shoud be defined', () => {
				expect(MNEMOSYNE).to.be.a('string').and.equal('Mnemosyne');
			});
			it('SymbolSubtypeCollection shoud be defined', () => {
				expect(SymbolSubtypeCollection).to.be.a('symbol');
			});
			it('SymbolConstructorName shoud be defined', () => {
				expect(SymbolConstructorName).to.be.a('symbol');
			});
			it('instance checking works', () => {
				expect(true instanceof UserType).to.be.false;
				expect(undefined instanceof UserType).to.be.false;
				expect(Object.create(null) instanceof UserType).to.be.false;
			});
			try {
				createTypesCollection({});
			} catch (error) {
				it('should register types collection for proper namespace', () => {
					expect(error.message).is.equal(ErrorMessages.NAMESPACE_DOES_NOT_EXIST);
				});
			}
			it('should refer defaultTypes from types.get(defaultNamespace)', () => {
				expect(defaultNamespace.typesCollections.has(types)).is.true;
			});
		});
		describe('base error shoud be defined', () => {
			it('BASE_MNEMONICA_ERROR exists', () => {
				expect(errors.BASE_MNEMONICA_ERROR).to.exist;
			});
			try {
				throw new errors.BASE_MNEMONICA_ERROR();
			} catch (error) {
				it('base error instanceof Error', () => {
					expect(error).instanceOf(Error);
				});
				it('base error instanceof BASE_MNEMONICA_ERROR', () => {
					expect(error).instanceOf(errors.BASE_MNEMONICA_ERROR);
				});
				it('base error .message is correct', () => {
					expect(error.message).is.equal(ErrorMessages.BASE_ERROR_MESSAGE);
				});
			}
		});
		describe('should respect DFD', () => {
			const BadType = define('BadType', function (NotThis) {
				// returns not instanceof this
				return NotThis;
			});
			BadType.define('ThrownBadType');
			try {
				new BadType({}).ThrownBadType();
			} catch (error) {
				it('should respect the rules', () => {
					expect(error).instanceOf(Error);
				});
				it('thrown error instanceof WRONG_MODIFICATION_PATTERN', () => {
					expect(error).instanceOf(errors.WRONG_MODIFICATION_PATTERN);
				});
				it('thrown error should be ok with props', () => {
					expect(error.message).exist.and.is.a('string');
					assert.equal(error.message, 'wrong modification pattern : should inherit from mnemonica instance');
				});
			}
		});
		describe('should not hack DFD', () => {
			const BadTypeReThis = define('BadTypeReThis', function () {
				// removing constructor
				this.constructor = undefined;
			});
			BadTypeReThis.define('ThrownHackType');
			try {
				new BadTypeReThis().ThrownHackType();
			} catch (error) {
				it('should respect construction rules', () => {
					expect(error).instanceOf(Error);
				});
				it('thrown error instanceof WRONG_MODIFICATION_PATTERN', () => {
					expect(error).instanceOf(errors.WRONG_MODIFICATION_PATTERN);
				});
				it('thrown error should be ok with props', () => {
					expect(error.message).exist.and.is.a('string');
					assert.equal(error.message, 'wrong modification pattern : should inherit from mnemonica instance');
				});
			}
		});
		describe('subtype property type re-definition', () => {
			const BadTypeReContruct = define('BadTypeReContruct', function () {
				this.ExistentConstructor = undefined;
			});
			BadTypeReContruct.define('ExistentConstructor');
			try {
				new BadTypeReContruct().ExistentConstructor();
			} catch (error) {
				it('should respect construction rules', () => {
					expect(error).instanceOf(Error);
				});
				it('thrown error instanceof EXISTENT_PROPERTY_REDEFINITION', () => {
					expect(error).instanceOf(errors.EXISTENT_PROPERTY_REDEFINITION);
				});
			}
		});
		describe('subtype property inside type re-definition', () => {
			const BadTypeReInConstruct = define('BadTypeReInConstruct', function () {});
			BadTypeReInConstruct.define('ExistentConstructor', function () {
				this.ExistentConstructor = undefined;
			});
			try {
				new BadTypeReInConstruct().ExistentConstructor();
			} catch (error) {
				it('Thrown with General JS Error', () => {
					expect(error).instanceOf(Error);
				});
			}
		});
		describe('should throw with wrong definition', () => {
			[
				['prototype is not an object', () => {
					define('wrong', function () {}, true);
				}, errors.WRONG_TYPE_DEFINITION],
				['no definition', () => {
					define();
				}, errors.WRONG_TYPE_DEFINITION],
				['intentionally bad definition', () => {
					define('NoConstructFunctionType', NaN, '', 'false');
				}, errors.HANDLER_MUST_BE_A_FUNCTION],
				['intentionally bad type definition', () => {
					define(() => {
						return {
							name : null
						};
					});
				}, errors.HANDLER_MUST_BE_A_FUNCTION],
				['re-definition', () => {
					define('UserTypeConstructor', () => {
						return function WithoutPassword () {};
					});
				}, errors.ALREADY_DECLARED],
				['prohibit anonymous', () => {
					define('UserType.UserTypePL1', () => {
						return function () {};
					});
				}, errors.TYPENAME_MUST_BE_A_STRING],
			].forEach(entry => {
				const [name, fn, err] = entry;
				it(`check throw with : ${name}`, () => {
					expect(fn).throw();
					try {
						fn();
					} catch (error) {
						expect(error).to.be.an
							.instanceof(err);
						expect(error).to.be.an
							.instanceof(Error);
					}
				});
			});
		});
		
		describe('another namespace instances', () => {
			anotherNamespace;
			it('Another Nnamespace has both defined collections', () => {
				expect(anotherNamespace.typesCollections.has(anotherTypesCollection)).is.true;
				expect(anotherNamespace.typesCollections.has(oneElseTypesCollection)).is.true;
			});
			it('Another Nnamespace typesCollections gather types', () => {
				expect(anotherTypesCollection).hasOwnProperty('AnotherCollectionType');
				expect(oneElseTypesCollection).hasOwnProperty('OneElseCollectionType');
			});

			it('Instance Of Another Nnamespace and AnotherCollectionType', () => {
				expect(AnotherCollectionInstance).instanceOf(AnotherCollectionType);
			});
			it('Instance Of OneElse Nnamespace and OneElseCollectionType', () => {
				expect(OneElseCollectionInstance).instanceOf(OneElseCollectionType);
			});
		});
		
		describe('hooks environment', () => {
			try {
				defaultNamespace.registerFlowChecker();
			} catch (error) {
				it('Thrown with Missing Callback', () => {
					expect(error).instanceOf(Error);
					expect(error).instanceOf(errors.MISSING_CALLBACK_ARGUMENT);
				});
			}
			try {
				defaultNamespace.registerFlowChecker(() => {});
			} catch (error) {
				it('Thrown with Re-Definition', () => {
					expect(error).instanceOf(Error);
					expect(error).instanceOf(errors.FLOW_CHECKER_REDEFINITION);
				});
			}
			try {
				defaultNamespace.registerHook('WrongHookType', () => {});
			} catch (error) {
				it('Thrown with Re-Definition', () => {
					expect(error).instanceOf(Error);
					expect(error).instanceOf(errors.WRONG_HOOK_TYPE);
				});
			}
			try {
				defaultNamespace.registerHook('postCreation');
			} catch (error) {
				it('Thrown with Re-Definition', () => {
					expect(error).instanceOf(Error);
					expect(error).instanceOf(errors.MISSING_HOOK_CALLBACK);
				});
			}
		});
		
	});
	
};

module.exports = test;