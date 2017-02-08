
import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['y', 'm'],

    y: 0,
    m: 0,

    localStorage: Ember.inject.service(),

    year: Ember.computed('y', function(){
        const previousOptions = this.get('localStorage').getCalendarOptions();

        let y = this.get('y');

        if(!y){
            y = previousOptions.year;
            this.set('y', y);
        }
        else {

            this.get('localStorage').setCalendarOptions({year: y});
        }

        return y;
    }),

    month: Ember.computed('m', function(){
        const previousOptions = this.get('localStorage').getCalendarOptions();

        let m = this.get('m');

        if(!m){
            m = previousOptions.month;
            this.set('m', m);
        }
        else {
            this.get('localStorage').setCalendarOptions({month: m});
        }

        return m;
    }),

    actions: {

        changeMonth(year, month){
            this.get('localStorage').setCalendarOptions({year, month});

            this.set('m', month);
            this.set('y', year);
        }

    }
});
