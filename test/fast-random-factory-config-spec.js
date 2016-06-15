'use strict';

const _ = require('underscore'),
    rngFactory = require('../src/fast-random-factory.js');

//
// Testing the options object.
//
describe('should get an error because of invalid options.min', () => {
    var rng = rngFactory.create({min: NaN});
    it('(NaN), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({min: Infinity});
    it('(Infinity), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({min: 'SomeString'});
    it('(SomeString), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error because of invalid options.max', () => {
    var rng = rngFactory.create({max: NaN});
    it('(NaN), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({max: Infinity});
    it('(Infinity), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({max: 'SomeString'});
    it('(SomeString), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error if options.min === options.max,', () => {
    var rng = rngFactory.create({min: 100, max: 100});
    it('otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error if options.min > options.max,', () => {
    var rng = rngFactory.create({min: 101, max: 100});
    it('otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error because of invalid options.cacheSize', () => {
    var rng = rngFactory.create({cacheSize: NaN});
    it('(NaN), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({cacheSize: Infinity});
    it('(Infinity), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });

    rng = rngFactory.create({cacheSize: 'SomeString'});
    it('(SomeString), otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error if options.cacheSize < 1,', () => {
    var rng = rngFactory.create({cacheSize: 0});
    it('otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

describe('should get an error if options.cacheSize is not a whole number,', () => {
    var rng = rngFactory.create({cacheSize: 100.5});
    it('otherwise should result in error with reason message', () => {
        expect(rng).toBeFastRandomFactoryError();
    });
});

// logging is too important for debugging to be crippled by mistake.  We must
// have ensured a reasonable default is used in case a non-function was passed.
describe('if options.logger is not a function,', () => {
    var rng = rngFactory.create({logger: 10});
    it('should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });
});

//
// Testing options.generator
//

describe('should get an error because of invalid options.generator fields,', () => {
    var generator = {
            func: (min, max) => _.random(min, max),
            args: [-100, 100],
            argsValidator: (argsArray) => (argsArray[0] < argsArray[1]) ? null : new Error('min >= max')
        },
        rng;

    it('invalid generator.func should result in error with reason message', () => {
        generator.func = undefined;
        rng = rngFactory.create({generator});
        expect(rng).toBeFastRandomFactoryError();
    });

    it('undefined generator.args should result in error with reason message', () => {
        generator.args = undefined;
        rng = rngFactory.create({generator});
        expect(rng).toBeFastRandomFactoryError();
    });

    it('invalid generator.argsValidator should result in error with reason message', () => {
        generator.argsValidator = undefined;
        rng = rngFactory.create({generator});
        expect(rng).toBeFastRandomFactoryError();
    });

    it('min === max in generator.args should result in error with reason message', () => {
        generator.args = [100, 100];
        rng = rngFactory.create({generator});
        expect(rng).toBeFastRandomFactoryError();
    });

    it('min > max in generator.args should result in error with reason message', () => {
        generator.args = [100, 10];
        rng = rngFactory.create({generator});
        expect(rng).toBeFastRandomFactoryError();
    });
});
