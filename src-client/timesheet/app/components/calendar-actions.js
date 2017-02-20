import Ember from 'ember';


export default Ember.Component.extend({
    ical: Ember.inject.service('ical'),

    pickValue: 1,

    pickGap: 1,

    pickQuantity: 5,

    actions: {
        setValue(){
            const value = this.get('value');
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

        onClearAll(){
            if(confirm('All data in selected dates will be removed. Are you sure?')){
                this.clearData();
            }
        },

        onUnpick(){
            this.sendAction('onUnpick');
        },

        onPickWithAlgorithm(){
            this.get('onPickWithAlgorithm')(
                this.get('pickValue'),
                this.get('pickGap'),
                this.get('pickQuantity')
            );
        }
    },

    clearData(){
        let sections = this.get('sections');
        const self = this;
        const ical = this.get('ical');

        let promises = [];
//function ga(){
//console.log('ga-ga');
//}
        sections.forEach(section => {

            const model = section.model,
                days = section.days.toArray();

            if(days.length) {
                const iCalData = model.get('calendar');

                const updatedCalendar = ical.clearData(iCalData, days, model.events);

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
        const ical = this.get('ical');
        const self = this;
        let sections = this.get('sections');
        let promises = [];

        sections.forEach(section => {

            const model = section.model,
                days = section.days.toArray();

            if(days.length){

                const iCalData = model.get('calendar');

                const updatedCalendar = ical.updateDays(iCalData, value, days.toArray(), model.events);

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
