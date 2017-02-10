import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {

        onSave(model){
            model.save();
        }
    }
});
