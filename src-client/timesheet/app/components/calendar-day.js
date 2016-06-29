import Ember from 'ember';


export default Ember.Component.extend({
    tagName: 'td',

    classNameBindings: ['isHoliday:holiday', 'doesBelongToOtherMonth:bg-danger', 'isChecked:bg-success', 'isWeekend:weekend'],

    isWeekend: Ember.computed('date', function(){
        return this.get('isHeader') && [0,6].indexOf(this.get('date').day()) > -1;
    }),


    doesBelongToOtherMonth: Ember.computed('date', function(){
        return !this.get('isSingleMonth') && this.get('date').month() + 1 !== this.get('month');
    }),

    title: Ember.computed('date', function() {
        return this.get('showNumbers') ? this.get('date').format('DD') : "";
    }),

    dayOfWeek: Ember.computed('date', function() {
        return this.get('isHeader') ? this.get('date').format('dd') : "";
    }),


    actions: {
        click(sectionId, day){
            if(this.get('isHeader')){
                return;
            }

            this.get('checkDateAction')(
                sectionId,
                {
                    date: day.format('YYYY-MM-DD'),
                    events: this.get('localEvents')
                }
            );
        }

    }
});
