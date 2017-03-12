import Ember from 'ember';


export default Ember.Component.extend({
    tagName: 'td',

    classNameBindings: ['isHoliday:holiday', 'doesBelongToOtherMonth:bg-danger', 'isChecked:bg-success', 'isWeekend:weekend', 'value:hasValue', 'shift:hasShift', 'dayType:hasDayType'],

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

    value: Ember.computed('localEvents', function(){
        let v = '';

        if(this.get('isHeader')){
            return v;
        }

        const event = this.get('localEvents').find(event => {
            return !!event.summary.v;
        });

        if(event){
            v = event.summary.v;
        }
        return v;
    }),
    shift: Ember.computed('localEvents', function(){
        let s = '';

        if(this.get('isHeader')){
            return s;
        }

        const event = this.get('localEvents').find(event => {
            return !!event.summary.s;
        });

        if(event){
            s = event.summary.s;
        }
        return s;
    }),
    dayType: Ember.computed('localEvents', function(){
        let d = '';

        if(this.get('isHeader')){
            return d;
        }

        const event = this.get('localEvents').find(event => {
            return !!event.summary.d;
        });

        if(event){
            d = event.summary.d;
        }
        return d;
    }),

    actions: {
        click(sectionId, day){
            if(this.get('isHeader')){
                return;
            }

            this.get('onPickDate')(
                sectionId,
                {
                    date: day.format('YYYY-MM-DD'),
                    events: this.get('localEvents')
                }
            );
        }

    }
});
