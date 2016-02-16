import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('drop-down', 'Integration | Component | drop down', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.render(hbs`
<select>
    <option value="1">
        One
    </option>
    <option value="2">
        Two
    </option>
</select>
`);
    var expected = strip(this.$().text());

    this.set('list', [{id: 1, title: 'One'}, {id: 2, title: 'Two'}]);

    this.render(hbs`{{drop-down content=list}}`);

    assert.equal(strip(this.$().text().trim()), expected);
});
