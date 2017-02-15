import Ember from 'ember';

import CalendarWithActions from './calendar-with-actions';

export default Ember.Component.extend(CalendarWithActions, {
    ical: Ember.inject.service('ical'),

    teamWithEvents: null,

    monthSections: null,

    crc: null,

    emptyArray: [],

    init() {
        this._super(...arguments);

        this.set('monthSections', Ember.A([]));

        this.initMonthSections();
    },

    initMonthSections(){

        const ical = this.get('ical');
        let monthSections = this.get('monthSections');
        monthSections.clear();

        const year = this.get('year');
        const month = this.get('month');
        let team = this.get('team');
        let employees = team.get('employees');

        team.set('events', ical.getEventsIndex(team.calendars, year));

        this.set('crc', []);
        let crc = this.get('crc');

        let sectionId = 1;
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
        const ical = this.get('ical');
        const crc = this.get('crc');

        const year = this.get('year');
        const team = this.get('team');
        const employees = team.get('employees');

        const monthSections = this.get('monthSections');

        employees.forEach(employee => {

            const found = monthSections.findBy('employee_id', employee.id);
            const foundCrc = crc.findBy('employee_id', employee.id);

            if(found && foundCrc){
                let model = found.get('model');

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

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let index = 0;

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

            const changeMonthAction = this.get('changeMonthAction');
            changeMonthAction(selected.id, this.get('month'));
        },

        changeMonth(selected){

            const changeMonthAction = this.get('changeMonthAction');
            changeMonthAction(this.get('year'), selected.id + 1);
        }
    },

    selectedMonth: Ember.computed('month', function () {
        const number = parseInt(this.get('month'), 10);
        return number - 1;
    }),

    selectedYear: Ember.computed('year', function () {
        return parseInt(this.get('year'), 10);
    }),
});

