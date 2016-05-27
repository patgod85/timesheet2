//noinspection JSFileReferences
import { json } from '../../../helpers/json';
import { module, test } from 'qunit';

module('Unit | Helper | json');

// Replace this with your real tests.
test('it works', function (assert) {

    var a = {a: 1};
    let result = json(a);
    assert.equal(result, JSON.stringify(a));
});
