import Ember from 'ember';

export default Ember.Route.extend({


    model() {
        let team = this.modelFor("team").team;
        const self = this;

        return Ember.RSVP.hash({
            team:
                self.store.findRecord('calendar', 1)
                    .then(defaultCalendar => {
                        let calendars;
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

});

