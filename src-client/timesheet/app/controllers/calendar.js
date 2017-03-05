import Ember from 'ember';
import CalendarController from './calendar-controller';

export default CalendarController.extend({

    calendars: Ember.computed('model', function(){

        return [
            this.get('model').get('calendar')
        ];
    })
});
