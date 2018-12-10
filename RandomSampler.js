const MersenneTwister = require('mersenne-twister');

/**
 * A fast poison disc sampler.
 * Based on https://www.jasondavies.com/poisson-disc/
 */
class RandomSampler {
  /**
   * constructor
   *
   * @param {Object} config The config for the sampler.
   * @param {Number} [config.w=64] The width of the sample space.
   * @param {Number} [config.h=64] The height of the sample space.
   * @param {Number} [config.x=0] The offset from "world" center (used by multisampler).
   * @param {Number} [config.y=0] The offset from world center.
   * @param {Number} [config.r=10] The minimum radius between points.
   */
  constructor({w, h, x, y, r} = {w: 64, h: 64, x: 0, y: 0, r: 10}) {
    this.r = r || 10;
    this.w = w || 64;
    this.h = h || 64;
    this.x = x || 0;
    this.y = y || 0;
    this.k = 100; // maximum number of samples before rejection
    this.radius2 = this.r * this.r;
    this.R = 3 * this.radius2;
    this.cellSize = this.r * Math.SQRT1_2;
    this.gridWidth = Math.ceil(this.w / this.cellSize);
    this.gridHeight = Math.ceil(this.h / this.cellSize);
    this.grid = new Array(this.gridWidth * this.gridHeight);

    this.rng = new MersenneTwister();
    this.rng.init_seed(this.x + 1 + Math.pow(this.y + 1, 2));
  }

  /**
   * Get all sample points from sampler.
   * @return {Array} An array of points.
   */
  getPoints(num = 0) {
    const maxPoints = num || this.gridHeight * this.gridWidth;
    for (var i = 0; i < maxPoints; i++) {
      this.run();
    }

    return this.grid.filter(p => p).map(p => [p[0] + this.x, p[1] + this.y]);
  }

  /**
   * Get new sample points from sampler.
   * @param {Number} The number of new points desired.
   * @return {Array} An array of points.
   */
  getNewPoints(num = 1) {
    const maxPoints = num || this.gridHeight * this.gridWidth;
    const newPoints = [];
    
    for (var i = 0; i < maxPoints; i++) {
      let s = this.run();
      if (s) {
        newPoints.push([s[0] + this.x, s[1] + this.y]);
      }
    }
    return newPoints;
  }

  /**
   * Runs the sampler.
   */
  run() {
    let kk = 0;
    let cc = this.cellSize * 0.7;
    while(kk < 10) {
      let x = cc + (this.rng.random() * (this.w - (cc * 2)));
      let y = cc + (this.rng.random() * (this.h - (cc * 2)));
      kk++;

      if (this.far(x, y)) {
        let s = this.sample(x, y);
        if (s) {
          return s;
        }
      }
    }
  }

  /**
   * far
   *
   * @private
   * @param {Number} x
   * @param {Number} y
   */
  far(x, y) {
    let i = (x / this.cellSize) | 0;
    let j = (y / this.cellSize) | 0;

    const i0 = Math.max(i - 2, 0);
    const j0 = Math.max(j - 2, 0);
    const i1 = Math.min(i + 3, this.gridWidth);
    const j1 = Math.min(j + 3, this.gridHeight);
    let dx, dy;

    for (j = j0; j < j1; ++j) {
      let o = j * this.gridWidth;
      let s;
      for (i = i0; i < i1; ++i) {
        s = this.grid[o + i];
        if (s) {
          dx = s[0] - x;
          dy = s[1] - y;
          if (dx * dx + dy * dy < this.radius2) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Get an index into the grid based from the x,y coord.
   * @private
   * @param {Number} x The x coord.
   * @param {Number} y The y coord.
   * @return {Number} The index into the grid array.
   */
  xyToIndex(x, y) {
    return (
      this.gridWidth * ((y / this.cellSize) | 0) + ((x / this.cellSize) | 0)
    );
  }

  /**
   * Record a sample.
   * @private
   * @param {Number} x The x coord of the sample.
   * @param {Number} y The y coord of the sample.
   * @return {Object} The point sampled.
   */
  sample(x, y) {
    let index = this.xyToIndex(x, y);
    if (this.grid[index]) {
      return;
    }

    return (this.grid[index] = [x, y]);
  }

  /**
   * Remove a sample from the grid.
   * It will be replaced with new one the next time get points is called.
   *
   * @param {Number} x The x coord.
   * @param {Number} y The y coord.
   */
  remove(x, y) {
    let px = x, py = y;
    if(x instanceof Array) {
      px = x[0];
      py = x[1];
    }
    if(px < this.x || py < this.y || px > this.x + this.w || py > this.y + this.h){
      return false;
    }
    const index = this.xyToIndex(px - this.x, py - this.y);
    if(!this.grid[index]) {
      return false;
    }
    delete this.grid[index];

    return true;
  }

  /**
   * Pre-populate the sampler with points.
   * @param {Array} points The points to add to the sampler.
   */
  prePopulate(points) {
    points.forEach(p => {
      const inside = Array.isArray(p)
        ? p[0] >= this.x &&
          p[0] <= this.x + this.w &&
          p[1] >= this.y &&
          p[1] <= this.h + this.y
        : p.x >= this.x &&
          p.x <= this.x + this.w &&
          p.y >= this.y &&
          p.y <= this.h + this.y;

      if (inside) {
        Array.isArray(p)
          ? this.sample(p[0] - this.x, p[1] - this.y)
          : this.sample(p.x - this.x, p.y - this.y);
      }
    });
  }
}
module.exports = RandomSampler;
