import Ember from 'ember';
import moment from 'moment';
import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({
    days: Ember.computed('year', 'month', 'calendars', 'checkedDates.[]', function(){

        var year = this.get('year');
        var month = this.get('month');
        var checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(o => o.date) : [];
        var days = [];
        for(var i = moment({year: year, month: month, date: 1}); i.month() === month; i.add(1, 'd')){

            days.push({
                date: moment(i),
                isChecked: checkedDates.indexOf(i.format('YYYY-MM-DD')) > -1
            });
        }

        return days;
    }),

    events: Ember.computed('calendars', 'year', 'month', function(){

        var calendars = this.get('calendars');

        return ical.getEventsIndex(calendars, this.get('year'));
    })
});
