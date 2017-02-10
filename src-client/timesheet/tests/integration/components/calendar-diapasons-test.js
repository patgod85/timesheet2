import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('calendar-diapasons', 'Integration | Component | calendar diapasons', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
HideDiapasons12016-02-02—2016-02-28RemoveNewMockedeventAddnewdiapason
    `);

    const expected = strip(this.$().text());

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('event_types', [
        Ember.Object.extend({
            id: 2,
            name: Ember.computed(() => 'Mocked event'),
        }).create()
    ]);
    this.set('diapasons', [{begin:'2016-02-02', end: '2016-02-28', summary: {d: 11}}]);
    this.set('hidden', false);

    this.render(hbs`{{calendar-diapasons event_types=event_types diapasons=diapasons hidden=hidden}}`);
    assert.equal(strip(this.$().text()), expected);

});
