import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    monthName: Ember.computed(['m'], function () {

        return moment().month(this.get('m') - 1).format('MMMM');
    }),

    clicked: 0,

    weeks: Ember.computed('y', 'm', 'clicked', 'events', function () {

        var firstDay = moment().year(this.get('y')).month(this.get('m') - 1).date(1);
        var selectedDates = this.get('selectedDates') || [];
        var events = this.get('events');
        var weeks = [];

        var isLastWeek = false;
        let prevDate = 0;

        first_level_loop:
        for (var w = 0; w < 6; w++) {

            let week = [];

            for (let d = 1; d < 8; d++) {
                firstDay.weekday(d);

                let date = firstDay.date();
                let className = '';
                var index = moment(firstDay).format('YYYY-MM-DD');
                var isHoliday = events.holidays.hasOwnProperty(index) && events.holidays[index];

                if(firstDay.month() + 1 !== this.get('m')){
                    className += ' bg-danger';
                }

                if(isHoliday){
//console.log(events.holidays, index);
                    className += ' holiday';
                }

                if(selectedDates.indexOf(firstDay.format('YYYY-MM-DD')) !== -1){
                    className += ' bg-success';
                }

                week.push({
                    title: firstDay.format('DD'),
                    isHoliday,
                    className,
                    date: index,
                    events: events.events.hasOwnProperty(index) ? events.events[index] : []
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
    }),

    actions: {
        click(day){
            this.get('selectDateAction')(day);
            this.set('clicked', (new Date()).getTime());
        }

    }

});
