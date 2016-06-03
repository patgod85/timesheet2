import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    selectedYear: moment().year(),
    selectedMonth: moment().month(),

    months: Ember.computed(function(){

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var index = 0;

        return monthNames.map(name => {
            return {id: index++, title: name};
        });
    }),

    years: Ember.computed(function(){
        return [
            {id: 2014, title: 2014},
            {id: 2015, title: 2015},
            {id: 2016, title: 2016},
            {id: 2017, title: 2017},
            {id: 2018, title: 2018}
        ];
    }),

    actions: {
        changeYear(selected){
            this.set('selectedYear', selected.id);
        },

        changeMonth(selected){
            this.set('selectedMonth', selected.id);
        }
    }
});

