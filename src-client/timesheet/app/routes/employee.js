import Ember from 'ember';

export default Ember.Route.extend({

    beforeModel() {
        this.transitionTo('employee.calendar.index');
    },

    model(params) {

        return Ember.RSVP.hash({
            employee: this.store.findRecord('employee', params.employee_id),
            tabs: [
                {route: 'employee.calendar.index', title: 'Calendar', id: params.employee_id},
                {route: 'employee.calendar.report', title: 'Report', id: params.employee_id},
                {route: 'employee.details', title: 'Details', id: params.employee_id}
            ]
        });
    }
});
