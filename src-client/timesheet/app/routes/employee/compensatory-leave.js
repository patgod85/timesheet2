import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        // let employee = this.modelFor("employee").employee;
        const self = this;

        return Ember.RSVP.hash({
            leave:
                self.store.findRecord('compensatory-leave', params.id)
        });
    },
});
