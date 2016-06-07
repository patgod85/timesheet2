import Ember from 'ember';

import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({
    actions: {
        setValue(checkedDates){
            var value = this.get('value');
            this.updateDays(checkedDates, 'v:' + value, this.get('model'), this.get('events'));
        },

        setNonworkingDay(checkedDates, eventId){
            this.updateDays(checkedDates, 'n:' + eventId, this.get('model'), this.get('events'));
        },

        setEvent(checkedDates, eventId){
            this.updateDays(checkedDates, 'd:' + eventId, this.get('model'), this.get('events'));
        },

        setShift(checkedDates, eventId){
            this.updateDays(checkedDates, 's:' + eventId, this.get('model'), this.get('events'));
        },

        clearAll(checkedDates){
            if(confirm('All data in selected dates will be removed. Are you sure?')){
                this.clearData(checkedDates, this.get('model'), this.get('events'));
            }
        },

        unpickDates(){
            this.set('checkedDates', []);
        }
    },

    clearData(days, model, events){
        var iCalData = model.get('calendar');

        var updatedCalendar = ical.clearData(iCalData, days, events);

        model.set('calendar', updatedCalendar);

        model.save().then(() => {
            this.sendAction('refreshAction');
        });
    },

    updateDays(days, value, model, events){
        var iCalData = model.get('calendar');

        var updatedCalendar = ical.updateDays(iCalData, value, days, events);

        model.set('calendar', updatedCalendar);

        model.save().then(() => {
            this.sendAction('refreshAction');
        });
    }

});
