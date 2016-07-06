import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        var team = this.modelFor("team").team,
            self = this;

        return Ember.RSVP.hash({
            team:
                self.store.findRecord('calendar', 1)
                    .then(defaultCalendar => {
                        var calendars;
                        if(team.get('isGeneralCalendarEnabled')){
                            calendars = [defaultCalendar.get('calendar'), team.get('calendar')];

                        }
                        else{
                            calendars = [team.get('calendar')];
                        }

                        team.set('calendars', calendars);

                        return team;
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

