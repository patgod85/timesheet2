import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:datephp', 'Unit | Transform | datephp', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
});

test('the serializer work correctly', function (assert) {
    var dateString = '2012-03-08';
    let transform = this.subject();
    var result = transform.serialize(new Date(dateString));
    assert.equal(result, dateString);
});

test('the deserializer work correctly', function (assert) {
    var dateString = '2012-03-08';
    let transform = this.subject();
    var result = transform.deserialize(dateString);
    assert.equal(result.toString(), (new Date(dateString)).toString());
});
