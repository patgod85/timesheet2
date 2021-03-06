import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-user-form', 'Integration | Component | new user form', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    this.render(hbs`
templateblocktextCreateTeam:Email:Password:Name:Surname:Roles:ROLE_USER
  `);

    var expected = strip(this.$().text());

    this.set('user', {teamId: 1});


    // Template block usage:
    this.render(hbs`
    {{#new-user-form user=user}}
      template block text
    {{/new-user-form}}
  `);

    assert.equal(strip(this.$().text()), expected);
});
