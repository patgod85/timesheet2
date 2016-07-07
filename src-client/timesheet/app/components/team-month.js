import Ember from 'ember';
import moment from 'moment';

import CalendarWithActions from './calendar-with-actions';

export default Ember.Component.extend(CalendarWithActions, {
    ical: Ember.inject.service('ical'),

    year: moment().year(),
    month: moment().month(0).month(),
    teamWithEvents: null,

    crc: null,

    init() {
        this._super(...arguments);

        this.set('monthSections', []);

        this.initMonthSections();
    },

    initMonthSections(){

        var ical = this.get('ical');
        var monthSections = this.get('monthSections');
        monthSections.clear();

        var year = this.get('year');
        var month = this.get('month');
        var team = this.get('team');
        var employees = team.get('employees');

        team.set('events', ical.getEventsIndex(team.calendars, year));

        this.set('crc', []);
        var crc = this.get('crc');

        var sectionId = 1;
        employees.forEach(employee => {

            employee.set('events', ical.getEventsIndex(employee.calendars, year));

            crc.pushObject(
                Ember.Object.create({
                    employee_id: employee.id,
                    crc: employee.crc
                })
            );

            monthSections.pushObject(
                Ember.Object.create({
                    sectionId: sectionId++,
                    month,
                    days: [],
                    model: employee,
                    employee_id: employee.id
                })
            );
        });
    },

    calendarObserver: Ember.observer('team.employeesCalendarsCrc', function(){
        var ical = this.get('ical');
        var crc = this.get('crc');

        var year = this.get('year');
        var team = this.get('team');
        var employees = team.get('employees');

        var monthSections = this.get('monthSections');

        employees.forEach(employee => {

            var found = monthSections.findBy('employee_id', employee.id);
            var foundCrc = crc.findBy('employee_id', employee.id);

            if(found && foundCrc){
                var model = found.get('model');

                if(model.get('crc') !== foundCrc.get('crc')){
                    model.set('events', ical.getEventsIndex(employee.calendars, year));
                }
            }
        });
    }),

    observeMonthChange: Ember.observer('month', 'year', function(){
        this.initMonthSections();
    }),

    months: Ember.computed(function(){

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var index = 0;

        return monthNames.map(name => {
            return {id: index++, title: name};
        });
    }),

    years: Ember.computed(function(){
        return [
            {id: 2014, title: 2014},
            {id: 2015, title: 2015},
            {id: 2016, title: 2016},
            {id: 2017, title: 2017},
            {id: 2018, title: 2018}
        ];
    }),

    actions: {
        changeYear(selected){
            this.set('year', selected.id);
        },

        changeMonth(selected){
            this.set('month', selected.id);
        }
    }
});

