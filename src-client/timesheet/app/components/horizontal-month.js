import Ember from 'ember';
import moment from 'moment';
import MonthEvents from './month-events';

export default Ember.Component.extend(MonthEvents, {
    days: null,

    init() {
        this._super(...arguments);

        this.initDays();
    },

    initDays(){
        const self = this;
        const year = this.get('year');
        const month = this.get('month');
        this.set('days', Ember.A([]));
        let days = this.get('days');
        const model = this.get('model');
        days.clear();

        for(let i = moment({year: year, month: month, date: 1}); i.month() === month; i.add(1, 'd')){

            let momentDate = moment(i);
            let index = i.format('YYYY-MM-DD');
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
        const self = this;
        const days = this.get('days');
        const model = this.get('model');

        days.forEach(day => {

            let index = day.get('index');
            let localEvents = self.getLocalEvents(day.get('date'), index, model.events);
            if(JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)){

                day.set('localEvents', localEvents);
                day.set('isHoliday', self.isHoliday(index, model.events));
            }
        });

    }),

    observeMonthChange: Ember.observer('month', 'year', function(){
        this.initDays();
    }),

    observeCheckedDates: Ember.observer('checkedDates.[]', function () {
        const checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(o => o.date) : [];

        const days = this.get('days');

        let previouslyChecked = days.filterBy('isChecked', true);

        previouslyChecked.forEach(day => {
            day.set('isChecked', false);
        });

        checkedDates.forEach(date => {
            let found = days.findBy('index', date);

            if(found){
                found.set('isChecked', true);
            }
        });
    })
});
