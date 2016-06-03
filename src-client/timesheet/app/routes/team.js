import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var team,
            self = this;

        return Ember.RSVP.hash({
            team:
                this.store.findAll('employee')
                .then(function(){
                    return self.store.findAll('user');
                })
                .then(function(){
                    return self.store.findRecord('team', params.team_id);
                })
                .then(_team => {
                    team = _team;
                    return self.store.findRecord('calendar', 1);
                })
                .then(defaultCalendar => {
                    var calendars;
                    if(team.get('is_general_calendar_enabled')){
                        calendars = [defaultCalendar.get('calendar'), team.get('calendar')];

                    }
                    else{
                        calendars = [team.get('calendar')];
                    }

                    team.set('calendars', calendars);

                    team.set(
                        'employees',
                        team.get('employees')
                         ///* TODO: remove filter */
                         //   .filter(employee => employee.id == 153)
                            .map(employee => {
                                var _calendars = calendars.slice(0);
                                _calendars.push(employee.get('calendar'));
                                employee.set('calendars', _calendars);
                                return employee;
                            })
                    );

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
