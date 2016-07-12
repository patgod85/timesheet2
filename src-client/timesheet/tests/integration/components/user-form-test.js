import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-form', 'Integration | Component | user form', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    this.render(hbs`
SaveName:Surname:Roles:ROLE_ADMINDeleteROLE_PAVLINDeleteAddnewroleEnabled:DisabledEnabledDeleteusertemplateblocktext
`);

    var expected = strip(this.$().text());

    this.set('user', {teamId: 1, name: "Mega", email: "qwe@qwe.qwe", roles: ['ROLE_ADMIN', 'ROLE_PAVLIN']});

    // Template block usage:
    this.render(hbs`
{{#user-form user=user}}
    template block text
{{/user-form}}
  `);

    assert.equal(strip(this.$().text()), expected);
});

