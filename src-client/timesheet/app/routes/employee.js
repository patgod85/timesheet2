import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('employee', params.employee_id);
    },
    actions: {
        submit(model){
            model.save();
        }
    }
});
