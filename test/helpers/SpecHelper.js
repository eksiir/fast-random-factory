'use strict';

beforeEach(function () {
    jasmine.addMatchers({
        toBeFastRandomFactorySuccess: () => {
            return {
                // actual is typically rng = rngFactory.create()
                compare: (actual, expected) => {
                    return {
                        pass: actual && !actual.err && typeof actual.gen() === 'number'
                    }
                }
            }
        },
        toBeFastRandomFactoryError: () => {
            return {
                // actual is typically rng = rngFactory.create()
                compare: (actual, expected) => {
                    return {
                        pass: actual && actual.err && actual.err.message && typeof actual.err.message === 'string'
                    }
                }
            }
        }
    });
});
