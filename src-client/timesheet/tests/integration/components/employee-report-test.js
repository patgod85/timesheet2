import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('employee-report', 'Integration | Component | employee report', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
templateblocktextReportfromtoGetreport
<ul>
    <li>Working days: 0;</li>
    <li>Nonworking days: 0;</li>
    <li>Otguls: 0;</li>
</ul>
    `);

    var expected = strip(this.$().text());

    // Template block usage:
    this.render(hbs`
    {{#employee-report}}
      template block text
    {{/employee-report}}
  `);

    assert.equal(strip(this.$().text()), expected);
});
