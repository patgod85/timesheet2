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

    clearData(){
        var sections = this.get('sections');
        var self = this;

        var promises = [];
//function ga(){
//console.log('ga-ga');
//}
        sections.forEach(section => {

            var model = section.model,
                days = section.days.toArray();

            if(days.length) {
                var iCalData = model.get('calendar');

                var updatedCalendar = ical.clearData(iCalData, days, model.events);

                model.set('calendar', updatedCalendar);

                promises.pushObject(model.save());
            }
        });


        Ember.RSVP.hash(promises)
            .then(() => {
                self.sendAction('onUpdate');
            })
            .catch(() => {
            });
    },

    updateDays(value){
        var self = this;
        var sections = this.get('sections');
        var promises = [];

        sections.forEach(section => {

            var model = section.model,
                days = section.days.toArray();

            if(days.length){

                var iCalData = model.get('calendar');

                var updatedCalendar = ical.updateDays(iCalData, value, days.toArray(), model.events);

                model.set('calendar', updatedCalendar);

                promises.pushObject(model.save());
            }

        });

        Ember.RSVP.hash(promises)
            .then(() => {
                self.sendAction('onUpdate');
            })
            .catch((err) => {
console.log(err);
            });
    }

});
