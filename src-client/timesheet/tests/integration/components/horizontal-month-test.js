import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import strip from "../../helpers/strip";

moduleForComponent('horizontal-month', 'Integration | Component | horizontal month', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{horizontal-month}}`);

    assert.equal(this.$().text().trim(), '');

    this.set('month', 3);
    this.set('year', 2016);
    this.set('showNumbers', true);
    this.set('checkedDates', []);
    this.set('model', Ember.Object.create({events: {events: {}, diapasons: [], holidays: []}}));

    this.render(hbs`{{horizontal-month month=month year=year showNumbers=showNumbers model=model isHeader=true checkedDates=checkedDates sectionId='none'}}`);

    const expected = '01Fr02Sa03Su04Mo05Tu06We07Th08Fr09Sa10Su11Mo12Tu13We14Th15Fr16Sa17Su18Mo19Tu20We21Th22Fr23Sa24Su25Mo26Tu27We28Th29Fr30Sa';
    assert.equal(strip(this.$().text()), expected);
});
