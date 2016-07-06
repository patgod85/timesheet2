import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('filtered-list', 'Integration | Component | filtered list', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders a table', function (assert) {

    this.render(hbs`
<label>Filter:</label>
<select>
    <option value="all">All</option>
    <option value="1">F1</option>
    <option value="2">F2</option>
</select>
<table>
<thead>
    <tr>
    <th>Header1</th>
    <th>Header2</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>Anna</td>
        <td>Lee</td>
    </tr>
</tbody>
</table>
  `);

    var expected = strip(this.$().text());

    this.set('headers', ['Header1', 'Header2']);
    this.set('filter', [{id: 1, title: 'F1'}, {id: 2, title: 'F2'}]);

    this.set('list', [
        Ember.Object.extend({
            name: Ember.computed(() => 'Anna'),
            surname: Ember.computed(() => 'Lee'),
            teamId: Ember.computed(() => 1)
        }).create(),
        Ember.Object.extend({
            name: Ember.computed(() => 'Derek'),
            surname: Ember.computed(() => 'Blue'),
            teamId: Ember.computed(() => 2)
        }).create()
    ]);

    this.render(hbs`
    {{#filtered-list items=list headers=headers filter=filter id="team_id" as |item|}}
    <tr>
        <td>{{item.name}}</td>
        <td>{{item.surname}}</td>
    </tr>
    {{/filtered-list}}
  `);

    this.$('select').val(1);
    this.$('select').change();

    assert.equal(strip(this.$().text()), expected);
});
