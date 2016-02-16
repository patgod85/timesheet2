import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('filtered-list', 'Integration | Component | filtered list', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{filtered-list}}`);

    assert.equal(this.$().text().trim(), 'Filter:');

});

test('it renders a table', function (assert) {

    this.render(hbs`
<label>Filter:</label>
<table>
<thead>
    <tr>
    <th>Header1</th>
    <th>Header2</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>One1</td>
        <td>Two1</td>
    </tr>
    <tr>
        <td>One2</td>
        <td>Two2</td>
    </tr>
</tbody>
</table>
  `);

    var expected = strip(this.$().text());

    this.set('headers', ['Header1', 'Header2']);
    this.set('list', [{prop1: 'One1', prop2: 'Two1'}, {prop1: "One2", prop2: 'Two2'}]);

    this.render(hbs`
    {{#filtered-list items=list headers=headers as |item|}}
    <tr>
        <td>{{item.prop1}}</td>
        <td>{{item.prop2}}</td>
    </tr>
    {{/filtered-list}}
  `);

    assert.equal(strip(this.$().text()), expected);
});
