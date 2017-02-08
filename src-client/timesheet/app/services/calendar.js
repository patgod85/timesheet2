
import Ember from 'ember';

export default Ember.Service.extend({

    crcService: Ember.inject.service('crc'),

    setupTeam(team, generalCalendar){
        let calendars;
        let crc = '';
        const crcService = this.get('crcService');

        if (team.get('isGeneralCalendarEnabled')) {
            calendars = [generalCalendar.get('calendar'), team.get('calendar')];
        }
        else {
            calendars = [team.get('calendar')];
        }

        team.set('calendars', calendars);

        team.set(
            'employees',
            team.get('employees')
                ///* TODO: remove filter */
                //   .filter(employee => employee.id == 153)
                .map(employee => {
                    let _calendars = calendars.slice(0);
                    _calendars.push(employee.get('calendar'));
                    employee.set('calendars', _calendars);

                    let crc2 = crcService.crc32(employee.get('calendar'));
                    crc += '-' + crc2;

                    employee.set('crc', crc2);
                    return employee;
                })
        );

        team.set('employeesCalendarsCrc', crc);

        return team;
    },

    setupEmployee(employee, team, generalCalendar){

        let calendars = [team.get('calendar'), employee.get('calendar')];
        if(team.get('isGeneralCalendarEnabled')){
            calendars.unshift(generalCalendar.get('calendar'));
        }
        employee.set('calendars', calendars);
        return employee;
    }
});
