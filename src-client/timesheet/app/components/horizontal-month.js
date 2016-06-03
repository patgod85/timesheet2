import Ember from 'ember';
import moment from 'moment';
import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({
    days: Ember.computed('year', 'month', 'calendars', function(){

        var year = this.get('year');
        var month = this.get('month');
        var eIndex = ical.getEventsIndex(this.get('calendars'), year);
//console.log(eIndex.events);

        var days = [];
        for(var i = moment({year: year, month: month, date: 1}); i.month() === month; i.add(1, 'd')){
            var index = i.format('YYYY-MM-DD');
//console.log(eIndex.events[index]);
            var events = [];
            if(eIndex.events.hasOwnProperty(index)){
                events = eIndex.events[index];
            }

            var isHoliday = eIndex.holidays.hasOwnProperty(index) && eIndex.holidays[index];
            let className = '';
            if(isHoliday){
                className += ' holiday';
            }

            days.push({
                id: index,
                title: this.get('showNumbers') ? i.format('DD') : '',
                isWeekend: [5,6].indexOf(i.day()) !== -1,
                events,
                className
            });
        }

        return days;
    })
});
