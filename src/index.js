// Based on https://www.jasondavies.com/poisson-disc/
/**
 * A fast poison disc sampler.
 */
class PoissonDiscSampler {
  /**
   * constructor
   *
   * @param {Number} width The width of the sample space.
   * @param {Number} height The height of the sample space.
   * @param {Number} x The offset from "world" center (if you're using multiple samplers).
   * @param {Number} y The offset from the world center.
   * @param {Number} radius The minimum radius between points.
   */
  constructor(width, height, x, y, radius) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.k = 100; // maximum number of samples before rejection
    this.radius2 = radius * radius;
    this.R = 3 * this.radius2;
    this.cellSize = radius * Math.SQRT1_2;
    this.gridWidth = Math.ceil(width / this.cellSize);
    this.gridHeight = Math.ceil(height / this.cellSize);
    this.grid = new Array(this.gridWidth * this.gridHeight);
    this.queue = [];
    this.queueSize = 0;
    this.sampleSize = 0;

    // TODO: Seed with x,y hash.
    this.rng = new MersenneTwister();
  }

  getPoints() {
    this.rng.init_seed(64 + (this.x + 1 + Math.pow((this.y + 1), 2)));
    for (var i = 0; i < 1000; i++) {
      this.run();
    }

    return this.grid.filter(p => p).map(p => [p[0] + this.x, p[1] + this.y]);
  }

  run() {
    if (!this.sampleSize) {
      let x = this.rng.random() * this.width;
      let y = this.rng.random() * this.height;
      return this.sample(x, y);
    }

    // Pick a random existing sample and remove it from the queue.
    while (this.queueSize) {
      var i = (this.rng.random() * this.queueSize) | 0,
        s = this.queue[i];

      // Make a new candidate between [radius, 2 * radius] from the existing sample.
      for (var j = 0; j < this.k; ++j) {
        var a = 2 * Math.PI * this.rng.random(),
          r = Math.sqrt(this.rng.random() * this.R + this.radius2),
          x = s[0] + r * Math.cos(a),
          y = s[1] + r * Math.sin(a),
          cc = this.cellSize / 2;

        // Reject candidates that are outside the allowed extent,
        // or closer than 2 * radius to any existing sample.
        if (
          cc < x &&
          x < this.width - cc &&
          cc < y &&
          y < this.height - cc &&
          this.far(x, y)
        ) {
          return this.sample(x, y);
        }
      }

      this.queue[i] = this.queue[--this.queueSize];
      this.queue.length = this.queueSize;
    }
  }

  far(x, y) {
    let i = (x / this.cellSize) | 0;
    let j = (y / this.cellSize) | 0;

    const i0 = Math.max(i - 2, 0);
    const j0 = Math.max(j - 2, 0);
    const i1 = Math.min(i + 3, this.gridWidth);
    const j1 = Math.min(j + 3, this.gridHeight);

    for (j = j0; j < j1; ++j) {
      let o = j * this.gridWidth;
      let s;
      for (i = i0; i < i1; ++i) {
        s = this.grid[o + i];
        if (s) {
          let dx = s[0] - x;
          let dy = s[1] - y;
          if (dx * dx + dy * dy < this.radius2) {
            return false;
          }
        }
      }
    }

    return true;
  }

  xyToIndex(x, y) {
    return (
      this.gridWidth * ((y / this.cellSize) | 0) + ((x / this.cellSize) | 0)
    );
  }

  sample(x, y) {
    var point = [x, y];
    this.queue.push(point);
    this.grid[this.xyToIndex(x, y)] = point;
    ++this.sampleSize;
    ++this.queueSize;
    return point;
  }
}

module.exports = PoissonDiscSampler;
