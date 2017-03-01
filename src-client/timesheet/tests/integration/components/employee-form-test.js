import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('employee-form', 'Integration | Component | employee form', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
templateblocktextSaveName:Surname:Position:Thefirstworkingday:Thelastworkingday:Deletetheemployee
    `);

    var expected = strip(this.$().text());

    this.set('employee', {teamId: 1, name: "Mega", surname: "manon", position: "fighter", workStart: new Date("2012-03-09")});

    // Template block usage:
    this.render(hbs`
{{#employee-form employee=employee}}
    template block text
{{/employee-form}}
   `);

    assert.equal(strip(this.$().text()), expected);
    assert.equal(strip(this.$('input')[0].value), 'Mega');
    assert.equal(strip(this.$('input')[1].value), 'manon');
    assert.equal(strip(this.$('input')[2].value), 'fighter');
    assert.equal(strip(this.$('input')[3].value), '2012-03-09');
    assert.equal(strip(this.$('input')[4].value), '');
});

