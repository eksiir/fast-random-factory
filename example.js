'use strict';

const _ = require('underscore'),
    rngFactory = require('./fast-random-factory.js');

const CACHE_SIZE = 10,
    N_CALLS = 50;

var rng = rngFactory.create({
        debug: true,
        cacheSize: CACHE_SIZE,
        min: -10000,
        max: -1,
        generator: {
            func: (min, max) => _.random(min, max),
            args: [0, 10000],
            argsValidator: (argsArray) => (argsArray[0] < argsArray[1]) ? null : new Error('min >= max')
        }
    });

//
// Output numbers will be between 0 and 10000 even if min and max are -ve
// because generator.args overrule min and max by design.  Comment out all
// generator object and you'll see -ve random numbers.
//
if (rng.err) {
    console.error('Error: ' + rng.err.message);
} else {
    for (let i = 0; i < N_CALLS; i++) {
        console.log(rng.gen());
    }
    console.log('cache index: ' + rng.cacheIndex());
}
