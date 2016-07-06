import Ember from 'ember';
import Auth from './auth';

export default Auth.extend({
    calendarService: Ember.inject.service('calendar'),

    model() {
        var team,
            self = this,
            user = this.modelFor('application').user;

        return Ember.RSVP.hash({
            team: this.store.findRecord('team', user.teamId)
                .then((_team) => {
                    team = _team;
                    return this.store.findAll('employee');
                })
                .then(function() {
                    return self.store.findRecord('calendar', 1);
                })
                .then(defaultCalendar => {
                    var calendarService = self.get('calendarService');
                    return calendarService.setupTeam(team, defaultCalendar);
                }),
            events: []
        });
    }
});

