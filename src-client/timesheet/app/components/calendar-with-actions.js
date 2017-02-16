import Ember from 'ember';
import moment from 'moment';

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
        },

        onCheckDaysOfWeek(year, sectionId, dayNumber){
            const sections = this.get('monthSections');

            const foundSection = sections.findBy('sectionId', sectionId);

            if(!foundSection){
                return;
            }

            let days = foundSection.get('days');

            let monday = moment()
                .year(year)
                .month(foundSection.get('month') - 1)
                .startOf('month')
                .day(dayNumber);

            if (monday.date() > 7){
                monday.add(7, 'd');
            }

            const month = monday.month();
            while(month === monday.month()){
                const format = monday.format('YYYY-MM-DD');
                days.pushObject({date: format, events: {}});
                monday.add(7,'d');
            }
        }
    }

});
