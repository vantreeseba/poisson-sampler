const {assert} = require('chai');
const Sampler = require('../Sampler');
const distanceFrom = require('../utils').distanceFrom;

module.exports = {
  Sampler: {
    'Should return some points': () => {
      const sampler = new Sampler();
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'Should not die when huge': () => {
      const sampler = new Sampler({h: 47000, w:47000, r: 1000});
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'Should return some points with any params': () => {
      const sampler = new Sampler({});
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'Should return num of points requested': () => {
      const sampler = new Sampler({});
      const points = sampler.getPoints(4);

      assert.equal(points.length, 4);
    },

    'Should return some points with negative x,y': () => {
      const sampler = new Sampler({x:-64, y:-64});
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'All points should be at least R distance from extents.': () => {
      const r = 64;
      const h = 512;
      const w = 512;
      const sampler = new Sampler({h, w, r, x:0, y:0});
      sampler.rng.init_seed(Math.random() * 5000);
      const points = sampler.getPoints(500);
      let allGood = true;

      const cc = sampler.radius/2;

      points.forEach(p => {
        if (p[0] < cc) {
          allGood = false;
        }
        if (p[1] < cc) {
          allGood = false;
        }
        if (p[0] > w - cc) {
          allGood = false;
        }
        if (p[1] > h - cc) {
          allGood = false;
        }
      });


      assert.isTrue(allGood);
      assert.isAtLeast(points.length, 20);
    },


    'All points should be at least R distance apart.': () => {
      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      const points = sampler.getPoints();

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            assert.isAtLeast(distanceFrom(p[0], p[1], p2[0], p2[1]), r -1);
          }
        });
      });


      // assert.isTrue(allGood);
      assert.isAtLeast(points.length, 20);
    },

    'After remove, all points should be at least R distance apart.': () => {
      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      const points = sampler.getPoints();

      points.forEach((x, i) => {
        if(i % 3 === 0){
          sampler.remove(x[0], x[1]);
        }
      });

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            assert.isAtLeast(distanceFrom(p[0], p[1], p2[0], p2[1]), r -1);
          }
        });
      });

      assert.isAtLeast(points.length, 20);
    },
    'Prepopulate should seed the sampler with existing points': () => {
      const prepoints = [{x:1, y:1}];

      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      sampler.prePopulate(prepoints);
      const points = sampler.getPoints();

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            assert.isAtLeast(distanceFrom(p[0], p[1], p2[0], p2[1]), r -1 );
          }
        });
      });

      assert.isAtLeast(points.length, 20);
      assert.isOk(points.find(p => p[0] === prepoints[0].x && p[1] === prepoints[0].y));
    },
    'Prepopulate should reject points outside the sampler': () => {
      const prepoints = [{x:-1, y:-1}];

      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      sampler.prePopulate(prepoints);
      const points = sampler.getPoints();

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            assert.isAtLeast(distanceFrom(p[0], p[1], p2[0], p2[1]), r - 1);
          }
        });
      });

      assert.isAtLeast(points.length, 20);
      assert.isUndefined(points.find(p => p[0] === prepoints[0].x && p[1] === prepoints[0].y));
    }

  },
};
