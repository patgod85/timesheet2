import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';
import moment from 'npm:moment-timezone';

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

    events: Ember.computed('calendars', 'selectedDates', 'selectedYear', 'selectedMonth', function(){

        var calendars = this.get('calendars');

        var eIndex = {events: [], diapasons: [], holidays: []};

        if(!calendars){
            return eIndex;
        }

        if(!Array.isArray(calendars)){
            calendars = [calendars];
        }

        calendars.map(iCalData => {

            var jCalData = ICAL.parse(iCalData);

            var comp = new ICAL.Component(jCalData);
            var vevents = comp.getAllSubcomponents("vevent");

            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new ICAL.Timezone(vtz);

            var beginOfYear = moment().year(this.get('selectedYear')).month(0).date(1).set({hour: 0, minute: 0, second: 0}).tz(tz.tzid);
            var endOfYear = moment().year(this.get('selectedYear')).month(11).date(31).set({hour: 23, minute: 59, second: 59}).tz(tz.tzid);

            var dateRegExp = new RegExp(/d:(\d);/);
            var holidayRegExp = new RegExp(/n:(ph|we);/);
            var valueRegExp = new RegExp(/v:([^;]+);/);

            var isHoliday = false;
            for(var i = 0; i < vevents.length; i++){

                var isInstance = (i+1 === vevents.length);

                var summaryOrig = vevents[i].getFirstPropertyValue("summary");
                var summary = {};

                var match = summaryOrig.match(dateRegExp);
                if(match && match.length > 1){
                    summary.d = match[1];
                }

                match = summaryOrig.match(holidayRegExp);
                if(match && match.length > 1){
                    summary.n = match[1];
                    isHoliday = true;
                }

                match = summaryOrig.match(valueRegExp);
                if(match && match.length > 1){
                    summary.v = match[1];
                }

                var event = new ICAL.Event(vevents[i]);
                var eBegin = moment.tz(event.startDate.toJSDate(), tz.tzid);
                var eEnd = moment.tz(event.endDate.toJSDate(), tz.tzid);

                if(
                    (eBegin.isAfter(beginOfYear, 'day') || eBegin.isSame(beginOfYear, 'day')) &&
                    (eBegin.isBefore(endOfYear, 'day') || eBegin.isSame(endOfYear, 'day')) ||
                    (eEnd.isAfter(beginOfYear, 'day')) &&
                    (eEnd.isBefore(endOfYear, 'day') || eEnd.isSame(endOfYear, 'day'))
                ) {
                    let index = eBegin.format('YYYY-MM-DD');
                    if(eBegin.isSame(eEnd, 'day') || event.duration.toICALString() === 'P1D' && eBegin.format('HHmm') === '0000'){
                        if(!eIndex.events.hasOwnProperty(index)){
                            eIndex.events[index] = [];
                        }
                        eIndex.events[index].push({isInstance, summary});
                    }
                    else{
                        eIndex.diapasons.push({
                            begin: eBegin.format('YYYY-MM-DD'),
                            end: eEnd.format('YYYY-MM-DD'),
                            summary
                        });
                        for(let d = eBegin; d.isBefore(eEnd, 'hour'); d.add(1, 'd')){
                            if(!eIndex.events.hasOwnProperty(index)){
                                eIndex.events[index] = [];
                            }
                            eIndex.events[index].push({isInstance, summary});
                        }
                    }

                    if(isHoliday){
                        if(!eIndex.holidays.hasOwnProperty(index)){
                            eIndex.holidays[index] = [];
                        }
                        eIndex.holidays[index].push(true);

                    }
                }
            }
        });

        return eIndex;
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
