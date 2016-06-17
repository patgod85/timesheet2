import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    days: null,

    init() {
        this._super(...arguments);

        this.constructor1();
    },

    constructor1(){
        var year = this.get('year');
        var month = this.get('month');
        this.set('days', []);
        var days = this.get('days');
        days.clear();

        for(var i = moment({year: year, month: month, date: 1}); i.month() === month; i.add(1, 'd')){

            days.pushObject(
                Ember.Object.create({
                    date: moment(i),
                    index: i.format('YYYY-MM-DD'),
                    isChecked: false
                })
            );
        }
    },

    calendarObserver: Ember.observer('model.events', function(){
        this.constructor1();
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
