import { isEqual } from '../../../helpers/is-equal';
import { module, test } from 'qunit';

module('Unit | Helper | is equal');

// Replace this with your real tests.
test('works with equals', function (assert) {
    let result = isEqual([42, 42]);
    assert.equal(result, true);
});

test('works with non equals', function (assert) {
    let result = isEqual([41, 42]);
    assert.equal(result, false);
});
