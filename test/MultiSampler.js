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
      const sampler = new Sampler({w: 64, h: 64, cw: 16, ch: 16, r:2});

      assert.isAtLeast(sampler.cellSamplers.length, 16);
    },
    'Should not die when huge' : () => {
      const sampler = new Sampler({w: 24576, h: 24576, cw: 2048, ch: 2048, r:1024, random: true});
      const points = sampler.getNewPoints(2000);

      assert.isAtLeast(points.length, 200);
    },
    'getPoints': {
      'Should return an array of all points.': () => {
        const sampler = new Sampler();
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 15);
      },
    },
    'getNewPoints': {
      'Should return an array of new points.': () => {
        const sampler = new Sampler();
        const points = sampler.getNewPoints(15);

        assert.isAtLeast(points.length, 15);
      },
    },
    'random getNewPoints': {
      'Should return an array of new points.': () => {
        const sampler = new Sampler({useRandom: true});
        const points = sampler.getNewPoints(15);

        assert.isAtLeast(points.length, 15);
      },

      'Should return an array of 1 point by default.': () => {
        const sampler = new Sampler({useRandom: true});
        const points = sampler.getNewPoints();

        assert.isAtLeast(points.length, 1);
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

        assert.isAtLeast(points.length, 2);
      },
      'Should return an array of points when points already exist': () => {
        const sampler = new Sampler();
        sampler.getPoints();
        const points = sampler.getPointsForCell(0, 0);

        assert.isAtLeast(points.length, 2);
      },
      'Should add sampler for out of range cell': () => {
        const sampler = new Sampler();
        const points = sampler.getPointsForCell(64, 0);

        assert.isAtLeast(points.length, 2);
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
        const beforeLength = sampler.getPoints(400).length;

        assert.equal(sampler.cellSamplers.length, 16);
        sampler.resize(32, 32);
        const afterLength = sampler.getPoints(400).length;

        assert.equal(sampler.cellSamplers.length, 4);
        assert.notEqual(beforeLength, afterLength);
      },
    },
    'prePopulate': {
      'should seed the sampler with given points': () => {
        const existing = [[1, 1]];
        const sampler = new Sampler();
        sampler.prePopulate(existing);
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 15);
        assert.isOk(points.find(p => p[0] === 1 && p[1] === 1));
      },
      'should reject points outside of sampler space': () => {
        const existing = [[-1000, 1]];
        const sampler = new Sampler();
        sampler.prePopulate(existing);
        const points = sampler.getPoints();

        assert.isAtLeast(points.length, 15);
        assert.isUndefined(points.find(p => p[0] === -1000 && p[1] === 1));
      }
    },
    'remove': {
      'should remove point from sampler': () => {
        const sampler = new Sampler();
        const points = sampler.getPoints();
        const p = points[0];

        sampler.remove(p[0], p[1]);

        const points2 = sampler.getPoints();
        const index = points2.findIndex(x => x[0] === p[0] && x[1] === p[1]);

        assert.equal(-1, index);
      }
    }
  },
};
