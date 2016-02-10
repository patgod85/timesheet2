import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        click(model){
            console.log(model.get('name'), this.get('user').get('name'));

            model.save();
        }
    }
});
