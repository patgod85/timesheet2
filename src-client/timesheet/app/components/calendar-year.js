import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';
import moment from 'npm:moment-timezone';

export default Ember.Component.extend({
    selectedDates: [],

    iCalData: null,

    didReceiveAttrs() {
        this._super(...arguments);
        var url = this.get('cal');
        var self = this;

        Ember.$.ajax({
            url,
            success(data){
                self.set('iCalData', data);
            }
        });
    },

    selectedDatesPlain: Ember.computed.map('selectedDates', function(o){
        return o.date;
    }),

    monthNumbers: [1,2],//[1,2,3,4,5,6,7,8,9,10,11,12],

    events: Ember.computed('iCalData', function(){

        var iCalData = this.get('iCalData');

        var eIndex = {events: [], diapasons: []};

        if(!iCalData){
            return eIndex;
        }

        var jCalData = ICAL.parse(iCalData);

        var comp = new ICAL.Component(jCalData);
        var vevents = comp.getAllSubcomponents("vevent");

        var vtz = comp.getFirstSubcomponent('vtimezone');
        var tz = new ICAL.Timezone(vtz);

        var beginOfYear = moment().year(this.get('y')).month(0).date(1).set({hour: 0, minute: 0, second: 0}).tz(tz.tzid);
        var endOfYear = moment().year(this.get('y')).month(11).date(31).set({hour: 23, minute: 59, second: 59}).tz(tz.tzid);

        for(var i = 0; i < vevents.length; i++){

            var summary = vevents[i].getFirstPropertyValue("summary");
            var event = new ICAL.Event(vevents[i]);
            var eBegin = moment.tz(event.startDate.toJSDate(), tz.tzid);
            var eEnd = moment.tz(event.endDate.toJSDate(), tz.tzid);
//console.log(summary, eBegin.format(), eEnd.format(), event.duration.toICALString());
            if(
                (eBegin.isAfter(beginOfYear, 'day') || eBegin.isSame(beginOfYear, 'day')) &&
                (eBegin.isBefore(endOfYear, 'day') || eBegin.isSame(endOfYear, 'day')) ||
                (eEnd.isAfter(beginOfYear, 'day')) &&
                (eEnd.isBefore(endOfYear, 'day') || eEnd.isSame(endOfYear, 'day'))
            ) {
                if(eBegin.isSame(eEnd, 'day') || event.duration.toICALString() === 'P1D' && eBegin.format('HHmm') === '0000'){
                    let index = eBegin.format('YYYY-MM-DD');
                    if(!eIndex.events.hasOwnProperty(index)){
                        eIndex.events[index] = [];
                    }
                    eIndex.events[index].push(summary);
                }
                else{
                    eIndex.diapasons.push({
                        begin: eBegin.format('YYYY-MM-DD'),
                        end: eEnd.format('YYYY-MM-DD'),
                        summary
                    });
                    for(let d = eBegin; d.isBefore(eEnd, 'hour'); d.add(1, 'd')){
                        let index = eBegin.format('YYYY-MM-DD');
                        if(!eIndex.events.hasOwnProperty(index)){
                            eIndex.events[index] = [];
                        }
                        eIndex.events[index].push(summary);
                    }
                }
            }
        }

        return eIndex;
    }),

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
