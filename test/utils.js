const {assert} = require('chai');
const distanceFrom = require('../utils').distanceFrom;

const distanceTest = (x1, y1, x2, y2, expected) => {
  const actual = distanceFrom(x1, y1, x2, y2);
  assert.equal(actual, expected);
};

const testCases = [
  {x1: 0, y1: 0, x2: 1, y2: 0, expected: 1},
  {x1: 0, y1: 0, x2: 0, y2: 1, expected: 1},
  {x1: -1, y1: 0, x2: 0, y2: 0, expected: 1},
  {x1: 0, y1: -1, x2: 0, y2: 1, expected: 2},
  {x1: 0, y1: 100, x2: 0, y2: 0, expected: 100},
  {x1: 100, y1: 100, x2: 100, y2: 0, expected: 100},
];

const tests = {DistanceFrom:{}};

testCases.forEach((tc, i) => {
  tests.DistanceFrom[`distance from ${tc.x1},${tc.y1} to ${tc.x2},${tc.y2} should be ${tc.expected}`] = () => {
    distanceTest(tc.x1, tc.y1, tc.x2, tc.y2, tc.expected);
  };
});

module.exports = tests;
