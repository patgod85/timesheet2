import Ember from 'ember';

export default Ember.Mixin.create({
    ical: Ember.inject.service('ical'),

    monthSections: null,

    events: Ember.computed('calendars', 'year', 'month', 'monthNumbers', function(){

        var calendars = this.get('calendars');
        var ical = this.get('ical');

        return ical.getEventsIndex(calendars, this.get('year'));
    }),

    actions: {
        checkDate(sectionId, day){
            var sections = this.get('monthSections');

            var foundSection = sections.findBy('sectionId', sectionId);

            if(!foundSection){
                return;
            }

            var days = foundSection.get('days');
            var foundDay = days.findBy('date', day.date);

            if(foundDay){
                days.removeObject(foundDay);
            }
            else{
                days.pushObject(day);
            }
        },


        onUncheck(){
            var sections = this.get('monthSections');
            sections.forEach(section => {
                section.set('days', []);
            });
        },

        onUpdate(){
            this.sendAction('refreshAction');
        }
    }

});
