import Ember from 'ember';
import moment from 'moment';
import MonthEvents from './month-events';

export default Ember.Component.extend(MonthEvents, {

    weeks: null,

    init() {
        this._super(...arguments);

        this.initWeeks();
    },

    daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],

    initWeeks(){
        const initWeeksStart = new Date().getTime();

        if(this.get('month') === 0){
            this.set('year', this.get('year') - 1);
            this.set('month', 12);
        }
        if(this.get('month') === 13){
            this.set('year', this.get('year') + 1);
            this.set('month', 1);
        }

        this.set('weeks', []);

        let firstDay = moment().year(this.get('year')).month(this.get('month') - 1).date(1);
        let weeks = this.get('weeks');
        const self = this;

        const events = this.get('model.events');

        let isLastWeek = false;
        let prevDate = 0;

        first_level_loop:
        for (let w = 0; w < 6; w++) {

            let week = [];

            for (let d = 1; d < 8; d++) {
                firstDay.weekday(d);

                let date = firstDay.date();
                let index = firstDay.format('YYYY-MM-DD');
                const momentDate = moment(firstDay);
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

        const initWeeksEnd = new Date().getTime();
console.log('Init weeks time: ' + (initWeeksEnd-initWeeksStart) + ' ms');
    },

    monthName: Ember.computed('month', function () {

        return moment().month(this.get('month') - 1).format('MMMM');
    }),

    eventsObserver: Ember.observer('model.events', function () {
        let weeks = this.get('weeks');
        const events = this.get('model.events');
        const self = this;

        weeks.map(week => {
            week.map(day => {
                const index = day.get('index');
                const localEvents = self.getLocalEvents(day.get('date'), index, events);
                if(JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)){

                    day.set('localEvents', localEvents);
                    day.set('isHoliday', self.isHoliday(index, events));
                }
            });
        });
    }),

    weeksObserver: Ember.observer('checkedDates.[]', function () {
        let checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(o => o.date) : [];

        let weeks = this.get('weeks');

        weeks.forEach(days => {

            let previouslyChecked = days.filterBy('isChecked', true);

            previouslyChecked.forEach(day => {
                day.set('isChecked', false);
            });

            checkedDates.forEach(date => {
                const found = days.findBy('index', date);

                if(found){
                    found.set('isChecked', true);
                }
            });
        });
    }),

    actions: {
        onPickDaysOfWeek(year, sectionId, day){
            this.get('onPickDaysOfWeek')(year, sectionId, day);
        }
    }
});
