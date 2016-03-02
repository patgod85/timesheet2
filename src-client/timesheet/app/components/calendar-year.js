import Ember from 'ember';

export default Ember.Component.extend({
    selectedDates: [],

    selectedDatesPlain: Ember.computed.map('selectedDates', function(o){
        return o.date;
    }),

    monthNumbers: [1,2,3,4,5,6,7,8,9,10,11,12],

    actions: {
        selectDate(date){

            var selectedDates = this.get('selectedDates');
            var found = selectedDates.findBy('date', date);
            if(!found){
                selectedDates.pushObject({date});
            }
            else{
                selectedDates.removeObject(found);
            }
        }

    }
});
