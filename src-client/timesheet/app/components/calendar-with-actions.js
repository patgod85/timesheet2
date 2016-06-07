import Ember from 'ember';

import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({

    checkedDates: [],

    checkedDatesPlain: Ember.computed.map('checkedDates', function(o){
        return o.date;
    }),

    events: Ember.computed('calendars', 'checkedDates', 'year', 'month', 'monthNumbers', function(){

        var calendars = this.get('calendars');

        return ical.getEventsIndex(calendars, this.get('year'));
    }),

    actions: {
        checkDate(day){
            var checkedDates = this.get('checkedDates');
            var found = checkedDates.findBy('date', day.date);
            if(!found){
                checkedDates.pushObject(day);
            }
            else{
                checkedDates.removeObject(found);
            }
        },


        unpickDates(){
            this.set('checkedDates', []);
        }
    }


});
