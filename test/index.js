const {assert} = require('chai');
const index = require('../index');

module.exports = {
  index: {
    'Should expose sampler and MultiSampler': () => {
      assert.isOk(index.Sampler);
      assert.isOk(index.MultiSampler);
    },
  },
};
