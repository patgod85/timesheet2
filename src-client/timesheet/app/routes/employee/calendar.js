import Ember from 'ember';

export default Ember.Route.extend({

    calendarService: Ember.inject.service('calendar'),

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
                    var calendarService = self.get('calendarService');

                    return calendarService.setupEmployee(employee, team, generalCalendar);
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

