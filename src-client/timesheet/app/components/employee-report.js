import Ember from 'ember';

import moment from 'npm:moment-timezone';
import ical from '../utils/ical-wrapper';

export default Ember.Component.extend({
    model: {
        report_from: moment({ year : 2016, month : 0, day : 2}).toDate(),
        report_to: moment({ year : 2016, month : 0, day : 18 }).toDate()
    },

    report: {
        w: 0,
        n: 0,
        ot: 0,
        other: []
    },

    actions: {

        getReport(employee, events, reportFrom, reportTo){
            reportFrom = moment(reportFrom);
            reportTo = moment(reportTo);
            var today = moment();

            var eIndex = ical.getEventsIndex(employee.calendars, reportFrom.year());
            var report = {
                w: 0,
                n: 0,
                ot: 0,
                other: []
            };

            for(var i = moment(reportFrom); i.isSameOrBefore(reportTo) && i.isSameOrBefore(today); i.add(1, 'd')){
                var index = i.format('YYYY-MM-DD');

                if(eIndex.events.hasOwnProperty(index)){
                    for(var j = 0; j < eIndex.events[index].length; j++){

                        if(eIndex.events[index][j].hasOwnProperty('summary')){
                            var summary = eIndex.events[index][j].summary;
                            var d = summary.hasOwnProperty('d') ? parseInt(summary.d) : 0;

                            if(summary.hasOwnProperty('n') && ([7, 8].indexOf(d) === -1) || d === 3){
                                report.n++;
                            }
                            if(d > 0){
                                if([4, 7, 8].indexOf(d) !== -1){
                                    report.w++;

                                    if(d === 7){
                                        report.w++;
                                    }

                                    if(d === 8){
                                        report.ot++;
                                    }
                                }
                                else if(d === 1){
                                    report.ot--;
                                }
                                else{
                                    if(!report.hasOwnProperty(d)) {
                                        report[d] = 0;
                                    }
                                    report[d]++;
                                }
                            }
                        }
                    }
                }
                else{
                    report.w++;
                }
            }

            events.map((event) =>{
                //console.log(event.id, report[event.id]);
                if(report.hasOwnProperty(event.id)){
                    report.other.push({
                        event,
                        value: report[event.id]
                    });
                }
            });

            this.set('report', report);
        }
    }
});
