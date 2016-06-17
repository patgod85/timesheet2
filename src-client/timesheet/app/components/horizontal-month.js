import Ember from 'ember';
import moment from 'moment';
import MonthEvents from './month-events';

export default Ember.Component.extend(MonthEvents, {
    days: null,

    init() {
        this._super(...arguments);

        this.constructor1();
    },

    constructor1(){
        var self = this;
        var year = this.get('year');
        var month = this.get('month');
        this.set('days', []);
        var days = this.get('days');
        var model = this.get('model');
        days.clear();

        for(var i = moment({year: year, month: month, date: 1}); i.month() === month; i.add(1, 'd')){

            var momentDate = moment(i);
            var index = i.format('YYYY-MM-DD');
            days.pushObject(
                Ember.Object.create({
                    date: momentDate,
                    index,
                    isChecked: false,
                    localEvents: self.getLocalEvents(momentDate, index, model.get('events')),
                    isHoliday: self.isHoliday(index, model.get('events'))
                })
            );
        }
    },

    calendarObserver: Ember.observer('model.events', function(){
        var self = this;
        var year = this.get('year');
        var days = this.get('days');
        var model = this.get('model');

        days.forEach(day => {

            var index = day.get('index');
            var localEvents = self.getLocalEvents(day.get('date'), index, model.events);
            if(JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)){

                day.set('localEvents', localEvents);
                day.set('isHoliday', self.isHoliday(index, model.events));
            }
        });

    }),

    observeMonthChange: Ember.observer('month', 'year', function(){
        this.constructor1();
    }),

    observeCheckedDates: Ember.observer('checkedDates.[]', function () {
        var checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(o => o.date) : [];

        var days = this.get('days');

        var previouslyChecked = days.filterBy('isChecked', true);

        previouslyChecked.forEach(day => {
            day.set('isChecked', false);
        });

        checkedDates.forEach(date => {
            var found = days.findBy('index', date);

            if(found){
                found.set('isChecked', true);
            }
        });
    })
});
