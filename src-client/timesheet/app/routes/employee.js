import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';
import moment from 'npm:moment-timezone';

export default Ember.Route.extend({
    model(params) {
        var employee,
            self = this;

        return Ember.RSVP.hash({
            employee: this.store.findRecord('employee', params.employee_id)
            .then(_employee => {
                employee = _employee;
                return self.store.findRecord('calendar', 1);
            })
            .then(defaultCalendar => {
                employee.set('calendars', [defaultCalendar.get('ical'), employee.get('calendar')]);
                return employee;
            }),
            events: this.store.findAll('event')
        });
    },
    actions: {
        submit(model){
            model.save();
        },

        updateDays(days, value, employee, events){
            var iCalData = employee.get('calendar');

            var jCalData = ICAL.parse(iCalData);

            var comp = new ICAL.Component(jCalData);
            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new ICAL.Timezone(vtz);

            var packageFormat = new RegExp(/t2:(.+)/);
            var event;

            days.map(day => {
                if(events.events.hasOwnProperty(day.date)){

                    var vevents = comp.getAllSubcomponents("vevent");
                    for(var i = 0; i < vevents.length; i++){
                        event = new ICAL.Event(vevents[i]);
                        var index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        var index2 = moment.tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        if(index1 === day.date && index2 === day.date){

                            var summary = vevents[i].getFirstPropertyValue("summary");

                            var packageBody = summary.match(packageFormat);
                            if(packageBody && packageBody.length === 2){
                                var packageParts = packageBody[1].split(';');
                                var isFound = false;

                                for(var j = 0; j < packageParts.length; j++){
                                    if(value.substring(0, 2) === packageParts[j].substring(0, 2)){
                                        packageParts[j] = value;
                                        isFound = true;
                                    }
                                }
                                packageParts.unshift(value);
                                vevents[i].updatePropertyWithValue('summary', 't2:' + packageParts.join(';'));
                            }
                        }
                    }
                }
                else{
                    var vevent = new ICAL.Component('vevent');

                    event = new ICAL.Event(vevent);

                    event.summary = 't2:' + value + ';';
                    event.startDate = ICAL.Time.fromDateString(day.date);
                    event.endDate = ICAL.Time.fromDateString(day.date);

                    comp.addSubcomponent(vevent);
                }
            });

            employee.set('calendar', comp.toString());

            var self = this;
            employee.save().then(() => {
                self.refresh();
            });

        }
    }
});
