import Ember from 'ember';

export default Ember.Route.extend({

    calendarService: Ember.inject.service('calendar'),

    model() {
        const parentModel = this.modelFor("employee"),
            employee = parentModel.employee;

        let generalCalendar;
        const self = this;

        return Ember.RSVP.hash({
            employee: self.store.findRecord('calendar', 1)
                .then(_generalCalendar => {
                    generalCalendar = _generalCalendar;
                    return self.store.findRecord('team', employee.get('teamId'));
                })
                .then(team => {
                    const calendarService = self.get('calendarService');

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

