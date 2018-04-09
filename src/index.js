/**
 * Exocraft (https://exocraft.io)
 * Copyright (c) 2017 - 2018, GoldFire Studios, Inc.
 * http://goldfirestudios.com
 */

// const {distanceFrom} = require('./index.js');
const {libnoise} = require('libnoise');
const Mersenne = require('mersenne-twister');

/**
 * Get distance between points, optionally accounting for the wrapping of the world.
 * @param  {Number} x1    Target vector x.
 * @param  {Number} y1    Target vector y.
 * @param  {Number} x2    Starting position x.
 * @param  {Number} y2    Starting position y.
 * @param  {Number} limit Optional. Width/height of the world.
 * @return {Number}       Distance.
 */
const distanceFrom = (x1, y1, x2, y2, limit) => {
  let x = Math.abs(x1 - x2);
  if (x > limit / 2) {
    x = limit - x;
  }

  let y = Math.abs(y1 - y2);
  if (y > limit / 2) {
    y = limit - y;
  }

  return Math.sqrt((x * x) + (y * y));
};

/**
 * PoissonDiskSampler
 */
class PoissonDiskSampler {
  /**
   * @param {Number} [seed=42]
   * @param {Number} [h=640] Height of sampler.
   * @param {Number} [w=640] Width of sampler.
   * @param {Number} [k=500] Times to retry point placement.
   * @param {Number} [r=10] Radius to not place points within.
   * @param {Number} [maxPoints=500]
   * @param {Number} [floorValue=0.5] Floor of noise to ignore points below.
   * @return {Object}
   */
  constructor({
    seed = 42,
    h = 640,
    w = 640,
    k = 10,
    r = 10,
    maxPoints = 20,
    floorValue = 0.5,
    noiseWeight = 4,
    noiseConfig,
  }) {
    this.seed = seed;

    noiseConfig = {
      freq: noiseConfig.freq || 0.01,
      luna: noiseConfig.luna || 1,
      persistance: noiseConfig.persistance || 0.5,
      octaves: noiseConfig.octaves || 2,
    };

    this.noise = new libnoise.generator.Perlin(
      noiseConfig.freq,
      noiseConfig.luna,
      noiseConfig.persistance,
      noiseConfig.octaves,
      this.seed,
      libnoise.QualityMode.MEDIUM
    );

    this.rng = new Mersenne(this.seed);
    Object.assign(this, {
      h,
      w,
      k,
      r,
      maxPoints,
      floorValue,
      noiseWeight,
    });

    this.getPosHash = (x, y) => ((y & 0xFFFF) << 16) | (x & 0xFFFF);
    this.memoizedNoise = {};
  }

  /**
   * Create a set of points within w,h starting at x,y. 
   * @param {Number} [x=0]
   * @param {Number} [y=0]
   * @param {Number} [seed=0]
   * @return {Array} points
   */
  createPoints({x, y} = {x: 0, y: 0}, seed) {
    this.x = x;
    this.y = y;
    this.minX = (this.x + this.r);
    this.maxX = ((this.x + this.w) - this.r);
    this.minY = (this.y + this.r);
    this.maxY = ((this.y + this.h) - this.r);

    if (seed) {
      this.rng.init_seed(seed);
    }

    let failed = 0;
    let point = this._createFirst();
    const points = [];
    points.push(point);

    while (points.length < this.maxPoints && failed < this.k) {
      point = this._createAround(point);
      if (this._hitTest(point, points)) {
        points.push(point);
        failed = 0;
      } else {
        failed += 1;
      }
    }

    return points.filter((p) => {
      return this.noise ? this._getRandom(p.x, p.y) < this.floorValue : true;
    });
  }

  /**
   * Check if point is far enough from other points. 
   * @param {Object} point
   * @param {Array} points
   * @return {Boolean}
   */
  _hitTest(point, points) {
    let p;

    for (let i = 0; i < points.length; i += 1) {
      p = points[i];
      if (distanceFrom(p.x, p.y, point.x, point.y) < p.r + point.r) {
        return false;
      }
    }

    return true;
  }

  /**
   * @return {undefined}
   */
  _createFirst() {
    const x = this._intBetween(this.minX, this.maxX);
    const y = this._intBetween(this.minY, this.maxY);
    const r = this._getRadius(x, y);
    return {x, y, r};
  }

  /**
   * @param {Object} point
   * @return {undefined}
   */
  _createAround(point) {
    const rand = this.rng.random();
    const radius = point.r * 2;
    const a = Math.PI * 2 * rand;

    const x = point.x + (radius * Math.cos(a));
    const y = point.y + (radius * Math.sin(a));

    return {
      x: x > this.minX && x < this.maxX ? x : this._intBetween(this.minX, this.maxX),
      y: y > this.minY && y < this.maxY ? y : this._intBetween(this.minY, this.maxY),
      r: radius,
    };
  }

  /**
   * Get a random radius from x,y. 
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */
  _getRadius(x, y) {
    return (this._getRandom(x, y) * this.r * this.noiseWeight) + (this.r);
  }

  /**
   * Get a random number from perlin noise or from the RNG if no noise supplied. 
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */
  _getRandom(x, y) {
    if (this.noise) {
      const hash = this.getPosHash(x, y);
      if (this.memoizedNoise[hash]) {
        return this.memoizedNoise[hash];
      }
      const noiseValue = (this.noise.getValue(x, y, 0) + 1) / 2;
      this.memoizedNoise[hash] = noiseValue > 0 ? noiseValue : 0;
      return this.memoizedNoise[hash];
    }
    return this.rng.random();
  }

  /**
   * Get a random int between two numbers, from seeded rng. 
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  _intBetween(min, max) {
    return Math.floor((this.rng.random() * ((max - min) + 1)) + min);
  }
}

module.exports = PoissonDiskSampler;
