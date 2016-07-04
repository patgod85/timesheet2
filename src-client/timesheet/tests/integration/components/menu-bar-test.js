import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-bar', 'Integration | Component | menu bar', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    this.render(hbs`
<ul>
    <li>Timesheetv2(current)</li>
    <li>My schedule</li>
    <li>Employees</li>
</ul>
<p>You are logged in as Vilenkin <a href="">logout</a></p>
    `);

    var expected = strip(this.$().text());

    this.set(
        'user',
        {
            username: 'Vilenkin',
            menuItems: [
                {route: 'my', title: 'My schedule'},
                {route: 'employees', title: 'Employees'}
            ]
        }
    );
    this.render(hbs`{{menu-bar user=user}}`);

    assert.equal(strip(this.$().text()), expected);

});
