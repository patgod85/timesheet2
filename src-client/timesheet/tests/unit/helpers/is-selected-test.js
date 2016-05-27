//noinspection JSFileReferences
import { isSelected } from '../../../helpers/is-selected';
import { module, test } from 'qunit';

module('Unit | Helper | is selected');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = isSelected([{id: 1, title: 'breed'}, 1]);
  assert.ok(result);
});
