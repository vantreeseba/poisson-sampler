const {assert} = require('chai');
const Sampler = require('../RandomSampler');
const distanceFrom = require('../utils').distanceFrom;

module.exports = {
  RandomSampler: {
    'Should return some points': () => {
      const sampler = new Sampler();
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'Should not die when huge': () => {
      const sampler = new Sampler({h: 47000, w:47000, r: 1000});

      console.log(sampler.gridHeight);
      const points = sampler.getPoints();
      console.log(points.length);

      assert.isAtLeast(points.length, 1);
    },
    'Should return some points with any params': () => {
      const sampler = new Sampler({});
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'Should return some points with negative x,y': () => {
      const sampler = new Sampler({x:-64, y:-64});
      const points = sampler.getPoints();

      assert.isAtLeast(points.length, 1);
    },
    'All points should be at least R distance apart.': () => {
      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      const points = sampler.getPoints();
      let allGood = true;

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            if (distanceFrom(p.x, p.y, p2.x, p2.y) < r) {
              allGood = false;
            }
          }
        });
      });


      assert.isTrue(allGood);
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
      let allGood = true;

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            if (distanceFrom(p.x, p.y, p2.x, p2.y) < r) {
              allGood = false;
            }
          }
        });
      });


      assert.isTrue(allGood);
      assert.isAtLeast(points.length, 20);
    },
    'Prepopulate should seed the sampler with existing points': () => {
      const prepoints = [{x:1, y:1}];

      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      sampler.prePopulate(prepoints);
      const points = sampler.getPoints();
      let allGood = true;

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            if (distanceFrom(p.x, p.y, p2.x, p2.y) < r) {
              allGood = false;
            }
          }
        });
      });

      assert.isTrue(allGood);
      assert.isAtLeast(points.length, 20);
      assert.isOk(points.find(p => p[0] === prepoints[0].x && p[1] === prepoints[0].y));
    },
    'Prepopulate should reject points outside the sampler': () => {
      const prepoints = [{x:-1, y:-1}];

      const r = 100;
      const sampler = new Sampler({h: 800, w: 800, r});
      sampler.prePopulate(prepoints);
      const points = sampler.getPoints();
      let allGood = true;

      points.forEach(p => {
        points.forEach(p2 => {
          if(p !== p2) {
            if (distanceFrom(p.x, p.y, p2.x, p2.y) < r) {
              allGood = false;
            }
          }
        });
      });

      assert.isTrue(allGood);
      assert.isAtLeast(points.length, 20);
      assert.isUndefined(points.find(p => p[0] === prepoints[0].x && p[1] === prepoints[0].y));
    }

  },
};
