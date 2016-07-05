import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('team-month', 'Integration | Component | team month', {
    integration: true
});

import strip from "../../helpers/strip";

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('team', Ember.Object.create({employees: [], events: {events: {}, diapasons: [], holidays: []}}));
    this.render(hbs`{{team-month year=2016 team=team showButtons=false event_types=[] showActions=true}}`);

    var expected = '20142015201620172018JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember01Fr02Sa03Su04Mo05Tu06We07Th08Fr09Sa10Su11Mo12Tu13We14Th15Fr16Sa17Su18Mo19Tu20We21Th22Fr23Sa24Su25Mo26Tu27We28Th29Fr30Sa31SuWorkingdaysDayvalueShiftsNonworkingdaysActionsApplyExample:1.251-Shift12-Shift23-Shift3-Weekend-PublicholidayUnpickdates⊗CleardataCheckeddates:';
    assert.equal(strip(this.$().text()), expected);

    this.render(hbs`{{team-month year=2016 team=team showButtons=false event_types=[] showActions=false}}`);

    expected = '20142015201620172018JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember01Fr02Sa03Su04Mo05Tu06We07Th08Fr09Sa10Su11Mo12Tu13We14Th15Fr16Sa17Su18Mo19Tu20We21Th22Fr23Sa24Su25Mo26Tu27We28Th29Fr30Sa31Su';
    assert.equal(strip(this.$().text()), expected);
});
