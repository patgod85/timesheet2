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
