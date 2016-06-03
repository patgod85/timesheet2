import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('team-month', 'Integration | Component | team month', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{team-month}}`);

    assert.equal(strip(this.$().text()), '20142015201620172018JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember010203040506070809101112131415161718192021222324252627282930');
});
