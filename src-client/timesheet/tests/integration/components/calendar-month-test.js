import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-month', 'Integration | Component | calendar month', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
March2016MoTuWeThFrSaSu291011021031041051061071081091101111121131141151161171181191201211221231241251261271281291301311011021031
    `);

    var expected = strip(this.$().text());
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    this.set('month', 3);
    this.set('year', 2016);
    this.set('model', {events: {events: {}, diapasons: [], holidays: []}});
    this.render(hbs`{{calendar-month month=month year=year checkedDates=[] model=model nonWorkingOnly=false sectionId=0}}`);

    assert.equal(strip(this.$().text()), expected);

    // Template block usage:" + EOL +
    //this.render(hbs`
    //{{#calendar-month}}
    //  template block text
    //{{/calendar-month}}
  //`);

    //assert.equal(this.$().text().trim(), 'template block text');
});
