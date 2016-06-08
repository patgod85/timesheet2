import Ember from 'ember';

import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({
    actions: {
        setValue(){
            var value = this.get('value');
            this.updateDays('v:' + value);
        },

        setNonworkingDay(eventId){
            this.updateDays('n:' + eventId);
        },

        setEvent(eventId){
            this.updateDays('d:' + eventId);
        },

        setShift(eventId){
            this.updateDays('s:' + eventId);
        },

        clearAll(){
            if(confirm('All data in selected dates will be removed. Are you sure?')){
                this.clearData();
            }
        },

        unpickDates(){
            this.sendAction('onUncheck');
        }
    },

    clearData(days){
        var iCalData = model.get('calendar');

        var updatedCalendar = ical.clearData(iCalData, days, this.get('events'));

        model.set('calendar', updatedCalendar);

        model.save().then(() => {
            //this.sendAction('refreshAction');
        });

        this.sendAction('onUpdate');
    },

    updateDays(value){
        var sections = this.get('sections');
        sections.forEach(section => {

            var model = section.model,
                days = section.days.toArray();

            if(days.length){

                var iCalData = model.get('calendar');

                var updatedCalendar = ical.updateDays(iCalData, value, days.toArray(), this.get('events'));

                model.set('calendar', updatedCalendar);

                model.save().then(() => {
                    //this.sendAction('refreshAction');
                });
            }

        });

        this.sendAction('onUpdate');
    }

});
