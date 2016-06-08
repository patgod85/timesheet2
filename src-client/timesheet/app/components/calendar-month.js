import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        if(this.get('month') === 0){
            this.set('year', this.get('year') - 1);
            this.set('month', 12);
        }
        if(this.get('month') === 13){
            this.set('year', this.get('year') + 1);
            this.set('month', 1);
        }
    },

    monthName: Ember.computed('month', function () {

        return moment().month(this.get('month') - 1).format('MMMM');
    }),

    weeks: Ember.computed('year', 'month', 'checkedDates.[]', 'events.events.[]', function () {

        var firstDay = moment().year(this.get('year')).month(this.get('month') - 1).date(1);
        var checkedDates = this.get('checkedDates').map(o => o.date) || [];
        var weeks = [];

        var isLastWeek = false;
        let prevDate = 0;

        first_level_loop:
        for (var w = 0; w < 6; w++) {

            let week = [];

            for (let d = 1; d < 8; d++) {
                firstDay.weekday(d);

                let date = firstDay.date();

                week.push({
                    date: moment(firstDay),
                    isChecked: checkedDates.indexOf(firstDay.format('YYYY-MM-DD')) > -1
                });

                if (w > 0 && date < prevDate) {
                    isLastWeek = true;

                    if(d === 1){
                        break first_level_loop;
                    }
                }

                prevDate = date;
            }

            weeks.push(week);

            if (isLastWeek) {
                break;
            }
        }

        return weeks;
    })

});
