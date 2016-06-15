'use strict';

const _ = require('underscore'),
    rngFactory = require('../src/fast-random-factory.js');

describe('not using options should use all defaults,', () => {
    // also tests successful cases
    var rng = rngFactory.create();
    it('should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });

    rng = rngFactory.create(undefined);
    it('(undefined) otherwise, should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });

    rng = rngFactory.create({});
    it('({}) otherwise, should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });
});

describe('options.generator - no caching (cacheSize = 1),', () => {
    var generator, rng;

    beforeEach(() => {
        generator = {
            func: (min, max) => _.random(min, max),
            args: [-100, 100],
            argsValidator: (argsArray) => (argsArray[0] < argsArray[1]) ? null : new Error('min >= max')
        };

        spyOn(generator, 'func').and.callThrough();
        spyOn(generator, 'argsValidator').and.callThrough();

        rng = rngFactory.create({generator});
    });

    it('should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });

    it('should be called only once', () => {
        expect(generator.func).toHaveBeenCalledTimes(1);
    });

    it('should be called with correct args', () => {
        expect(generator.func).toHaveBeenCalledWith(generator.args[0], generator.args[1]);
    });

    it('should be called only once', () => {
        expect(generator.argsValidator).toHaveBeenCalledTimes(1);
    });

    it('should be called with correct args', () => {
        expect(generator.argsValidator).toHaveBeenCalledWith(generator.args);
    });
});

describe('options.generator - with caching (cacheSize > 1),', () => {
    const CACHE_SIZE = 5,
        N_CALLS = 23;

    var generator, rng;

    beforeEach(() => {
        generator = {
            func: (min, max) => _.random(min, max),
            args: [-100, 100],
            argsValidator: (argsArray) => (argsArray[0] < argsArray[1]) ? null : new Error('min >= max')
        };

        spyOn(generator, 'func').and.callThrough();
        spyOn(generator, 'argsValidator').and.callThrough();

        rng = rngFactory.create({cacheSize: CACHE_SIZE, generator});
        for (let i = 0; i < N_CALLS; i++) {
            var rand = rng.gen();
        }
    });

    it('should result in no errors and return a number', () => {
        expect(rng).toBeFastRandomFactorySuccess();
    });

    it('should be called only N_CALLS times', () => {
        let times = Math.floor(N_CALLS / CACHE_SIZE);
        if (N_CALLS % CACHE_SIZE) {
            times++;
        }
        times *= CACHE_SIZE;
        expect(generator.func).toHaveBeenCalledTimes(times);
    });

    it('should be called with correct args', () => {
        expect(generator.func).toHaveBeenCalledWith(generator.args[0], generator.args[1]);
    });

    it('should be called only once', () => {
        expect(generator.argsValidator).toHaveBeenCalledTimes(1);
    });

    it('should be called with correct args', () => {
        expect(generator.argsValidator).toHaveBeenCalledWith(generator.args);
    });
});

describe('options.min and options.max are ignored if options.generator.args are provided:', () => {
    var generator = {
            func: (min, max) => _.random(min, max),
            args: [1, 100],
            argsValidator: (argsArray) => (argsArray[0] < argsArray[1]) ? null : new Error('min >= max')
        },
        rng;

    it('-ve min max range should result in no errors and return a -ve number', () => {
        rng = rngFactory.create({min: -100, max: -1});
        expect(rng).toBeFastRandomFactorySuccess();
        expect(rng.gen()).toBeLessThan(0);
    });

    it('-ve min max range but a +ve range of generator.args should result in no errors and return a +ve number', () => {
        rng = rngFactory.create({min: -100, max: -1, generator});
        expect(rng).toBeFastRandomFactorySuccess();
        expect(rng.gen()).toBeGreaterThan(0);
    });
});

describe('multiple calls to generate random numbers,', () => {
    const CACHE_SIZE = 100,
        N_CALLS = 52;

    var rng = rngFactory.create({cacheSize: CACHE_SIZE, min: 0, max: 1000});

    xit('should have no repetitions', () => {               // TODO there's no such guarantee
        var results = [];
        for (let i = 0; i < N_CALLS; i++) {
            results.push(rng.gen());
        }
    
        expect(_.uniq(results).length).toEqual(results.length);
    });
});

describe('concurrency: multiple factories,', () => {
    it('should not share the same cache', () => {
        // TODO
    });
});