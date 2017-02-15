import Ember from 'ember';
import CalendarController from '../calendar-controller';

export default CalendarController.extend({
    month: Ember.computed('m', function(){
        const m = this.getMonth();

        return Number(m) - 1;
    }),

});
