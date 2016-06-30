'use strict';

const _ = require('underscore');

const invalidNumber = (value) => (typeof value !== 'number') || !isFinite(value);

const invalidInteger = (value) => invalidNumber(value) || !Number.isInteger(value);

const validateCacheSize = (cacheSize) => {
    if (invalidInteger(cacheSize)) {
        return new Error('cacheSize=' + cacheSize + ' invalid number');
    }
    if (cacheSize < 1) {
        return new Error('cacheSize=' + cacheSize + ' < 1');
    }
    
    return null;
};

const validateMinMax = (min, max) => {
    if (invalidNumber(min)) {
        return new Error('min=' + min + ' invalid number');
    }
    if (invalidNumber(max)) {
        return new Error('max=' + max + ' invalid number');
    }
    if (max <= min) {
        return new Error('min=' + min + ' max=' + max + ' min >= max');
    }
    
    return null;
};

const validateGenerator = (generator) => {
    if (generator === undefined || typeof generator != 'object') {
        return new Error('invalid generator object');
    }
    
    if (!_.isFunction(generator.func)) {
        return new Error('generator func is not a function');
    }
    
    if (!_.isArray(generator.args)) {
        return new Error('generator.args is not an array');
    }
    if (!_.isFunction(generator.argsValidator)) {
        return new Error('generator.argsValidator is not a function');
    }
    
    return generator.argsValidator(generator.args);
};

const validateConfig = (config) => {
    var err = validateCacheSize(config.cacheSize);
    if (err) {
        return err;
    }
    
    err = validateMinMax(config.min, config.max);
    if (err) {
        return err;
    }

    if (!_.isFunction(config.logger)) {
        return new Error('logger is not a function');
    }

    return validateGenerator(config.generator);
};

const processConfig = (config) => {
    // defaults
    if (!_.isFunction(config.logger)) {
        config.logger = console.log;
    }
    
    if (config.cacheSize === undefined) {
        config.cacheSize = 1;
        if (config.debug) {
            config.logger('undefined config.cacheSize replaced with 1');
        }
    }
    if (config.min === undefined) {
        config.min = Number.MIN_SAFE_INTEGER;
        if (config.debug) {
            config.logger('undefined config.min replaced with ' + config.min);
        }
    }
    if (config.max === undefined) {
        config.max = Number.MAX_SAFE_INTEGER;
        if (config.debug) {
            config.logger('undefined config.max replaced with ' + config.max);
        }
    }
    
    if (config.generator === undefined || typeof config.generator != 'object') {
        config.generator = {
            func: (min, max) => {
                return _.random(min, max);
            },
            args: Array.of(config.min, config.max),
            argsValidator: (argsArray) => validateMinMax(argsArray[0], argsArray[1])
        };
    }

    if (config.shuffle === undefined) {
        config.shuffle = true;
    }

    if (config.debug) {
        config.logger('config: ' + JSON.stringify(config));
    }
    
    return validateConfig(config);
};

// 
// Completes the 'config' object by setting undefined
// fields to their defaults and then validates them.
//
module.exports = (options) => {
    var config = options || {},
        err = processConfig(config);

    return {err, config};
};
