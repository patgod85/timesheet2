import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const routerStub = Ember.Service.extend({
    currentPath: 'user',
    url: '/users/1'
});

import strip from "../../helpers/strip";

moduleForComponent('bread-crumbs', 'Integration | Component | bread crumbs', {
    integration: true,
    beforeEach: function () {
        this.register('service:router', routerStub);
        this.inject.service('router', {as: 'router'});
    }
});

test('it renders', function (assert) {

    this.render(hbs`{{bread-crumbs}}`);

    var expected = 'Home>users>user(1)';

    assert.equal(strip(this.$().text()), expected);

    // Template block usage:" + EOL +
    this.render(hbs`
    {{#bread-crumbs}}
      template block text
    {{/bread-crumbs}}
  `);

    assert.equal(strip(this.$().text()), expected);
});
