import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bread-crumbs', 'Integration | Component | bread crumbs', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{bread-crumbs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#bread-crumbs}}
      template block text
    {{/bread-crumbs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
