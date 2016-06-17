import Ember from 'ember';

export default Ember.Mixin.create({

    isHoliday: function (index, events) {
        return events.holidays.hasOwnProperty(index) && events.holidays[index];
    },

    getLocalEvents: function (date, index, events) {
        if (this.get('isHeader') || this.get('nonWorkingOnly')) {
            return [];
        }
        var today = moment().hour(23).minute(59).second(59);

        var localEvents = events.events.hasOwnProperty(index) ? events.events[index] : [];

        if (localEvents.length === 0) {
            if (date.isAfter(today)) {
                //localEvents.push({summary: {v: "---"}});
            }
            else {
                localEvents.push({summary: {v: 1}});
            }
        }

        return localEvents;
    }
});
