import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';

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
