import Ember from 'ember';


import CalendarWithActions from './calendar-with-actions';

export default Ember.Component.extend(CalendarWithActions, {

    ical: Ember.inject.service('ical'),

    year: 0,

    monthSections: Ember.computed('model.calendars', 'year', 'month', function(){


        const year = parseInt(this.get('year'), 10);
        const monthSections = Ember.A([]);
        const ical = this.get('ical');
        const month = parseInt(this.get('month'), 10) - 1;

        let model = this.get('model');

        model.set('events', ical.getEventsIndex(model.calendars, year));

        monthSections.pushObjects([
            Ember.Object.create({
                sectionId: 0,
                month: month,
                days: [],
                model,
                year
            }),
            Ember.Object.create({
                sectionId: 1,
                month: month + 1,
                days: [],
                model,
                year
            }),
            Ember.Object.create({
                sectionId: 2,
                month: month + 2,
                days: [],
                model,
                year
            })
        ]);
        // monthSections.map(section => {
        //     section.set('model', model);
        // });
        return monthSections;
    }),

    selectedMonth: Ember.computed('month', function () {
        const number = parseInt(this.get('month'), 10);
        return number - 1;
    }),

    selectedYear: Ember.computed('year', function () {
        return parseInt(this.get('year'), 10);
    }),

    months: Ember.computed(function(){

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        function getName(i){
            if(i === -1){
                return monthNames[11];
            }
            if(i === 12){
                return monthNames[0];
            }
            return monthNames[i];
        }

        let months = [];

        for(let i = 0; i < 12; i++){
            months.push({
                id: i,
                title: getName(i-1) + ' - ' + getName(i) + ' - ' + getName(i+1)
            });
        }

        return months;
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
    }
});
