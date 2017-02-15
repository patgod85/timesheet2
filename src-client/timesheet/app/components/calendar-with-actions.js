import Ember from 'ember';

export default Ember.Mixin.create({
    ical: Ember.inject.service('ical'),


    events: Ember.computed('calendars', 'year', 'month', 'monthNumbers', function(){

        const calendars = this.get('calendars');
        const ical = this.get('ical');

        return ical.getEventsIndex(calendars, this.get('year'));
    }),

    actions: {
        checkDate(sectionId, day){
            const sections = this.get('monthSections');

            const foundSection = sections.findBy('sectionId', sectionId);

            if(!foundSection){
                return;
            }

            let days = foundSection.get('days');
            const foundDay = days.findBy('date', day.date);

            if(foundDay){
                days.removeObject(foundDay);
            }
            else{
                days.pushObject(day);
            }
        },


        onUncheck(){
            let sections = this.get('monthSections');
            sections.forEach(section => {
                section.set('days', []);
            });
        },

        onUpdate(){
            this.sendAction('refreshAction');
        }
    }

});
