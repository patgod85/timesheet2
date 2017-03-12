import Ember from 'ember';
import CalendarController from './calendar-controller';

export default CalendarController.extend({

    selectedMonth: Ember.computed('month', function () {
        const number = parseInt(this.get('month'), 10);
        return number - 1;
    }),
});
