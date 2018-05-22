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
    'Should return some points with any params': () => {
      const sampler = new Sampler({});
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


  },
};
