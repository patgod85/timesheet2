import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';

export default Ember.Route.extend({
    model(params) {
        var employee;
        return this.store.findRecord('employee', params.employee_id)
            .then(_employee => {
                employee = _employee;
                return Ember.$.ajax({
                    url: '/cal/default.ics'
                });
            })
            .then(defaultCalendar => {
                employee.set('calendars', [defaultCalendar, employee.get('calendar')]);
                return employee;
            });
    },
    actions: {
        submit(model){
            model.save();
        },

        updateDays(days, value, employee){
//console.log(employee, days, value);
            var iCalData = employee.get('calendar');

            var jCalData = ICAL.parse(iCalData);

            var comp = new ICAL.Component(jCalData);

            days.map(day => {
                var vevent = new ICAL.Component('vevent'),
                    event = new ICAL.Event(vevent);

                event.summary = value;
                event.startDate = ICAL.Time.fromDateString(day.date);
                event.endDate = ICAL.Time.fromDateString(day.date);

                comp.addSubcomponent(vevent);
            });

            employee.set('calendar', comp.toString());

            var self = this;
            employee.save().then(() => {
                self.refresh();
            });

        }
    }
});
