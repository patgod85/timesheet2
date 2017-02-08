import Ember from 'ember';

import moment from 'moment';

import CalendarWithActions from './calendar-with-actions';

export default Ember.Component.extend(CalendarWithActions, {

    ical: Ember.inject.service('ical'),

    year: 0,

    init() {
        this._super(...arguments);

        this.set('monthSections', []);

        this.initMonthSections();
    },

    yearMonthObserver: Ember.observer('year', 'month', function() {
        this.initMonthSections();
    }),

    initMonthSections(){


        const year = parseInt(this.get('year'), 10);
        const month = parseInt(this.get('month'), 10) - 1;

        this.set('monthSections', []);
        let monthSections = this.get('monthSections');
        const ical = this.get('ical');

        let model = this.get('model');

        model.set('events', ical.getEventsIndex(model.calendars, year));

        monthSections.pushObjects([
            Ember.Object.create({
                sectionId: 0,
                month: month,
                days: [],
                model
            }),
            Ember.Object.create({
                sectionId: 1,
                month: month + 1,
                days: [],
                model
            }),
            Ember.Object.create({
                sectionId: 2,
                month: month + 2,
                days: [],
                model
            })
        ]);

    },

    calendarObserver: Ember.observer('model.calendars', function(){
        const year = this.get('year');
        const monthSections = this.get('monthSections');
        const ical = this.get('ical');

        let model = this.get('model');

        model.set('events', ical.getEventsIndex(model.calendars, year));

        monthSections.map(section => {
            section.set('model', model);
        });
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


    newType: 11,
    newBegin: null,
    newEnd: null,

    eventTypesNames: Ember.computed('event_types', function(){
        return this.get('event_types').map(t => {return {id: parseInt(t.id, 10), title: t.get('name')}; });
    }),

    actions: {

        changeYear(selected){

            const changeMonthAction = this.get('changeMonthAction');
            changeMonthAction(selected.id, this.get('month'));
        },

        changeMonth(selected){

            const changeMonthAction = this.get('changeMonthAction');
            changeMonthAction(this.get('year'), selected.id + 1);
        },

        removeDiapason(diapasonBegin, diapasonEnd){
            if(confirm('Are you sure?')){
                const removeDiapasonAction = this.get('removeDiapasonAction');

                if(typeof removeDiapasonAction === 'function'){
                    removeDiapasonAction(diapasonBegin, diapasonEnd);
                }
            }
        },

        changeNewType(id){
            this.set('newType', id);
        },

        addDiapason(){
            if(confirm('Are you sure?')){
                const addDiapasonAction = this.get('addDiapasonAction');

                if(typeof addDiapasonAction === 'function'){
                    addDiapasonAction(moment(this.get('newBegin')).format('YYYY-MM-DD'), moment(this.get('newEnd')).format('YYYY-MM-DD'), this.get('newType'));
                }
            }
        },
    }
});
