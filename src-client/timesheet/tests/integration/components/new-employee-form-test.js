import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-employee-form', 'Integration | Component | new employee form', {
  integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    this.render(hbs`
CreateTeam:Name:Surname:Position:Thefirstworkingday:Thelastworkingday:
  `);

    var expected = strip(this.$().text());

    this.set('user', {teamId: 1});


    // Template block usage:
    this.render(hbs`
    {{#new-employee-form user=user}}
      template block text
    {{/new-employee-form}}
  `);

    assert.equal(strip(this.$().text()), expected);
});

