const Sampler = require('./Sampler');

/**
 * A poisson sampler that is a grid of samplers (this allows infinite worlds to use this).
 */
class MultiSampler {
  /**
   * Create a multisampler.
   *
   * @param {Number} w The width of the entire sample space.
   * @param {Number} h The height of the entire sample space.
   * @param {Number} cw The width of each sub sampler.
   * @param {Number} ch The height of each subsampler.
   * @param {Number} r The minimum radius between samples.
   */
  constructor({w, h, cw, ch, r} = {w:64, h:64, cw:32, ch:32, r:10}) {
    this.w = w || 64;
    this.h = h || 64;
    this.cw = cw || 32;
    this.ch = ch || 32;
    this.r = r;

    this.dirty = true;

    this.buildSamplers();
    this.points = [];
  }

  /**
   * Build the internal list of samplers.
   * @private
   */
  buildSamplers() {
    this.cellSamplers = this.cellSamplers || [];

    for(let x = 0; x < this.w; x+= this.cw){
      for(let y = 0; y < this.h; y+= this.ch){
        if(!this.cellSamplers.find(s => s.x === x && s.y === y)){
          this.cellSamplers.push(new Sampler({
            w: this.cw,
            h: this.ch,
            r: this.r,
            x,
            y,
          }));
        }
      }
    }
  }

  /**
   * Get all points from all sub-samplers.
   * @return {Array} The array of points.
   */
  getPoints() {
    if(this.dirty) {
      this.points = this.cellSamplers
        .map(s => s.getPoints())
        .reduce((arr, cur) => arr.concat(cur), []);

      this.dirty = false;
    }

    return this.points;
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
    if(!sampler) {
      sampler = new Sampler({
        w: this.cw,
        h: this.ch,
        r: this.r,
        x,
        y,
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
}

module.exports = MultiSampler;
