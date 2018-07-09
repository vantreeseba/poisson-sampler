const Sampler = require('./Sampler');
const RandomSampler = require('./RandomSampler');

/**
 * A poisson sampler that is a grid of samplers (this allows infinite worlds to use this).
 */
class MultiSampler {
  /**
   * Create a multisampler.
   *
   * @param {Object} config The config for the sampler.
   * @param {Number} [config.w=64] The width of the entire sample space.
   * @param {Number} [config.h=64] The height of the entire sample space.
   * @param {Number} [config.cw=32] The width of each sub sampler.
   * @param {Number} [config.ch=32] The height of each subsampler.
   * @param {Number} [config.r=10] The minimum radius between samples.
   */
  constructor(
    {w, h, cw, ch, r, useRandom} = {
      w: 64,
      h: 64,
      cw: 32,
      ch: 32,
      r: 10,
      useRandom: false
    }
  ) {
    this.w = w || 64;
    this.h = h || 64;
    this.cw = cw || 32;
    this.ch = ch || 32;
    this.r = r;

    this.dirty = true;

    this.samplerConstructor = useRandom ? RandomSampler : Sampler;

    this.buildSamplers();
    this.points = [];
    this.dirty = true;
  }

  /**
   * Build the internal list of samplers.
   * @private
   */
  buildSamplers() {
    this.cellSamplers = this.cellSamplers || [];

    const hw = (this.w / 2) | 0;
    const hh = (this.h / 2) | 0;

    for (let x = -hw; x < hw; x += this.cw) {
      for (let y = -hh; y < hh; y += this.ch) {
        if (!this.cellSamplers.find(s => s.x === x && s.y === y)) {
          this.cellSamplers.push(
            new this.samplerConstructor({
              w: this.cw,
              h: this.ch,
              r: this.r,
              x,
              y
            })
          );
        }
      }
    }

    for (var i = this.cellSamplers.length - 1; i >= 0; i--) {
      const cur = this.cellSamplers[i];
      if (cur.x < -hw || cur.x >= hw || cur.y < -hh || cur.y >= hh) {
        this.cellSamplers[i].getPoints(0).forEach(p => {
          const index = this.points.findIndex(
            x => x[0] === p[0] && x[1] === p[1]
          );
          this.points.splice(index, 1);
        });
        this.cellSamplers.splice(i, 1);
      }
    }

    this.dirty = true;
  }

  /**
   * Get all points from all sub-samplers.
   * @return {Array} The array of points.
   */
  getPoints(num = 0) {
    if(this.dirty) {
      this.dirty = false;
      this.points = this.cellSamplers
        .map(s => s.getPoints(num/this.cellSamplers.length))
        .reduce((arr, cur) => arr.concat(cur), []);
    }
    return this.points;
  }

  /**
   * Get new sample points from sampler.
   * @return {Array} An array of points.
   */
  getNewPoints(num = 1) {
    let newPoints = [];
    for (var i = 0; i < num; i++) {
      let point;
      this.cellSamplers
        .sort(() => {
          return Math.random() - 0.5;
        })
        .some(s => {
          point = s.getNewPoints(1);
          if (point.length > 0 && point[0]) {
            return true;
          }

          return false;
        });
      if (point[0]) {
        newPoints.push(point[0]);
        this.points.push(point[0]);
      }
    }
    return newPoints;
  }

  /**
   * Get points for a single cell.
   *
   * @param {Number} x The x coord in the cell.
   * @param {Number} y The y coord in the cell.
   * @return {Array} The array of points.
   */
  getPointsForCell(x, y) {
    let sampler = this.cellSamplers.find(s => s.x === x && s.y === y);
    if (!sampler) {
      sampler = new this.samplerConstructor({
        w: this.cw,
        h: this.ch,
        r: this.r,
        x,
        y
      });
      this.cellSamplers.push(sampler);
      this.points.push(sampler.getPoints());
    }

    return sampler.getPoints();
  }

  /**
   * Resize the multisampler.
   * @param {Number} h New height.
   * @param {Number} w New width.
   */
  resize(h, w) {
    this.w = w;
    this.h = h;

    this.buildSamplers();
    this.dirty = true;
  }

  /**
   * Prepopulates all the sub-samplers with the given points,
   * rejecting ones outside the subsamplers.
   * @param {Array} points The points to seed subsamplers with.
   */
  prePopulate(points) {
    this.cellSamplers.forEach(s => s.prePopulate(points));
  }

  /**
   * Remove a sample from the grid.
   * It will be replaced with new one the next time get points is called.
   *
   * @param {Number} x The x coord.
   * @param {Number} y The y coord.
   */
  remove(x, y) {
    const index = this.points.findIndex(p => p[0] === x && p[1] === y);
    this.points.splice(index, 1);
    this.cellSamplers.forEach(s => s.remove(x, y));
  }
}
module.exports = MultiSampler;
