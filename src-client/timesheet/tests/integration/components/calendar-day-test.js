import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-day', 'Integration | Component | calendar day', {
    integration: true
});

import strip from "../../helpers/strip";
import moment from "moment";

test('it renders', function (assert) {
    this.render(hbs`
01
    `);

    var expected = strip(this.$().text());

    this.set('localEvents', []);
    this.set('date', moment().date(1).month(1));
    this.set('month', 1);
    this.render(hbs`{{calendar-day date=date isHoliday=false localEvents=day.localEvents month=month isChecked=false showNumbers=true sectionId=0}}`);

    assert.equal(strip(this.$().text()), expected);
});
