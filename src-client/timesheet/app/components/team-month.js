import Ember from 'ember';
import moment from 'moment';

import CalendarWithActions from './calendar-with-actions';

export default CalendarWithActions.extend({
    year: moment().year(),
    month: moment().month(0).month(),

    init() {
        this._super(...arguments);

        var monthSections = this.get('monthSections');

        var month = this.get('month');
        var employees = this.get('team').get('employees');

        var sectionId = 0;
        employees.forEach(employee => {

            monthSections.pushObject(
                Ember.Object.create({
                    sectionId: sectionId++,
                    month,
                    days: [],
                    model: employee
                })
            );
        });

    },

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

