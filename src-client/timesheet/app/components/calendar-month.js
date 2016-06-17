import Ember from 'ember';
import moment from 'moment';
import MonthEvents from './month-events';

export default Ember.Component.extend(MonthEvents, {

    weeks: null,

    init() {
        this._super(...arguments);

        this.constructor1();
    },


    constructor1(){
        if(this.get('month') === 0){
            this.set('year', this.get('year') - 1);
            this.set('month', 12);
        }
        if(this.get('month') === 13){
            this.set('year', this.get('year') + 1);
            this.set('month', 1);
        }

        this.set('weeks', []);

        var firstDay = moment().year(this.get('year')).month(this.get('month') - 1).date(1);
        var weeks = this.get('weeks');
        var self = this;

        var events = this.get('model.events');

        var isLastWeek = false;
        let prevDate = 0;

        first_level_loop:
        for (var w = 0; w < 6; w++) {

            let week = [];

            for (let d = 1; d < 8; d++) {
                firstDay.weekday(d);

                let date = firstDay.date();
                let index = firstDay.format('YYYY-MM-DD');
                var momentDate = moment(firstDay);
                week.pushObject(
                    Ember.Object.create({
                        date: momentDate,
                        index,
                        isChecked: false,
                        localEvents: self.getLocalEvents(momentDate, index, events),
                        isHoliday: self.isHoliday(index, events)
                    })
                );

                if (w > 0 && date < prevDate) {
                    isLastWeek = true;

                    if(d === 1){
                        break first_level_loop;
                    }
                }

                prevDate = date;
            }

            weeks.pushObject(week);

            if (isLastWeek) {
                break;
            }
        }

    },

    monthName: Ember.computed('month', function () {

        return moment().month(this.get('month') - 1).format('MMMM');
    }),

    eventsObserver: Ember.observer('model.events', function () {
        var weeks = this.get('weeks');
        var events = this.get('model.events');
        var self = this;

        weeks.map(week => {
            week.map(day => {
                var index = day.get('index');
                var localEvents = self.getLocalEvents(day.get('date'), index, events);
                if(JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)){

                    day.set('localEvents', localEvents);
                    day.set('isHoliday', self.isHoliday(index, events));
                }
            });
        });
    }),

    weeksObserver: Ember.observer('checkedDates.[]', function () {
        var checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(o => o.date) : [];

        var weeks = this.get('weeks');

        weeks.forEach(days => {

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
        });
    })

});
