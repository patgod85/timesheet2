import Ember from "ember";

export default Ember.Component.extend({
    content: null,
    selectedValue: null,

    didInitAttrs() {
        this._super(...arguments);
        var content = this.get('content');

        if (!content) {
            this.set('content', []);
        }
    },

    actions: {
        change() {
            const changeAction = this.get('onChange');
            const selectedEl = this.$('select')[0];
            const selectedIndex = selectedEl.selectedIndex;
            const content = this.get('content');
            const selectedValue = content[selectedIndex];
//console.log(this, this.get('action'), selectedIndex, content, selectedValue);
            this.set('selectedValue', selectedValue);
            changeAction(selectedValue);
        }
    }
});
