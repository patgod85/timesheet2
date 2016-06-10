import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.modelFor("employee");
    },

    actions: {
        submit(model){
            model.save();
        }
    }
});

