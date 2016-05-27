import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-month', 'Integration | Component | calendar month', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
March2016MoTuWeThFrSaSu2901020304050607080910111213141516171819202122232425262728293031010203
    `);

    var expected = strip(this.$().text());
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    this.set('events', {events: {}, diapasons: [], holidays: []});
    this.render(hbs`{{calendar-month y=2016 m=3 events=events}}`);

    assert.equal(strip(this.$().text()), expected);

    // Template block usage:" + EOL +
    //this.render(hbs`
    //{{#calendar-month}}
    //  template block text
    //{{/calendar-month}}
  //`);

    //assert.equal(this.$().text().trim(), 'template block text');
});
