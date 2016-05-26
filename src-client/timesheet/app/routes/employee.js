import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var employee,
            self = this;

        return Ember.RSVP.hash({
            employee: this.store.findRecord('employee', params.employee_id)
            .then(_employee => {
                employee = _employee;
                return self.store.findRecord('calendar', 1);
            })
            .then(defaultCalendar => {
                employee.set('calendars', [defaultCalendar.get('calendar'), employee.get('calendar')]);
                return employee;
            }),
            events: this.store.findAll('event')
        });
    },
    actions: {
        submit(model){
            model.save();
        },

        refresh(){
            this.refresh();
        }
    }
});
