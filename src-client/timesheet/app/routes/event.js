import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store
            .findRecord('event', params.event_id);
    },
    actions: {
        submit(model){
            model.save();
        }
    }
});
