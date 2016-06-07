import Ember from 'ember';

import moment from 'moment';

export default Ember.Component.extend({
    tagName: 'td',

    classNameBindings: ['isHoliday:holiday', 'doesBelongToOtherMonth:bg-danger', 'isChecked:bg-success', 'isWeekend:weekend'],

    isWeekend: Ember.computed(function(){
        return this.get('isHeader') && [0,6].indexOf(this.get('date').day()) > -1;
    }),

    isHoliday: Ember.computed(function(){
        var index = moment(this.get('date')).format('YYYY-MM-DD');
        var events = this.get('events');

        return events.holidays.hasOwnProperty(index) && events.holidays[index];
    }),

    doesBelongToOtherMonth: Ember.computed(function(){
        return !this.get('isSingleMonth') && this.get('date').month() + 1 !== this.get('month');
    }),

    title: Ember.computed('date', function() {
        return this.get('showNumbers') ? this.get('date').format('DD') : "";
    }),

    dayOfWeek: Ember.computed('date', function() {
        return this.get('isHeader') ? this.get('date').format('dd') : "";
    }),

    localEvents: Ember.computed(function() {
        if (this.get('isHeader') || this.get('nonWorkingOnly')) {
            return [];
        }
        var today = moment().hour(23).minute(59).second(59);
        var date = this.get('date');
        var index = moment(date).format('YYYY-MM-DD');
        var events = this.get('events');

        var localEvents = events.events.hasOwnProperty(index) ? events.events[index] : [];

        if (localEvents.length === 0) {
            if (date.isAfter(today)) {
                //localEvents.push({summary: {v: "---"}});
            }
            else{
                localEvents.push({summary: {v: 1}});
            }
        }

        return localEvents;
    }),

    actions: {
        click(day){
            this.get('checkDateAction')({
                date: day.format('YYYY-MM-DD'),
                events: this.get('localEvents')
            });
        }

    }
});
