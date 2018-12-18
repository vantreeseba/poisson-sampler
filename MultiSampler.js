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

    this.samplerConstructor = useRandom ? RandomSampler : Sampler;

    this.cellSamplers = [];
    this.buildSamplers();
  }

  /**
   * Build the internal list of samplers.
   * @private
   */
  buildSamplers() {
    const hw = (this.w / 2) | 0;
    const hh = (this.h / 2) | 0;

    const points = this.getPoints(-1);

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
        this.cellSamplers.splice(i, 1);
      }
    }

    this.prePopulate(points);
  }

  /**
   * Get all points from all sub-samplers.
   * @return {Array} The array of points.
   */
  getPoints(num = 0) {
    return this.cellSamplers
      .map(s => s.getPoints(num/this.cellSamplers.length))
      .reduce((arr, cur) => arr.concat(cur), []);
  }

  /**
   * Get new sample points from sampler.
   * @return {Array} An array of points.
   */
  getNewPoints(num = 1) {
    let newPoints = [];
    this.cellSamplers = this.cellSamplers
      .sort(() => {
        return Math.random() - 0.5;
      });

    let sIndex = 0;
    let perSamp = Math.ceil(num / this.cellSamplers.length);

    for (var i = 0; i < num; i++) {
      if(sIndex >= this.cellSamplers.length) {
        sIndex = 0;
      }
      let points = this.cellSamplers[sIndex++].getNewPoints(perSamp);
      for(var j = 0; j < points.length; j++){
        newPoints.push(points[j]);
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
    let px = x, py = y;
    if(x instanceof Array || (x[0] && x[1])) {
      px = x[0];
      py = x[1];
    }
    return this.cellSamplers.some(s => s.remove(px, py));
  }
}
module.exports = MultiSampler;
