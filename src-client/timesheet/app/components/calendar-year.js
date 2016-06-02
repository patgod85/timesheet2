import Ember from 'ember';

import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({

    selectedDates: [],

    selectedYear: 0,

    monthNumbers: [1,2,3],

    init() {
        this._super(...arguments);
        this.set('selectedYear', this.get('y'));
    },

    selectedDatesPlain: Ember.computed.map('selectedDates', function(o){
        return o.date;
    }),

    events: Ember.computed('calendars', 'selectedDates', 'selectedYear', 'monthNumbers', function(){

        var calendars = this.get('calendars');

        return ical.getEventsIndex(calendars, this.get('selectedYear'));
    }),

    actions: {
        selectDate(day){

            var selectedDates = this.get('selectedDates');
            var found = selectedDates.findBy('date', day.date);
            if(!found){
                selectedDates.pushObject(day);
            }
            else{
                selectedDates.removeObject(found);
            }
        },

        setValue(selectedDates){
            var value = this.get('value');
            this.updateDays(selectedDates, 'v:' + value, this.get('model'), this.get('events'));
        },

        setNonworkingDay(selectedDates, eventId){
            this.updateDays(selectedDates, 'n:' + eventId, this.get('model'), this.get('events'));
        },

        setEvent(selectedDates, eventId){
            this.updateDays(selectedDates, 'd:' + eventId, this.get('model'), this.get('events'));
        },

        setShift(selectedDates, eventId){
            this.updateDays(selectedDates, 's:' + eventId, this.get('model'), this.get('events'));
        },

        clearAll(selectedDates){
            if(confirm('All data in selected dates will be removed. Are you sure?')){
                this.clearData(selectedDates, this.get('model'), this.get('events'));
            }
        },

        unpickDates(){
            this.set('selectedDates', []);
        },

        changeYear(selected){
            this.set('selectedYear', selected.id);
        },

        changeMonth(selected){
            this.set('monthNumbers', [selected.id, selected.id + 1, selected.id + 2]);
        }
    },

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

    updateDays(days, value, model, events){
        var iCalData = model.get('calendar');

        var updatedCalendar = ical.updateDays(iCalData, value, days, events);

        model.set('calendar', updatedCalendar);

        model.save().then(() => {
            this.sendAction('refreshAction');
        });
    },

    clearData(days, model, events){
        var iCalData = model.get('calendar');

        var updatedCalendar = ical.clearData(iCalData, days, events);

        model.set('calendar', updatedCalendar);

        model.save().then(() => {
            this.sendAction('refreshAction');
        });
    }


});
