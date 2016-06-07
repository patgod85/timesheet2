//noinspection JSFileReferences
import ICAL from 'npm:ical.js';
import moment from 'npm:moment-timezone';

export function updateDays(iCalData, value, days, events){

    var jCalData = ICAL.parse(iCalData);

    var comp = new ICAL.Component(jCalData);
    var vtz = comp.getFirstSubcomponent('vtimezone');
    var tz = new ICAL.Timezone(vtz);

    var packageFormat = new RegExp(/t2:(.+)/);
    var event;

    days.map(day => {
        if(events.events.hasOwnProperty(day.date) && events.events[day.date].some(item => item.isInstance)){

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
                        if(!isFound){
                            packageParts.unshift(value);
                        }
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

    return comp.toString();
}

export function clearData(iCalData, days, events){

    var jCalData = ICAL.parse(iCalData);

    var comp = new ICAL.Component(jCalData);
    var vtz = comp.getFirstSubcomponent('vtimezone');
    var tz = new ICAL.Timezone(vtz);

    var event;

    days.map(day => {
        if(events.events.hasOwnProperty(day.date) && events.events[day.date].some(item => item.isInstance)){

            var vevents = comp.getAllSubcomponents("vevent");
            for(var i = 0; i < vevents.length; i++){
                event = new ICAL.Event(vevents[i]);
                var index1 = moment.tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                var index2 = moment.tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                if(index1 === day.date && index2 === day.date){

                    comp.removeSubcomponent(vevents[i]);
                }
            }
        }
    });

    return comp.toString();
}

//noinspection JSUnusedGlobalSymbols
export function getEventsIndex(calendars, year){

    var eIndex = {events: {}, diapasons: {}, holidays: {}};

    if(!calendars){
        return eIndex;
    }

    if(!Array.isArray(calendars)){
        calendars = [calendars];
    }

    calendars.map(iCalData => {

        var jCalData = ICAL.parse(iCalData);

        var comp = new ICAL.Component(jCalData);
        var vevents = comp.getAllSubcomponents("vevent");

        var vtz = comp.getFirstSubcomponent('vtimezone');
        var tz = new ICAL.Timezone(vtz);

        var beginOfYear = moment().year(year).month(0).date(1).set({hour: 0, minute: 0, second: 0}).tz(tz.tzid);
        var endOfYear = moment().year(year).month(11).date(31).set({hour: 23, minute: 59, second: 59}).tz(tz.tzid);

        var dateRegExp = new RegExp(/d:(\d{1,2});/);
        var holidayRegExp = new RegExp(/n:(ph|we);/);
        var valueRegExp = new RegExp(/v:([^;]+);/);
        var shiftRegExp = new RegExp(/s:([^;]+);/);

        for(var i = 0; i < vevents.length; i++){
            var isHoliday = false;

            var isInstance = (i+1 === vevents.length);

            var summaryOrig = vevents[i].getFirstPropertyValue("summary");
            var summary = {};

            var match = summaryOrig.match(dateRegExp);
            if(match && match.length > 1){
                summary.d = match[1];
            }

            match = summaryOrig.match(holidayRegExp);
            if(match && match.length > 1){
                summary.n = match[1];
                isHoliday = true;
            }

            match = summaryOrig.match(valueRegExp);
            if(match && match.length > 1){
                summary.v = match[1];
            }

            match = summaryOrig.match(shiftRegExp);
            if(match && match.length > 1){
                summary.s = match[1];
            }

            var event = new ICAL.Event(vevents[i]);
            var eBegin = moment.tz(event.startDate.toJSDate(), tz.tzid);
            var eEnd = moment.tz(event.endDate.toJSDate(), tz.tzid);

            if(
                (eBegin.isAfter(beginOfYear, 'day') || eBegin.isSame(beginOfYear, 'day')) &&
                (eBegin.isBefore(endOfYear, 'day') || eBegin.isSame(endOfYear, 'day')) ||
                (eEnd.isAfter(beginOfYear, 'day')) &&
                (eEnd.isBefore(endOfYear, 'day') || eEnd.isSame(endOfYear, 'day'))
            ) {
                let index = eBegin.format('YYYY-MM-DD');
                if(eBegin.isSame(eEnd, 'day') || event.duration.toICALString() === 'P1D' && eBegin.format('HHmm') === '0000'){
                    if(!eIndex.events.hasOwnProperty(index)){
                        eIndex.events[index] = [];
                    }
                    eIndex.events[index].push({isInstance, summary});
                }
                else{
                    eIndex.diapasons.push({
                        begin: eBegin.format('YYYY-MM-DD'),
                        end: eEnd.format('YYYY-MM-DD'),
                        summary
                    });
                    for(let d = eBegin; d.isBefore(eEnd, 'hour'); d.add(1, 'd')){
                        if(!eIndex.events.hasOwnProperty(index)){
                            eIndex.events[index] = [];
                        }
                        eIndex.events[index].push({isInstance, summary});
                    }
                }

                if(isHoliday){
                    if(!eIndex.holidays.hasOwnProperty(index)){
                        eIndex.holidays[index] = [];
                    }
                    eIndex.holidays[index].push(true);

                }
            }
        }
    });

    return eIndex;
}
