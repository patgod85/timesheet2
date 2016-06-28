import Ember from 'ember';
import Auth from './auth';

export default Auth.extend({


    model(params) {

        return Ember.RSVP.hash({
            employee: this.store.findRecord('employee', params.employee_id),
            tabs: [
                {route: 'employee.calendar.index', title: 'Calendar', id: params.employee_id},
                {route: 'employee.calendar.report', title: 'Report', id: params.employee_id},
                {route: 'employee.details', title: 'Details', id: params.employee_id}
            ]
        });
    },

    actions: {
        refresh(){
            this.refresh();
        }
    }
});
