import Ember from 'ember';

export default Ember.Route.extend({
    crcService: Ember.inject.service('crc'),

    model() {
        var team = this.modelFor("team").team,
            self = this;
        var crcService = this.get('crcService');

        return Ember.RSVP.hash({
            team:
                this.store.findAll('employee')
                    .then(function() {
                        return self.store.findRecord('calendar', 1);
                    })
                    .then(defaultCalendar => {
                        var calendars;
                        var crc = '';
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

                                    var crc2 = crcService.crc32(employee.get('calendar'));
                                    crc += '-' + crc2;

                                    employee.set('crc', crc2);
                                    return employee;
                                })
                        );

                        team.set('employeesCalendarsCrc', crc);

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


