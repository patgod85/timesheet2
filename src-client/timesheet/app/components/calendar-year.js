import Ember from 'ember';


import CalendarWithActions from './calendar-with-actions';

export default Ember.Component.extend(CalendarWithActions, {

    ical: Ember.inject.service('ical'),

    year: 0,

    init() {
        this._super(...arguments);

        this.set('monthSections', []);

        this.initMonthSections();
    },

    initMonthSections(){
        var year = this.get('year');
        this.set('year', year);
        this.set('monthSections', []);
        var monthSections = this.get('monthSections');
        var ical = this.get('ical');

        var model = this.get('model');

        model.set('events', ical.getEventsIndex(model.calendars, year));

        monthSections.pushObjects([
            Ember.Object.create({
                sectionId: 0,
                month: 1,
                days: [],
                model
            }),
            Ember.Object.create({
                sectionId: 1,
                month: 2,
                days: [],
                model
            }),
            Ember.Object.create({
                sectionId: 2,
                month: 3,
                days: [],
                model
            })
        ]);

    },

    calendarObserver: Ember.observer('model.calendars', function(){
        var year = this.get('year');
        var monthSections = this.get('monthSections');
        var ical = this.get('ical');

        var model = this.get('model');

        model.set('events', ical.getEventsIndex(model.calendars, year));

        monthSections.map(section => {
            section.set('model', model);
        });
    }),

    months: Ember.computed(function(){

        var monthNames = ["January", "February", "March", "April", "May", "June",
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

        var months = [];

        for(var i = 0; i < 12; i++){
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
            this.set('year', selected.id);
        },

        changeMonth(selected){
            var model = this.get('model');
            var year = this.get('year');
            var ical = this.get('ical');

            model.set('events', ical.getEventsIndex(model.calendars, year));

            this.set('monthSections',
                [
                    Ember.Object.create({
                        sectionId: 0,
                        month: selected.id,
                        days: [],
                        model
                    }),
                    Ember.Object.create({
                        sectionId: 1,
                        month: selected.id + 1,
                        days: [],
                        model
                    }),
                    Ember.Object.create({
                        sectionId: 2,
                        month: selected.id + 2,
                        days: [],
                        model
                    })
                ]
            );
        }

    }
});
