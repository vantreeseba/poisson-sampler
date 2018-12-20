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
      'should keep same points as before when growing': () => {
        const sampler = new Sampler({w: 32, h: 32, cw: 16, ch: 16, r: 4});
        sampler.getNewPoints(500);
        const before = sampler.getPoints(-1);

        sampler.resize(64, 64);
        const after = sampler.getPoints(-1);

        assert.deepEqual(before, after);
      },
      'should keep same points as before when shrinking': () => {
        const sampler = new Sampler({w: 64, h: 64, cw: 16, ch: 16, r: 4});

        sampler.getNewPoints(500);
        sampler.resize(128, 128);
        sampler.getNewPoints(500);
        sampler.resize(512, 512);
        sampler.getNewPoints(500);
        sampler.resize(256, 256);
        const before = sampler.getPoints(-1);

        const filtered = before.filter(p => {
          return p[0] > -16 && p[1] > -16 && p[0] < 16 && p[1] < 16;
        });

        sampler.resize(32, 32);
        const after = sampler.getPoints(-1);

        assert.equal(filtered.length, after.length);
        assert.deepEqual(filtered, after);
      }

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
        const p1Length = points.length;

        const removed = sampler.remove(p[0], p[1]);

        const points2 = sampler.getPoints(-1);
        const index = points2.findIndex(x => x[0] === p[0] && x[1] === p[1]);

        assert.equal(index, -1);
        assert.notEqual(p1Length, points2.length);
        assert.isTrue(removed);
      },
      'should remove point as array from sampler': () => {
        const sampler = new Sampler();
        const points = sampler.getPoints();
        const p = points[0];
        const p1Length = points.length;

        const removed = sampler.remove(p);

        const points2 = sampler.getPoints(-1);
        const index = points2.findIndex(x => x[0] === p[0] && x[1] === p[1]);

        assert.equal(-1, index);
        assert.notEqual(p1Length, points2.length);
        assert.isTrue(removed);
      },
      'should not change anything if point does not exist': () => {
        const sampler = new Sampler();
        const points = sampler.getPoints();
        const p = [543534, 53453443];
        const p1length = points.length;

        const removed = sampler.remove(p);

        const points2 = sampler.getPoints();
        const index = points2.findIndex(x => x[0] === p[0] && x[1] === p[1]);

        assert.equal(-1, index);
        assert.equal(p1length, points2.length);
        assert.isFalse(removed);
      }
    },
    'randomStressTest': {
      // 'create and destroy a bunch of points': function() {
      //   this.timeout(30000);
      //   let points = [];
      //   let sampler;
      //   let total = 0;

      //   for(k = 0; k < 20; k++){
      //     sampler = new Sampler({useRandom: true, h: 500, w: 500, ch:10, cw:10, r: 5});
      //     sampler.prePopulate(points);

      //     for(let i = 0; i < 20; i++) {
      //       const nPoints = sampler.getNewPoints(500);
      //       total += nPoints.length;
      //       points = points.concat(nPoints);

      //       for(let j = 0; j < 450; j++){
      //         const rIndex = Math.floor(Math.random() * points.length);
      //         if(sampler.remove(points[rIndex])) {
      //           points.splice(rIndex, 1);
      //           total -= 1;
      //         }
      //       }
      //     }
      //   }

      //   const allPoints = sampler.getPoints(-1);

      //   sortPoints = (a, b) => {
      //     if(a[0] === b[0]) {
      //       return a[1] > b[1] ? -1 : 1;
      //     }
      //     return a[0] > b[0] ? -1 : 1;
      //   };
      //   const sortedPoints = points.sort(sortPoints);
      //   const sortedAllPoints = allPoints.sort(sortPoints);

      //   // assert.equal(total, allPoints.length);
      //   for(let i = 0; i < total; i++) {
      //     if(sortedPoints[i][0] !== sortedAllPoints[i][0] || sortedPoints[i][1] !== sortedAllPoints[i][1]) {
      //       for(let j = -5; j < 5; j++) {
      //         console.log(sortedPoints[i+j], sortedAllPoints[i+j]);
      //       }
      //     }
      //     assert.deepEqual(sortedPoints[i], sortedAllPoints[i]);
      //   }

      //   console.log('did it', total, allPoints.length);
      // }
    }
  },
};
