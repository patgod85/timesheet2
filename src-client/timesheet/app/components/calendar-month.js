import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

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

        var isLastWeek = false;
        let prevDate = 0;

        first_level_loop:
        for (var w = 0; w < 6; w++) {

            let week = [];

            for (let d = 1; d < 8; d++) {
                firstDay.weekday(d);

                let date = firstDay.date();
                let index = firstDay.format('YYYY-MM-DD');
                week.pushObject(
                    Ember.Object.create({
                        date: moment(firstDay),
                        index,
                        isChecked: false
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

    eventsObserver: Ember.observer('model.events.events.[]', function () {

        this.constructor1();
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
