import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var team,
            self = this;

        return Ember.RSVP.hash({
            team: this.store.findRecord('team', params.team_id)
                .then(_team => {
                    team = _team;
                    return self.store.findRecord('calendar', 1);
                })
                .then(defaultCalendar => {
                    team.set('calendars', [defaultCalendar.get('calendar'), team.get('calendar')]);
                    return team;
                }),
            events: this.store.findAll('event')
        });
    },

    actions: {
        refresh(){
            this.refresh();
        }
    }
});
