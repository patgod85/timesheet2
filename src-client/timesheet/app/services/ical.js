//noinspection JSFileReferences
import ICAL from 'npm:ical.js';
import moment from 'npm:moment-timezone';
import Ember from 'ember';

export default Ember.Service.extend({
    updateDays(iCalData, value, days, events) {

        const jCalData = ICAL.parse(iCalData);

        const comp = new ICAL.Component(jCalData);
        const vtz = comp.getFirstSubcomponent('vtimezone');
        const tz = new ICAL.Timezone(vtz);

        const packageFormat = new RegExp(/t2:(.+)/);
        let event;

        days.map(day => {
            if (events.events.hasOwnProperty(day.date) && events.events[day.date].some(item => item.isInstance)) {

                let vevents = comp.getAllSubcomponents("vevent");
                for (let i = 0; i < vevents.length; i++) {
                    event = new ICAL.Event(vevents[i]);
                    const index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    const index2 = moment.tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    if (index1 === day.date && index2 === day.date) {

                        const summary = vevents[i].getFirstPropertyValue("summary");

                        const packageBody = summary.match(packageFormat);
                        if (packageBody && packageBody.length === 2) {
                            let packageParts = packageBody[1].split(';');
                            let isFound = false;

                            for (let j = 0; j < packageParts.length; j++) {
                                if (value.substring(0, 2) === packageParts[j].substring(0, 2)) {
                                    packageParts[j] = value;
                                    isFound = true;
                                }
                            }
                            if (!isFound) {
                                packageParts.unshift(value);
                            }
                            vevents[i].updatePropertyWithValue('summary', 't2:' + packageParts.join(';'));
                        }
                    }
                }
            }
            else {
                const vevent = new ICAL.Component('vevent');

                event = new ICAL.Event(vevent);

                event.summary = 't2:' + value + ';';
                event.startDate = ICAL.Time.fromDateString(day.date);
                event.endDate = ICAL.Time.fromDateString(day.date);

                comp.addSubcomponent(vevent);
            }
        });

        return comp.toString();
    },

    addDiapason(iCalData, events, begin, end, type) {
        const value = 'd:' + type;

        const jCalData = ICAL.parse(iCalData);

        const comp = new ICAL.Component(jCalData);
        const vtz = comp.getFirstSubcomponent('vtimezone');
        const tz = new ICAL.Timezone(vtz);

        const packageFormat = new RegExp(/t2:(.+)/);
        let event;

        if (events.events.hasOwnProperty(begin) && events.events[begin].some(item => item.isInstance)) {

            let vevents = comp.getAllSubcomponents("vevent");
            for (let i = 0; i < vevents.length; i++) {
                event = new ICAL.Event(vevents[i]);
                const index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                if (index1 === begin) {

                    const summary = vevents[i].getFirstPropertyValue("summary");

                    const packageBody = summary.match(packageFormat);
                    if (packageBody && packageBody.length === 2) {
                        let packageParts = packageBody[1].split(';');
                        let isFound = false;

                        for (let j = 0; j < packageParts.length; j++) {
                            if (value.substring(0, 2) === packageParts[j].substring(0, 2)) {
                                packageParts[j] = value;
                                isFound = true;
                            }
                        }
                        if (!isFound) {
                            packageParts.unshift(value);
                        }
                        vevents[i].updatePropertyWithValue('summary', 't2:' + packageParts.join(';'));
                    }
                }
            }
        }
        else {
            const vevent = new ICAL.Component('vevent');

            event = new ICAL.Event(vevent);

            event.summary = 't2:' + value + ';';
            event.startDate = ICAL.Time.fromDateString(begin);
            event.endDate = ICAL.Time.fromDateString(end);
            comp.addSubcomponent(vevent);
        }

        return comp.toString();
    },


    clearData(iCalData, days, events) {

        const jCalData = ICAL.parse(iCalData);

        let comp = new ICAL.Component(jCalData);
        const vtz = comp.getFirstSubcomponent('vtimezone');
        const tz = new ICAL.Timezone(vtz);

        let event;

        days.map(day => {
            if (events.events.hasOwnProperty(day.date) && events.events[day.date].some(item => item.isInstance)) {

                const vevents = comp.getAllSubcomponents("vevent");
                for (let i = 0; i < vevents.length; i++) {
                    event = new ICAL.Event(vevents[i]);
                    const index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    const index2 = moment.tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    if (index1 === day.date && index2 === day.date) {

                        comp.removeSubcomponent(vevents[i]);
                    }
                }
            }
        });

        return comp.toString();
    },

    removeDiapason(iCalData, events, begin, end) {

        const jCalData = ICAL.parse(iCalData);

        let comp = new ICAL.Component(jCalData);
        const vtz = comp.getFirstSubcomponent('vtimezone');
        const tz = new ICAL.Timezone(vtz);

        let event;

        if (events.events.hasOwnProperty(begin) && events.events[begin].some(item => item.isInstance)) {

            const vevents = comp.getAllSubcomponents("vevent");
            for (let i = 0; i < vevents.length; i++) {
                event = new ICAL.Event(vevents[i]);
                const index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                const index2 = moment.tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                if (index1 === begin && index2 === end) {

                    comp.removeSubcomponent(vevents[i]);
                }
            }
        }

        return comp.toString();
    },


    //noinspection JSUnusedGlobalSymbols
    getEventsIndex(calendars, year) {

        let eIndex = {events: {}, diapasons: [], holidays: {}};

        if (!calendars) {
            return eIndex;
        }
        const time1 = new Date().getTime();

        if (!Array.isArray(calendars)) {
            calendars = [calendars];
        }

        calendars.map((iCalData, calendarIndex) => {

            if(!iCalData){
                console.log('Invalid calendar format');
                return;
            }

            const jCalData = ICAL.parse(iCalData);

            const comp = new ICAL.Component(jCalData);
            const vevents = comp.getAllSubcomponents("vevent");

            const vtz = comp.getFirstSubcomponent('vtimezone');
            const tz = new ICAL.Timezone(vtz);

            const beginOfYear = moment().year(year).month(0).date(1).set({hour: 0, minute: 0, second: 0}).tz(tz.tzid);
            const endOfYear = moment().year(year).month(11).date(31).set({hour: 23, minute: 59, second: 59}).tz(tz.tzid);

            const dateRegExp = new RegExp(/d:(\d{1,2});/);
            const holidayRegExp = new RegExp(/n:(ph|we);/);
            const valueRegExp = new RegExp(/v:([^;]+);/);
            const shiftRegExp = new RegExp(/s:([^;]+);/);

            for (let i = 0; i < vevents.length; i++) {
                let isHoliday = false;

                let isInstance = (calendarIndex + 1 === calendars.length);

                const summaryOrig = vevents[i].getFirstPropertyValue("summary");
                let summary = {};

                let match = summaryOrig.match(dateRegExp);
                if (match && match.length > 1) {
                    summary.d = match[1];
                }

                match = summaryOrig.match(holidayRegExp);
                if (match && match.length > 1) {
                    summary.n = match[1];
                    isHoliday = true;
                }

                match = summaryOrig.match(valueRegExp);
                if (match && match.length > 1) {
                    summary.v = match[1];
                }

                match = summaryOrig.match(shiftRegExp);
                if (match && match.length > 1) {
                    summary.s = match[1];
                }

                const event = new ICAL.Event(vevents[i]);
                const eBegin = moment.tz(event.startDate.toJSDate(), tz.tzid);
                const eEnd = moment.tz(event.endDate.toJSDate(), tz.tzid);

                if (
                    (eBegin.isAfter(beginOfYear, 'day') || eBegin.isSame(beginOfYear, 'day')) &&
                    (eBegin.isBefore(endOfYear, 'day') || eBegin.isSame(endOfYear, 'day')) ||
                    (eEnd.isAfter(beginOfYear, 'day')) &&
                    (eEnd.isBefore(endOfYear, 'day') || eEnd.isSame(endOfYear, 'day'))
                ) {
                    let index = eBegin.format('YYYY-MM-DD');
                    if (eBegin.isSame(eEnd, 'day') || event.duration.toICALString() === 'P1D' && eBegin.format('HHmm') === '0000') {
                        if (!eIndex.events.hasOwnProperty(index)) {
                            eIndex.events[index] = [];
                        }
                        eIndex.events[index].push({isInstance, summary});
                    }
                    else {
                        eIndex.diapasons.push({
                            begin: eBegin.format('YYYY-MM-DD'),
                            end: eEnd.format('YYYY-MM-DD'),
                            summary
                        });

                        for (let d = eBegin; d.isBefore(eEnd, 'hour'); d.add(1, 'd')) {
                            let dIndex = eBegin.format('YYYY-MM-DD');

                            if (!eIndex.events.hasOwnProperty(dIndex)) {
                                eIndex.events[dIndex] = [];
                            }
                            eIndex.events[dIndex].push({isInstance, summary});
                        }
                    }

                    if (isHoliday) {
                        if (!eIndex.holidays.hasOwnProperty(index)) {
                            eIndex.holidays[index] = [];
                        }
                        eIndex.holidays[index].push(true);

                    }
                }
            }
        });

        const time2 = new Date().getTime();
        console.log('Calendar parsing time: ' + (time2-time1) + ' ms');

        return eIndex;
    }
});
