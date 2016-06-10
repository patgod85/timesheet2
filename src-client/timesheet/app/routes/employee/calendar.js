import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        var parentModel = this.modelFor("employee"),
            employee = parentModel.employee;

        var generalCalendar,
            self = this;

        return Ember.RSVP.hash({
            employee: self.store.findRecord('calendar', 1)
                .then(_generalCalendar => {
                    generalCalendar = _generalCalendar;
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
            events: this.store.peekAll('event')
        });
    },

    actions: {
        submit(model){
            model.save();
        }
    }
});

