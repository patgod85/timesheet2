import Ember from 'ember';
//noinspection JSFileReferences
import ICAL from 'npm:ical.js';

export default Ember.Route.extend({

    model() {
        return this.store.findRecord('calendar', 1)
            .then(function(calendar){
                return calendar;
            });
    },

    actions: {
        submit(model){
            model.save();
        },

        updateDays(days, value, calendar){
//console.log(employee, days, value);
            var iCalData = calendar.get('ical');

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
//console.log(comp.toString());
            calendar.set('ical', comp.toString());

            var self = this;
            calendar.save().then(() => {
                self.refresh();
            });

        }
    }
});
