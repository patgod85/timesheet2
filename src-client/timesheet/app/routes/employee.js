import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var employee,
            generalCalendar,
            self = this;

        return Ember.RSVP.hash({
            employee: this.store.findRecord('employee', params.employee_id)
            .then(_employee => {
                employee = _employee;
                return self.store.findRecord('calendar', 1);
            })
            .then(_generalCalendar => {
                generalCalendar = _generalCalendar;
//console.log(employee.team_id);
                return self.store.findRecord('team', employee.get('team_id'));
            })
            .then(team => {
                var calendars = [team.get('calendar'), employee.get('calendar')];
                if(team.get('is_general_calendar_enabled')){
                    calendars.unshift(generalCalendar.get('calendar'));
                }
                employee.set('calendars', calendars);
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
