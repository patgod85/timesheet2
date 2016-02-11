import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-bar', 'Integration | Component | menu bar', {
    integration: true
});

function strip(str) {
    return str.replace(/\s/g, "");
}

test('it renders', function (assert) {

    this.render(hbs`
<ul>
    <li>Users</li>
    <li>About</li>
    <li>Contact us.</li>
</ul>
    `);

    var expected = strip(this.$().text());

    this.render(hbs`{{menu-bar}}`);

    assert.equal(strip(this.$().text()), expected);

    // Template block usage:" + EOL +
    this.render(hbs`
{{#menu-bar}}
    template block text
{{/menu-bar}}
`);
    assert.equal(strip(this.$().text()), expected);
});
