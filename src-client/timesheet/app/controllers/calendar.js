import Ember from 'ember';
import CalendarController from './calendar-controller';

export default CalendarController.extend({

    calendars: Ember.computed('model', function(){
console.log('123', this.get('model'));

        return [
            this.get('model').get('calendar')
        ];
    })
});
