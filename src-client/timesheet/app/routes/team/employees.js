import Ember from 'ember';

export default Ember.Route.extend({
    calendarService: Ember.inject.service('calendar'),

    model() {
        var team = this.modelFor("team").team,
            self = this;

        return Ember.RSVP.hash({
            team:
                this.store.findAll('employee')
                    .then(function() {
                        return self.store.findRecord('calendar', 1);
                    })
                    .then(defaultCalendar => {
                        var calendarService = self.get('calendarService');

                        return calendarService.setupTeam(team, defaultCalendar);
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


