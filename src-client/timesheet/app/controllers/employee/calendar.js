import CalendarController from '../calendar-controller';

import Ember from 'ember';

export default CalendarController.extend({

    ical: Ember.inject.service('ical'),

    actions: {
        removeDiapason(begin, end){
            const self = this;
            const ical = this.get('ical');

            let promises = [];

            let model = this.get('model').employee;

            const iCalData = model.get('calendar');

            const updatedCalendar = ical.removeDiapason(iCalData, model.events, begin, end);

            model.set('calendar', updatedCalendar);

            promises.pushObject(model.save());


            Ember.RSVP.hash(promises)
                .then(() => {
                    self.send('refresh');
                })
                .catch(() => {
                });
        },

        addDiapason(begin, end, type){
            const self = this;
            const ical = this.get('ical');

            let promises = [];

            let model = this.get('model').employee;

            const iCalData = model.get('calendar');

            const updatedCalendar = ical.addDiapason(iCalData, model.events, begin, end, type);

            model.set('calendar', updatedCalendar);

            promises.pushObject(model.save());


            Ember.RSVP.hash(promises)
                .then(() => {
                    self.send('refresh');
                })
                .catch(() => {
                });
        }
    }
});
