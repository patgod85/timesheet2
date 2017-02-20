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
        onPickDate(sectionId, day){
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


        onUnpick(){
            let sections = this.get('monthSections');
            sections.forEach(section => {
                section.set('days', []);
            });
        },

        onUpdate(){
            this.sendAction('refreshAction');
        },

        onPickDaysOfWeek(year, sectionId, dayNumber){
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
        },

        onPickWithAlgorithm(value, gap, quantity){
            const sections = this.get('monthSections');

            if(!sections){
                return;
            }

            const selectedSection = sections[0];
            let selectedSectionId = 0;
            let selectedDays = selectedSection.get('days');
            let lastPickedDay = moment()
                .year(selectedSection.get('year'))
                .month(selectedSection.get('month') - 1)
                .startOf('month');

            sections.map((section, sectionIndex) => {
                const days = section.get('days');
                if(days.length){
                    const dates = days.map(d => d.date).sort();
                    lastPickedDay = dates[dates.length - 1];
                    selectedDays = days;
                    selectedSectionId = sectionIndex;
                }
            });

            if(!lastPickedDay){
                return;
            }

            let lastPickedMoment = moment(lastPickedDay, 'YYYY-MM-DD');

            first_level_loop:
            for(let i = 0; i < quantity; i++){
                for(let j = 0; j < value; j++){

                    let sectionMonthNumber = sections[selectedSectionId].get('month') - 1;
                    if(lastPickedMoment.month() > sectionMonthNumber){
                        if(selectedSectionId >= sections.length - 1){
                            break first_level_loop;
                        }

                        selectedSectionId++;
                        selectedDays = sections[selectedSectionId].get('days');
                    }

                    const format = lastPickedMoment.format('YYYY-MM-DD');
                    selectedDays.pushObject({date: format, events: {}});
                    lastPickedMoment.add(1, 'd');
                }

                lastPickedMoment.add(gap, 'd');
            }
        }
    }

});
