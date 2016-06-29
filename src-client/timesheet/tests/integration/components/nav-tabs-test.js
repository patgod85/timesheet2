import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const routerStub = Ember.Service.extend({
    currentPath: 'user',
    url: '/users/1'
});

moduleForComponent('nav-tabs', 'Integration | Component | nav tabs', {
    integration: true,
    beforeEach: function () {
        this.register('service:router', routerStub);
        this.inject.service('router', {as: 'router'});
    }
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    this.render(hbs`
Calendar
`);
    var expected = strip(this.$().text());

    this.set('tabs', [
        {route: 'employee.calendar.index', title: 'Calendar', id: 1}
    ]);
    this.render(hbs`{{nav-tabs tabs=tabs currentPath='employee.calendar'}}`);

    assert.equal(strip(this.$().text().trim()), expected);

});
