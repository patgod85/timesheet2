import Ember from 'ember';
import moment from 'moment';

export default Ember.Mixin.create({

    isHoliday: function (index, events) {
        return events.holidays.hasOwnProperty(index) && events.holidays[index];
    },

    getLocalEvents: function (date, index, events) {
        if (this.get('isHeader') || this.get('nonWorkingOnly')) {
            return [];
        }
        const today = moment().hour(23).minute(59).second(59);

        let localEvents = events.events.hasOwnProperty(index) ? events.events[index] : [];

        const workStartString = this.get('model').get('workStart');

        if (localEvents.length === 0) {
            if (date.isAfter(today) || workStartString && date.isBefore(moment(workStartString, 'YYYY-MM-DD'))) {
                //localEvents.push({summary: {v: "---"}});
            }
            else {
                localEvents.push({summary: {v: 1}});
            }
        }

        return localEvents;
    }
});
