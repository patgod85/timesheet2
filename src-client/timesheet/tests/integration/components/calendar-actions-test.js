import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-actions', 'Integration | Component | calendar actions', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    this.render(hbs`
templateblocktextWorkingdaysDayvalueShiftsNonworkingdaysActions-Weekend-PublicholidayUnpickdates⊗CleardataCheckeddates:
    `);

    var expected = strip(this.$().text());

    // Template block usage:
    this.render(hbs`
{{#calendar-actions}}
  template block text
{{/calendar-actions}}
    `);

    assert.equal(strip(this.$().text()), expected);
});
