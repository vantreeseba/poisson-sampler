const {assert} = require('chai');
const Sampler = require('../index');

const distanceFrom = (x1, y1, x2, y2, limit) => {
  let x = Math.abs(x1 - x2);
  if (x > limit / 2) {
    x = limit - x;
  }

  let y = Math.abs(y1 - y2);
  if (y > limit / 2) {
    y = limit - y;
  }

  return Math.sqrt((x * x) + (y * y));
};


const test = {
  sampler: {
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

  },
};

module.exports = test;
