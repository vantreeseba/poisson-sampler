const {assert} = require('chai');
const Sampler = require('../MultiSampler');
const distanceFrom = require('../utils').distanceFrom;

module.exports = {
  MultiSampler: {
    'Should build the correct number of samplers': () => {
      const sampler = new Sampler();

      assert.isAtLeast(sampler.cellSamplers.length, 4);
    },
    'Should build the correct number of samplers given args': () => {
      const sampler = new Sampler({w: 64, h: 64, cw: 16, ch: 16, r:4});

      assert.isAtLeast(sampler.cellSamplers.length, 16);
    },
    'getPoints': {
      'Should return an array of all points.': () => {
        const sampler = new Sampler();
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 20);
      },
    },
    'Should return num of points requested': () => {
      const sampler = new Sampler({});
      const points = sampler.getPoints(4);

      assert.equal(points.length, 4);
    },
    'getPointsForCell': {
      'Should return an array of points.': () => {
        const sampler = new Sampler();
        const points = sampler.getPointsForCell(0, 0);

        assert.isAtLeast(points.length, 5);
      },
      'Should return an array of points when points already exist': () => {
        const sampler = new Sampler();
        sampler.getPoints();
        const points = sampler.getPointsForCell(0, 0);

        assert.isAtLeast(points.length, 5);
      },
      'Should add sampler for out of range cell': () => {
        const sampler = new Sampler();
        const points = sampler.getPointsForCell(64, 0);

        assert.isAtLeast(points.length, 5);
      },
    },
    'resize': {
      'Should rebuild sampler list': () => {
        const sampler = new Sampler({w: 32, h: 32, cw: 16, ch: 16, r: 4});
        assert.equal(sampler.cellSamplers.length, 4);
        sampler.resize(64, 64);
        assert.equal(sampler.cellSamplers.length, 16);
      },
      'Should remove samplers outside new size': () => {
        const sampler = new Sampler({w: 64, h: 64, cw: 16, ch: 16, r: 4});
        assert.equal(sampler.cellSamplers.length, 16);
        sampler.resize(32, 32);
        assert.equal(sampler.cellSamplers.length, 4);
      },
    },
    'prePopulate': {
      'should seed the sampler with given points': () => {
        const existing = [[1, 1]];
        const sampler = new Sampler();
        sampler.prePopulate(existing);
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 20);
        assert.isOk(points.find(p => p[0] === 1 && p[1] === 1));
      },
      'should reject points outside of sampler space': () => {
        const existing = [[-1000, 1]];
        const sampler = new Sampler();
        sampler.prePopulate(existing);
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 20);
        assert.isUndefined(points.find(p => p[0] === -1000 && p[1] === 1));
      }

    }
  },
};
