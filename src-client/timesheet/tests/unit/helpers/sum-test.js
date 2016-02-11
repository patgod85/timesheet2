import { sum } from '../../../helpers/sum';
import { module, test } from 'qunit';

module('Unit | Helper | sum');

// Replace this with your real tests.
test('it works with array', function (assert) {
    let result = sum([42, 2]);
    assert.equal(result, 44);
});

test('it works single param', function (assert) {
    let result = sum(42);
    assert.equal(result, 42);
});
