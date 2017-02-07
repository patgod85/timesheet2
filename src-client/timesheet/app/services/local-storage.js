import Ember from 'ember';

const CALENDAR_OPTIONS = 'CALENDAR_OPTIONS';

export default Ember.Service.extend({

    getCalendarOptions(){
        let options = {year: 2016, month: 5};

        if(localStorage && localStorage.hasOwnProperty(CALENDAR_OPTIONS)){
            try {
                let preOptions = JSON.parse(localStorage.getItem(CALENDAR_OPTIONS));

                if(preOptions.hasOwnProperty('year') && preOptions.hasOwnProperty('month') && preOptions.year && preOptions.month){
                    options = preOptions;
                }
            }
            catch(e){ }
        }

        // this.setCalendarOptions(options);

        return options;
    },

    setCalendarOptions(o){
        if(localStorage){
            let existing = this.getCalendarOptions();

            localStorage.setItem(CALENDAR_OPTIONS, JSON.stringify(
                Object.assign({}, existing, o)
            ));
        }
    }

});
