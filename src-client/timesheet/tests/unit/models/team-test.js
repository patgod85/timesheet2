import { moduleForModel, test } from 'ember-qunit';
import Ember from "ember";

moduleForModel('team', 'Unit | Model | team', {
    // Specify the other units that are required for this test.
    needs: ['model:user']
});

test('should own a profile', function (assert) {
    const User = this.store().modelFor('user');
    const relationship = Ember.get(User, 'relationshipsByName').get('team');

    assert.equal(relationship.key, 'team', 'has relationship with profile');
    assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is belongsTo');
});

test('it exists', function (assert) {
    let model = this.subject();
    assert.ok(!!model);
});
