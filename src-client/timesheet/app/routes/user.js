import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
//console.log(params);
        return this.store.findRecord('users', params.user_id);
    },
    actions: {
        submit(model){
            model.save();
        }
    }
});
