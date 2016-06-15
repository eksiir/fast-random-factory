'use strict';

const _ = require('underscore'),
    factoryConfig = require('./fast-random-factory-config.js');

const generator = (cfg) => {
    return cfg.generator.func.apply(null, cfg.generator.args);
};

const initCache = (cfg) => {
    var cache = {
        index: 0,
        mem: []
    };

    if (cfg.cacheSize === 1) {
        cache.mem.push(generator(cfg));
    } else {
        cache.mem = _.times(cfg.cacheSize, () => generator(cfg));
        if (cfg.shuffle) {
            cache.mem = _.shuffle(cache.mem);
            if (cfg.debug) {
                cfg.logger('shuffled random array');
            }
        }
    }

    if (cfg.debug) {
        cfg.logger('cache: ' + JSON.stringify(cache));
    }
    
    return cache;
};

const generate = function* (cfg, cache) {
    while (cache.index < cfg.cacheSize) {
        yield cache.mem[cache.index++];
    }
};

module.exports.create = (options) => {
    var cfg,
        cache,
        configObj = factoryConfig(options);
    
    if (configObj.err) {
        return {err: configObj.err};
    }
    cfg = configObj.config;
    cache = initCache(cfg);
    
    return {
        err: null,
        config: cfg,
        cache: () => cache,
        cacheIndex: () => cache.index - 1,
        refreshCache: () => cache = initCache(cfg),
        gen: () => {
            var rand = generate(cfg, cache).next();
            if (rand.done) {
                cache = initCache(cfg);         // refresh cache
                rand = generate(cfg, cache).next();
            }
            return rand.value;
        }
    };
};
