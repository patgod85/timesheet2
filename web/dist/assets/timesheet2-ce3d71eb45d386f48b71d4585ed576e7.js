"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('timesheet2/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].RESTAdapter.extend({
        namespace: 'api',
        loadSaveResponse: true

        //handleResponse: function (status, headers, payload) {
        //    if (status == 422) {
        //    console.log(status, payload);
        //    }
        //    return this._super(...arguments);
        //}
    });
});
define('timesheet2/app', ['exports', 'ember', 'timesheet2/resolver', 'ember-load-initializers', 'timesheet2/config/environment'], function (exports, _ember, _timesheet2Resolver, _emberLoadInitializers, _timesheet2ConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _timesheet2ConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _timesheet2ConfigEnvironment['default'].podModulePrefix,
    Resolver: _timesheet2Resolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _timesheet2ConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('timesheet2/components/bootstrap-datepicker-inline', ['exports', 'ember', 'ember-cli-bootstrap-datepicker/components/bootstrap-datepicker-inline'], function (exports, _ember, _emberCliBootstrapDatepickerComponentsBootstrapDatepickerInline) {
  exports['default'] = _emberCliBootstrapDatepickerComponentsBootstrapDatepickerInline['default'];
});
define('timesheet2/components/bootstrap-datepicker', ['exports', 'ember', 'ember-cli-bootstrap-datepicker/components/bootstrap-datepicker'], function (exports, _ember, _emberCliBootstrapDatepickerComponentsBootstrapDatepicker) {
  exports['default'] = _emberCliBootstrapDatepickerComponentsBootstrapDatepicker['default'];
});
define('timesheet2/components/bread-crumbs', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        router: _ember['default'].inject.service('router'),

        willRender: function willRender() {
            var currentPath = this.get('router').get('currentPath');
            var url = this.get('router').get('url');
            //var currentPath = '123';
            //var url = '234234';

            var parts = url.split('/'),
                lastPart = parts[parts.length - 1];

            var crumbs = [{ title: 'Home', pathName: 'index' }];

            parts.filter(function (x) {
                return !!x;
            }).map(function (x) {
                if (x === currentPath) {
                    crumbs.push({ title: currentPath });
                } else if (x === lastPart) {
                    crumbs.push({ title: currentPath + ' (' + x + ')' });
                } else {
                    crumbs.push({ title: x, pathName: x });
                }
            });

            this.setProperties({ crumbs: crumbs });
        }
    });
});
define('timesheet2/components/calendar-actions', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        ical: _ember['default'].inject.service('ical'),

        pickValue: 1,

        pickGap: 1,

        pickQuantity: 5,

        actions: {
            setValue: function setValue() {
                var value = this.get('value');
                this.updateDays('v:' + value);
            },

            setNonworkingDay: function setNonworkingDay(eventId) {
                this.updateDays('n:' + eventId);
            },

            setEvent: function setEvent(eventId) {
                this.updateDays('d:' + eventId);
            },

            setShift: function setShift(eventId) {
                this.updateDays('s:' + eventId);
            },

            onClearAll: function onClearAll() {
                if (confirm('All data in selected dates will be removed. Are you sure?')) {
                    this.clearData();
                }
            },

            onUnpick: function onUnpick() {
                this.sendAction('onUnpick');
            },

            onPickWithAlgorithm: function onPickWithAlgorithm() {
                this.get('onPickWithAlgorithm')(this.get('pickValue'), this.get('pickGap'), this.get('pickQuantity'));
            }
        },

        clearData: function clearData() {
            var sections = this.get('sections');
            var self = this;
            var ical = this.get('ical');

            var promises = [];
            //function ga(){
            //console.log('ga-ga');
            //}
            sections.forEach(function (section) {

                var model = section.model,
                    days = section.days.toArray();

                if (days.length) {
                    var iCalData = model.get('calendar');

                    var updatedCalendar = ical.clearData(iCalData, days, model.events);

                    model.set('calendar', updatedCalendar);

                    promises.pushObject(model.save());
                }
            });

            _ember['default'].RSVP.hash(promises).then(function () {
                self.sendAction('onUpdate');
            })['catch'](function () {});
        },

        updateDays: function updateDays(value) {
            var ical = this.get('ical');
            var self = this;
            var sections = this.get('sections');
            var promises = [];

            sections.forEach(function (section) {

                var model = section.model,
                    days = section.days.toArray();

                if (days.length) {

                    var iCalData = model.get('calendar');

                    var updatedCalendar = ical.updateDays(iCalData, value, days.toArray(), model.events);

                    model.set('calendar', updatedCalendar);

                    promises.pushObject(model.save());
                }
            });

            _ember['default'].RSVP.hash(promises).then(function () {
                self.sendAction('onUpdate');
            })['catch'](function (err) {
                console.log(err);
            });
        }

    });
});
define('timesheet2/components/calendar-day', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'td',

        classNameBindings: ['isHoliday:holiday', 'doesBelongToOtherMonth:bg-danger', 'isChecked:bg-success', 'isWeekend:weekend'],

        isWeekend: _ember['default'].computed('date', function () {
            return this.get('isHeader') && [0, 6].indexOf(this.get('date').day()) > -1;
        }),

        doesBelongToOtherMonth: _ember['default'].computed('date', function () {
            return !this.get('isSingleMonth') && this.get('date').month() + 1 !== this.get('month');
        }),

        title: _ember['default'].computed('date', function () {
            return this.get('showNumbers') ? this.get('date').format('DD') : "";
        }),

        dayOfWeek: _ember['default'].computed('date', function () {
            return this.get('isHeader') ? this.get('date').format('dd') : "";
        }),

        actions: {
            click: function click(sectionId, day) {
                if (this.get('isHeader')) {
                    return;
                }

                this.get('onPickDate')(sectionId, {
                    date: day.format('YYYY-MM-DD'),
                    events: this.get('localEvents')
                });
            }

        }
    });
});
define('timesheet2/components/calendar-diapasons', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
    exports['default'] = _ember['default'].Component.extend({

        hidden: true,

        newType: 11,
        newBegin: null,
        newEnd: null,

        eventTypesNames: _ember['default'].computed('event_types', function () {
            return this.get('event_types').map(function (t) {
                return { id: parseInt(t.id, 10), title: t.get('name') };
            });
        }),

        actions: {

            removeDiapason: function removeDiapason(diapasonBegin, diapasonEnd) {
                if (confirm('Are you sure?')) {
                    var removeDiapasonAction = this.get('removeDiapasonAction');

                    if (typeof removeDiapasonAction === 'function') {
                        removeDiapasonAction(diapasonBegin, diapasonEnd);
                    }
                }
            },

            changeNewType: function changeNewType(id) {
                this.set('newType', id);
            },

            addDiapason: function addDiapason() {
                if (confirm('Are you sure?')) {
                    var addDiapasonAction = this.get('addDiapasonAction');

                    if (typeof addDiapasonAction === 'function') {
                        addDiapasonAction((0, _moment['default'])(this.get('newBegin')).format('YYYY-MM-DD'), (0, _moment['default'])(this.get('newEnd')).format('YYYY-MM-DD'), this.get('newType'));
                    }
                }
            },

            show: function show() {
                this.set('hidden', false);
            },

            hide: function hide() {
                this.set('hidden', true);
            }
        }
    });
});
define('timesheet2/components/calendar-month', ['exports', 'ember', 'moment', 'timesheet2/components/month-events'], function (exports, _ember, _moment, _timesheet2ComponentsMonthEvents) {
    exports['default'] = _ember['default'].Component.extend(_timesheet2ComponentsMonthEvents['default'], {

        weeks: null,

        init: function init() {
            this._super.apply(this, arguments);

            this.initWeeks();
        },

        daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],

        initWeeks: function initWeeks() {
            if (this.get('month') === 0) {
                this.set('year', this.get('year') - 1);
                this.set('month', 12);
            }
            if (this.get('month') === 13) {
                this.set('year', this.get('year') + 1);
                this.set('month', 1);
            }

            this.set('weeks', []);

            var firstDay = (0, _moment['default'])().year(this.get('year')).month(this.get('month') - 1).date(1);
            var weeks = this.get('weeks');
            var self = this;

            var events = this.get('model.events');

            var isLastWeek = false;
            var prevDate = 0;

            first_level_loop: for (var w = 0; w < 6; w++) {

                var week = [];

                for (var d = 1; d < 8; d++) {
                    firstDay.weekday(d);

                    var date = firstDay.date();
                    var index = firstDay.format('YYYY-MM-DD');
                    var momentDate = (0, _moment['default'])(firstDay);
                    week.pushObject(_ember['default'].Object.create({
                        date: momentDate,
                        index: index,
                        isChecked: false,
                        localEvents: self.getLocalEvents(momentDate, index, events),
                        isHoliday: self.isHoliday(index, events)
                    }));

                    if (w > 0 && date < prevDate) {
                        isLastWeek = true;

                        if (d === 1) {
                            break first_level_loop;
                        }
                    }

                    prevDate = date;
                }

                weeks.pushObject(week);

                if (isLastWeek) {
                    break;
                }
            }
        },

        monthName: _ember['default'].computed('month', function () {

            return (0, _moment['default'])().month(this.get('month') - 1).format('MMMM');
        }),

        eventsObserver: _ember['default'].observer('model.events', function () {
            var weeks = this.get('weeks');
            var events = this.get('model.events');
            var self = this;

            weeks.map(function (week) {
                week.map(function (day) {
                    var index = day.get('index');
                    var localEvents = self.getLocalEvents(day.get('date'), index, events);
                    if (JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)) {

                        day.set('localEvents', localEvents);
                        day.set('isHoliday', self.isHoliday(index, events));
                    }
                });
            });
        }),

        weeksObserver: _ember['default'].observer('checkedDates.[]', function () {
            var checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(function (o) {
                return o.date;
            }) : [];

            var weeks = this.get('weeks');

            weeks.forEach(function (days) {

                var previouslyChecked = days.filterBy('isChecked', true);

                previouslyChecked.forEach(function (day) {
                    day.set('isChecked', false);
                });

                checkedDates.forEach(function (date) {
                    var found = days.findBy('index', date);

                    if (found) {
                        found.set('isChecked', true);
                    }
                });
            });
        }),

        actions: {
            onPickDaysOfWeek: function onPickDaysOfWeek(year, sectionId, day) {
                this.get('onPickDaysOfWeek')(year, sectionId, day);
            }
        }
    });
});
define('timesheet2/components/calendar-with-actions', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
    exports['default'] = _ember['default'].Mixin.create({
        ical: _ember['default'].inject.service('ical'),

        events: _ember['default'].computed('calendars', 'year', 'month', 'monthNumbers', function () {

            var calendars = this.get('calendars');
            var ical = this.get('ical');

            return ical.getEventsIndex(calendars, this.get('year'));
        }),

        actions: {
            onPickDate: function onPickDate(sectionId, day) {
                var sections = this.get('monthSections');

                var foundSection = sections.findBy('sectionId', sectionId);

                if (!foundSection) {
                    return;
                }

                var days = foundSection.get('days');
                var foundDay = days.findBy('date', day.date);

                if (foundDay) {
                    days.removeObject(foundDay);
                } else {
                    days.pushObject(day);
                }
            },

            onUnpick: function onUnpick() {
                var sections = this.get('monthSections');
                sections.forEach(function (section) {
                    section.set('days', []);
                });
            },

            onUpdate: function onUpdate() {
                this.sendAction('refreshAction');
            },

            onPickDaysOfWeek: function onPickDaysOfWeek(year, sectionId, dayNumber) {
                var sections = this.get('monthSections');

                var foundSection = sections.findBy('sectionId', sectionId);

                if (!foundSection) {
                    return;
                }

                var days = foundSection.get('days');

                var monday = (0, _moment['default'])().year(year).month(foundSection.get('month') - 1).startOf('month').day(dayNumber);

                if (monday.date() > 7) {
                    monday.add(7, 'd');
                }

                var month = monday.month();
                while (month === monday.month()) {
                    var format = monday.format('YYYY-MM-DD');
                    days.pushObject({ date: format, events: {} });
                    monday.add(7, 'd');
                }
            },

            onPickWithAlgorithm: function onPickWithAlgorithm(value, gap, quantity) {
                var sections = this.get('monthSections');

                if (!sections) {
                    return;
                }

                var selectedSection = sections[0];
                var selectedSectionId = 0;
                var selectedDays = selectedSection.get('days');
                var lastPickedDay = (0, _moment['default'])().year(selectedSection.get('year')).month(selectedSection.get('month') - 1).startOf('month');

                sections.map(function (section, sectionIndex) {
                    var days = section.get('days');
                    if (days.length) {
                        var dates = days.map(function (d) {
                            return d.date;
                        }).sort();
                        lastPickedDay = dates[dates.length - 1];
                        selectedDays = days;
                        selectedSectionId = sectionIndex;
                    }
                });

                if (!lastPickedDay) {
                    return;
                }

                var lastPickedMoment = (0, _moment['default'])(lastPickedDay, 'YYYY-MM-DD');

                first_level_loop: for (var i = 0; i < quantity; i++) {
                    for (var j = 0; j < value; j++) {

                        var sectionMonthNumber = sections[selectedSectionId].get('month') - 1;
                        if (lastPickedMoment.month() > sectionMonthNumber) {
                            if (selectedSectionId >= sections.length - 1) {
                                break first_level_loop;
                            }

                            selectedSectionId++;
                            selectedDays = sections[selectedSectionId].get('days');
                        }

                        var format = lastPickedMoment.format('YYYY-MM-DD');
                        selectedDays.pushObject({ date: format, events: {} });
                        lastPickedMoment.add(1, 'd');
                    }

                    lastPickedMoment.add(gap, 'd');
                }
            }
        }

    });
});
define('timesheet2/components/calendar-year', ['exports', 'ember', 'timesheet2/components/calendar-with-actions'], function (exports, _ember, _timesheet2ComponentsCalendarWithActions) {
    exports['default'] = _ember['default'].Component.extend(_timesheet2ComponentsCalendarWithActions['default'], {

        ical: _ember['default'].inject.service('ical'),

        year: 0,

        monthSections: _ember['default'].computed('model.calendars', 'year', 'month', function () {

            var year = parseInt(this.get('year'), 10);
            var monthSections = _ember['default'].A([]);
            var ical = this.get('ical');
            var month = parseInt(this.get('month'), 10) - 1;

            var model = this.get('model');

            model.set('events', ical.getEventsIndex(model.calendars, year));

            monthSections.pushObjects([_ember['default'].Object.create({
                sectionId: 0,
                month: month,
                days: [],
                model: model,
                year: year
            }), _ember['default'].Object.create({
                sectionId: 1,
                month: month + 1,
                days: [],
                model: model,
                year: year
            }), _ember['default'].Object.create({
                sectionId: 2,
                month: month + 2,
                days: [],
                model: model,
                year: year
            })]);
            // monthSections.map(section => {
            //     section.set('model', model);
            // });
            return monthSections;
        }),

        selectedMonth: _ember['default'].computed('month', function () {
            var number = parseInt(this.get('month'), 10);
            return number - 1;
        }),

        selectedYear: _ember['default'].computed('year', function () {
            return parseInt(this.get('year'), 10);
        }),

        months: _ember['default'].computed(function () {

            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            function getName(i) {
                if (i === -1) {
                    return monthNames[11];
                }
                if (i === 12) {
                    return monthNames[0];
                }
                return monthNames[i];
            }

            var months = [];

            for (var i = 0; i < 12; i++) {
                months.push({
                    id: i,
                    title: getName(i - 1) + ' - ' + getName(i) + ' - ' + getName(i + 1)
                });
            }

            return months;
        }),

        years: _ember['default'].computed(function () {
            return [{ id: 2014, title: 2014 }, { id: 2015, title: 2015 }, { id: 2016, title: 2016 }, { id: 2017, title: 2017 }, { id: 2018, title: 2018 }];
        }),

        actions: {

            changeYear: function changeYear(selected) {

                var changeMonthAction = this.get('changeMonthAction');
                changeMonthAction(selected.id, this.get('month'));
            },

            changeMonth: function changeMonth(selected) {

                var changeMonthAction = this.get('changeMonthAction');
                changeMonthAction(this.get('year'), selected.id + 1);
            }
        }
    });
});
define('timesheet2/components/drop-down', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'span',
        content: null,
        selectedValue: null,

        init: function init() {
            this._super.apply(this, arguments);
            if (!this.get('content')) {
                this.set('content', []);
            }
        },

        actions: {
            change: function change() {
                var changeAction = this.get('onChange');
                var selectedEl = this.$('select')[0];
                var selectedIndex = selectedEl.selectedIndex;
                var content = this.get('content');
                var selectedValue = content[selectedIndex];
                //console.log(this, this.get('action'), selectedIndex, content, selectedValue);
                this.set('selectedValue', selectedValue);
                changeAction(selectedValue);
            }
        }
    });
});
define('timesheet2/components/employee-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        actions: {
            submit: function submit(model) {
                model.save()['catch'](this.get('error-handler').handle);
            }
        }
    });
});
define('timesheet2/components/employee-report', ['exports', 'ember', 'npm:moment-timezone'], function (exports, _ember, _npmMomentTimezone) {
    exports['default'] = _ember['default'].Component.extend({
        ical: _ember['default'].inject.service('ical'),

        model: {
            report_from: (0, _npmMomentTimezone['default'])({ year: 2016, month: 0, day: 2 }).toDate(),
            report_to: (0, _npmMomentTimezone['default'])({ year: 2016, month: 0, day: 18 }).toDate()
        },

        report: {
            w: 0,
            n: 0,
            ot: 0,
            other: []
        },

        actions: {

            getReport: function getReport(employee, events, reportFrom, reportTo) {
                var ical = this.get('ical');
                reportFrom = (0, _npmMomentTimezone['default'])(reportFrom);
                reportTo = (0, _npmMomentTimezone['default'])(reportTo);
                var today = (0, _npmMomentTimezone['default'])();

                var eIndex = ical.getEventsIndex(employee.calendars, reportFrom.year());
                var report = {
                    w: 0,
                    n: 0,
                    ot: 0,
                    other: []
                };

                for (var i = (0, _npmMomentTimezone['default'])(reportFrom); i.isSameOrBefore(reportTo) && i.isSameOrBefore(today); i.add(1, 'd')) {
                    var index = i.format('YYYY-MM-DD');

                    if (eIndex.events.hasOwnProperty(index)) {
                        for (var j = 0; j < eIndex.events[index].length; j++) {

                            if (eIndex.events[index][j].hasOwnProperty('summary')) {
                                var summary = eIndex.events[index][j].summary;
                                var d = summary.hasOwnProperty('d') ? parseInt(summary.d) : 0;

                                if (summary.hasOwnProperty('n') && [7, 8].indexOf(d) === -1 || d === 3) {
                                    report.n++;
                                }
                                if (d > 0) {
                                    if ([4, 7, 8].indexOf(d) !== -1) {
                                        report.w++;

                                        if (d === 7) {
                                            report.w++;
                                        }

                                        if (d === 8) {
                                            report.ot++;
                                        }
                                    } else if (d === 1) {
                                        report.ot--;
                                    } else {
                                        if (!report.hasOwnProperty(d)) {
                                            report[d] = 0;
                                        }
                                        report[d]++;
                                    }
                                }
                            }
                        }
                    } else {
                        report.w++;
                    }
                }

                events.map(function (event) {
                    //console.log(event.id, report[event.id]);
                    if (report.hasOwnProperty(event.id)) {
                        report.other.push({
                            event: event,
                            value: report[event.id]
                        });
                    }
                });

                this.set('report', report);
            }
        }
    });
});
define('timesheet2/components/filtered-list', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        filterToken: null,
        items: [],

        actions: {
            select: function select(selected) {

                this.set('filterToken', selected);
            }
        },

        filterWithAll: _ember['default'].computed('filter', function () {
            var filter = this.get('filter');

            filter.unshift({ id: 'all', title: 'All' });

            return filter;
        }),

        filteredItems: _ember['default'].computed('filterToken', function () {
            var filterToken = this.get('filterToken');

            if (!filterToken || filterToken.id === 'all') {
                return this.get('items');
            }

            var index = this.get('id');
            return this.get('items').filter(function (item) {
                return item.get(index) + '' === filterToken.id + '';
            });
        })
    });
});
define('timesheet2/components/horizontal-month', ['exports', 'ember', 'moment', 'timesheet2/components/month-events'], function (exports, _ember, _moment, _timesheet2ComponentsMonthEvents) {
    exports['default'] = _ember['default'].Component.extend(_timesheet2ComponentsMonthEvents['default'], {
        days: null,

        init: function init() {
            this._super.apply(this, arguments);

            this.initDays();
        },

        initDays: function initDays() {
            var self = this;
            var year = this.get('year');
            var month = this.get('month');
            this.set('days', _ember['default'].A([]));
            var days = this.get('days');
            var model = this.get('model');
            days.clear();

            for (var i = (0, _moment['default'])({ year: year, month: month, date: 1 }); i.month() === month; i.add(1, 'd')) {

                var momentDate = (0, _moment['default'])(i);
                var index = i.format('YYYY-MM-DD');
                days.pushObject(_ember['default'].Object.create({
                    date: momentDate,
                    index: index,
                    isChecked: false,
                    localEvents: self.getLocalEvents(momentDate, index, model.get('events')),
                    isHoliday: self.isHoliday(index, model.get('events'))
                }));
            }
        },

        calendarObserver: _ember['default'].observer('model.events', function () {
            var self = this;
            var days = this.get('days');
            var model = this.get('model');

            days.forEach(function (day) {

                var index = day.get('index');
                var localEvents = self.getLocalEvents(day.get('date'), index, model.events);
                if (JSON.stringify(day.get('localEvents')) !== JSON.stringify(localEvents)) {

                    day.set('localEvents', localEvents);
                    day.set('isHoliday', self.isHoliday(index, model.events));
                }
            });
        }),

        observeMonthChange: _ember['default'].observer('month', 'year', function () {
            this.initDays();
        }),

        observeCheckedDates: _ember['default'].observer('checkedDates.[]', function () {
            var checkedDates = this.get('checkedDates') ? this.get('checkedDates').map(function (o) {
                return o.date;
            }) : [];

            var days = this.get('days');

            var previouslyChecked = days.filterBy('isChecked', true);

            previouslyChecked.forEach(function (day) {
                day.set('isChecked', false);
            });

            checkedDates.forEach(function (date) {
                var found = days.findBy('index', date);

                if (found) {
                    found.set('isChecked', true);
                }
            });
        })
    });
});
define('timesheet2/components/ivy-tab-list', ['exports', 'ivy-tabs/components/ivy-tab-list'], function (exports, _ivyTabsComponentsIvyTabList) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _ivyTabsComponentsIvyTabList['default'];
    }
  });
});
define('timesheet2/components/ivy-tab-panel', ['exports', 'ivy-tabs/components/ivy-tab-panel'], function (exports, _ivyTabsComponentsIvyTabPanel) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _ivyTabsComponentsIvyTabPanel['default'];
    }
  });
});
define('timesheet2/components/ivy-tab', ['exports', 'ivy-tabs/components/ivy-tab'], function (exports, _ivyTabsComponentsIvyTab) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _ivyTabsComponentsIvyTab['default'];
    }
  });
});
define('timesheet2/components/ivy-tabs', ['exports', 'ivy-tabs/components/ivy-tabs'], function (exports, _ivyTabsComponentsIvyTabs) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _ivyTabsComponentsIvyTabs['default'];
    }
  });
});
define('timesheet2/components/menu-bar', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('timesheet2/components/month-events', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
    exports['default'] = _ember['default'].Mixin.create({

        isHoliday: function isHoliday(index, events) {
            return events.holidays.hasOwnProperty(index) && events.holidays[index];
        },

        getLocalEvents: function getLocalEvents(date, index, events) {
            if (this.get('isHeader') || this.get('nonWorkingOnly')) {
                return [];
            }
            var today = (0, _moment['default'])().hour(23).minute(59).second(59);

            var localEvents = events.events.hasOwnProperty(index) ? events.events[index] : [];

            if (localEvents.length === 0) {
                if (date.isAfter(today)) {
                    //localEvents.push({summary: {v: "---"}});
                } else {
                        localEvents.push({ summary: { v: 1 } });
                    }
            }

            return localEvents;
        }
    });
});
define('timesheet2/components/nav-tabs', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        router: _ember['default'].inject.service('router'),

        clicks: null,

        currentPath: null,

        init: function init() {
            this._super.apply(this, arguments);
            this.set('clicks', 0);
            this.set('currentPath', this.get('router').get('currentPath'));
        },

        localTabs: _ember['default'].computed('tabs', 'clicks', 'currentPath', function () {

            var tabs = this.get('tabs');
            var currentPath = this.get('currentPath');

            if (!tabs) {
                return [];
            }

            return tabs.map(function (t) {
                var tab = _ember['default'].Object.create(t);
                tab.set('className', tab.get('route') === currentPath ? 'active' : '');
                return tab;
            });
        }),

        actions: {
            onTransition: function onTransition() {
                var self = this;
                var tryingCount = 0;
                var interval = undefined;

                function intervalFunction() {
                    var currentPath = self.get('currentPath');
                    var realPath = self.get('router').get('currentPath');
                    if (currentPath !== realPath) {
                        self.set('currentPath', realPath);
                        clearInterval(interval);
                    } else if (tryingCount++ > 10) {
                        clearInterval(interval);
                    }
                }

                interval = setInterval(intervalFunction, 100);
            }
        }
    });
});
define('timesheet2/components/new-user-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        newUser: null,

        store: _ember['default'].inject.service('store'),

        teamNames: _ember['default'].computed.map('teams', function (team) {
            return {
                id: team.get('id'),
                title: team.get('name')
            };
        }),

        init: function init() {
            this._super.apply(this, arguments);

            this.set('newUser', _ember['default'].Object.create({
                email: '',
                plainPassword: '',
                name: '',
                surname: '',
                username: '',
                teamId: this.get('user').teamId,
                roles: ['ROLE_USER'],
                enabled: true
            }));
        },

        actions: {
            changeTeam: function changeTeam(newValue) {
                this.get('newUser').set('teamId', parseInt(newValue.id, 10));
            },

            submit: function submit(newUser) {
                var _this = this;

                var self = this;

                var store = this.get('store');
                var user = store.createRecord('user', JSON.parse(JSON.stringify(newUser)));

                user.save().then(function (createdUser) {
                    alert('The user successfully created');
                    var router = self.get('router');
                    router.transitionTo('users.user', createdUser);
                })['catch'](function (err) {
                    user.deleteRecord();
                    _this.get('error-handler').handle(err);
                });
            }
        }
    });
});
define('timesheet2/components/team-month', ['exports', 'ember', 'timesheet2/components/calendar-with-actions'], function (exports, _ember, _timesheet2ComponentsCalendarWithActions) {
    exports['default'] = _ember['default'].Component.extend(_timesheet2ComponentsCalendarWithActions['default'], {
        ical: _ember['default'].inject.service('ical'),

        teamWithEvents: null,

        monthSections: null,

        crc: null,

        emptyArray: [],

        init: function init() {
            this._super.apply(this, arguments);

            this.set('monthSections', _ember['default'].A([]));

            this.initMonthSections();
        },

        initMonthSections: function initMonthSections() {

            var ical = this.get('ical');
            var monthSections = this.get('monthSections');
            monthSections.clear();

            var year = this.get('year');
            var month = this.get('month');
            var team = this.get('team');
            var employees = team.get('employees');

            team.set('events', ical.getEventsIndex(team.calendars, year));

            this.set('crc', []);
            var crc = this.get('crc');

            var sectionId = 1;
            employees.forEach(function (employee) {

                employee.set('events', ical.getEventsIndex(employee.calendars, year));

                crc.pushObject(_ember['default'].Object.create({
                    employee_id: employee.id,
                    crc: employee.crc
                }));

                monthSections.pushObject(_ember['default'].Object.create({
                    sectionId: sectionId++,
                    month: month,
                    days: [],
                    model: employee,
                    employee_id: employee.id,
                    year: year
                }));
            });
        },

        calendarObserver: _ember['default'].observer('team.employeesCalendarsCrc', function () {
            var ical = this.get('ical');
            var crc = this.get('crc');

            var year = this.get('year');
            var team = this.get('team');
            var employees = team.get('employees');

            var monthSections = this.get('monthSections');

            employees.forEach(function (employee) {

                var found = monthSections.findBy('employee_id', employee.id);
                var foundCrc = crc.findBy('employee_id', employee.id);

                if (found && foundCrc) {
                    var model = found.get('model');

                    if (model.get('crc') !== foundCrc.get('crc')) {
                        model.set('events', ical.getEventsIndex(employee.calendars, year));
                    }
                }
            });
        }),

        observeMonthChange: _ember['default'].observer('month', 'year', function () {
            this.initMonthSections();
        }),

        months: _ember['default'].computed(function () {

            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var index = 0;

            return monthNames.map(function (name) {
                return { id: index++, title: name };
            });
        }),

        years: _ember['default'].computed(function () {
            return [{ id: 2014, title: 2014 }, { id: 2015, title: 2015 }, { id: 2016, title: 2016 }, { id: 2017, title: 2017 }, { id: 2018, title: 2018 }];
        }),

        actions: {
            changeYear: function changeYear(selected) {

                var changeMonthAction = this.get('changeMonthAction');
                changeMonthAction(selected.id, this.get('month'));
            },

            changeMonth: function changeMonth(selected) {

                var changeMonthAction = this.get('changeMonthAction');
                changeMonthAction(this.get('year'), selected.id + 1);
            }
        },

        selectedMonth: _ember['default'].computed('month', function () {
            var number = parseInt(this.get('month'), 10);
            return number - 1;
        }),

        selectedYear: _ember['default'].computed('year', function () {
            return parseInt(this.get('year'), 10);
        })
    });
});
define('timesheet2/components/user-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        enabledDisabled: [{ id: false, title: 'Disabled' }, { id: true, title: 'Enabled' }],

        actions: {
            submit: function submit(model) {
                model.save()['catch'](this.get('error-handler').handle);
            },

            changeStatus: function changeStatus(newValue) {
                this.get('user').set('enabled', newValue.id);
            },

            addRole: function addRole(model, newRole) {
                var self = this;
                var roles = model.get('roles');
                var previousRoles = roles.slice();
                roles.push(newRole);
                model.set('roles', roles);
                model.save()['catch'](function (err) {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
            },

            deleteRole: function deleteRole(model, _role) {
                var self = this;
                var roles = model.get('roles');
                var previousRoles = roles.slice();
                model.set('roles', roles.filter(function (role) {
                    return role !== _role;
                }));
                model.save()['catch'](function (err) {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
            },

            deleteUser: function deleteUser(model) {
                var self = this;
                if (confirm('You try to completely remove the user. Are you sure?')) {
                    model.destroyRecord().then(function () {
                        self.get('router').transitionTo('users');
                    })['catch'](this.get('error-handler').handle);
                }
            }
        } });
});
define('timesheet2/controllers/calendar-controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        queryParams: ['y', 'm'],

        y: 0,
        m: 0,

        localStorage: _ember['default'].inject.service(),

        year: _ember['default'].computed('y', function () {
            var previousOptions = this.get('localStorage').getCalendarOptions();

            var y = this.get('y');

            if (!y) {
                y = previousOptions.year;
                this.set('y', y);
            } else {

                this.get('localStorage').setCalendarOptions({ year: y });
            }

            return y;
        }),

        month: _ember['default'].computed('m', function () {
            return this.getMonth();
        }),

        getMonth: function getMonth() {
            var previousOptions = this.get('localStorage').getCalendarOptions();

            var m = this.get('m');

            if (!m) {
                m = previousOptions.month;
                this.set('m', m);
            } else {
                this.get('localStorage').setCalendarOptions({ month: m });
            }

            return m;
        },

        actions: {

            changeMonth: function changeMonth(year, month) {
                this.get('localStorage').setCalendarOptions({ year: year, month: month });

                this.set('m', month);
                this.set('y', year);
            }

        }
    });
});
define('timesheet2/controllers/calendar', ['exports', 'ember', 'timesheet2/controllers/calendar-controller'], function (exports, _ember, _timesheet2ControllersCalendarController) {
    exports['default'] = _timesheet2ControllersCalendarController['default'].extend({

        calendars: _ember['default'].computed('model', function () {
            console.log('123', this.get('model'));

            return [this.get('model').get('calendar')];
        })
    });
});
define('timesheet2/controllers/employee/calendar', ['exports', 'timesheet2/controllers/calendar-controller', 'ember'], function (exports, _timesheet2ControllersCalendarController, _ember) {
    exports['default'] = _timesheet2ControllersCalendarController['default'].extend({

        ical: _ember['default'].inject.service('ical'),

        actions: {
            removeDiapason: function removeDiapason(begin, end) {
                var self = this;
                var ical = this.get('ical');

                var promises = [];

                var model = this.get('model').employee;

                var iCalData = model.get('calendar');

                var updatedCalendar = ical.removeDiapason(iCalData, model.events, begin, end);

                model.set('calendar', updatedCalendar);

                promises.pushObject(model.save());

                _ember['default'].RSVP.hash(promises).then(function () {
                    self.send('refresh');
                })['catch'](function () {});
            },

            addDiapason: function addDiapason(begin, end, type) {
                var self = this;
                var ical = this.get('ical');

                var promises = [];

                var model = this.get('model').employee;

                var iCalData = model.get('calendar');

                var updatedCalendar = ical.addDiapason(iCalData, model.events, begin, end, type);

                model.set('calendar', updatedCalendar);

                promises.pushObject(model.save());

                _ember['default'].RSVP.hash(promises).then(function () {
                    self.send('refresh');
                })['catch'](function () {});
            }
        }
    });
});
define('timesheet2/controllers/employee/compensatory-leave', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        actions: {

            onSave: function onSave(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/controllers/employee/compensatory-leaves', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({

        store: _ember['default'].inject.service('store'),

        newDate: null,
        newDescription: "Why the extra leave should be added",
        newValue: 1,

        actions: {
            onRemove: function onRemove(leave) {
                if (confirm("Are you sure?")) {
                    leave.destroyRecord();
                }
            },

            onAdd: function onAdd() {
                var _this = this;

                var store = this.get('store');

                var newLeave = store.createRecord('compensatory-leave', {
                    date: this.get('newDate'),
                    description: this.get('newDescription'),
                    value: this.get('newValue'),
                    employeeId: this.get('model').employee.id,
                    employee: this.get('model').employee
                });

                newLeave.save().then(function () {
                    alert('The leave is successfully created');
                })['catch'](function (err) {
                    newLeave.destroyRecord();
                    _this.get('error-handler').handle(err);
                });
            }
        }
    });
});
define('timesheet2/controllers/team/calendar', ['exports', 'timesheet2/controllers/calendar-controller'], function (exports, _timesheet2ControllersCalendarController) {
  exports['default'] = _timesheet2ControllersCalendarController['default'].extend({});
});
define('timesheet2/controllers/team/employees', ['exports', 'ember', 'timesheet2/controllers/calendar-controller'], function (exports, _ember, _timesheet2ControllersCalendarController) {
    exports['default'] = _timesheet2ControllersCalendarController['default'].extend({
        month: _ember['default'].computed('m', function () {
            var m = this.getMonth();

            return Number(m) - 1;
        })

    });
});
define('timesheet2/helpers/app-version', ['exports', 'ember', 'timesheet2/config/environment'], function (exports, _ember, _timesheet2ConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _timesheet2ConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('timesheet2/helpers/inc', ['exports', 'ember'], function (exports, _ember) {
  exports.inc = inc;

  function inc(n) {
    return parseInt(n, 10) + 1;
  }

  exports['default'] = _ember['default'].Helper.helper(inc);
});
define("timesheet2/helpers/is-equal", ["exports", "ember"], function (exports, _ember) {
    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

    exports.isEqual = isEqual;

    function isEqual(_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var leftSide = _ref2[0];
        var rightSide = _ref2[1];

        return leftSide === rightSide;
    }

    exports["default"] = _ember["default"].Helper.helper(isEqual);
});
define('timesheet2/helpers/is-selected', ['exports', 'ember'], function (exports, _ember) {
    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    exports.isSelected = isSelected;

    function isSelected(_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var item = _ref2[0];
        var selectedValue = _ref2[1];

        return item === selectedValue || item.id === selectedValue;
    }

    exports['default'] = _ember['default'].Helper.helper(isSelected);
});
define('timesheet2/helpers/json', ['exports', 'ember'], function (exports, _ember) {
    exports.json = json;

    function json(params /*, hash*/) {
        return JSON.stringify(params);
    }

    exports['default'] = _ember['default'].Helper.helper(json);
});
define('timesheet2/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _emberMomentHelpersMomentCalendar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentCalendar['default'];
    }
  });
  Object.defineProperty(exports, 'momentCalendar', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentCalendar.momentCalendar;
    }
  });
});
define('timesheet2/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('timesheet2/helpers/moment-format', ['exports', 'ember', 'timesheet2/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _timesheet2ConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_timesheet2ConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('timesheet2/helpers/moment-from-now', ['exports', 'ember', 'timesheet2/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _timesheet2ConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_timesheet2ConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('timesheet2/helpers/moment-to-now', ['exports', 'ember', 'timesheet2/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _timesheet2ConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_timesheet2ConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('timesheet2/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('timesheet2/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('timesheet2/helpers/sum', ['exports', 'ember'], function (exports, _ember) {
    exports.sum = sum;

    function sum(params /*, hash*/) {
        if (!Array.isArray(params)) {
            return params;
        }

        var result = 0;
        params.map(function (item) {
            result += item;
        });
        return result;
    }

    exports['default'] = _ember['default'].Helper.helper(sum);
});
define('timesheet2/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'timesheet2/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _timesheet2ConfigEnvironment) {
  var _config$APP = _timesheet2ConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('timesheet2/initializers/component-router-injector', ['exports'], function (exports) {
    exports.initialize = initialize;

    function initialize(application) {
        // Injects all Ember components with a router object:
        application.inject('component', 'router', 'router:main');
        application.inject('route', 'error-handler', 'service:error-handler');
        application.inject('component', 'error-handler', 'service:error-handler');
    }

    exports['default'] = {
        name: 'component-router-injector',
        initialize: initialize
    };
});
define('timesheet2/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('timesheet2/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('timesheet2/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('timesheet2/initializers/export-application-global', ['exports', 'ember', 'timesheet2/config/environment'], function (exports, _ember, _timesheet2ConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_timesheet2ConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _timesheet2ConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_timesheet2ConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('timesheet2/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('timesheet2/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('timesheet2/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("timesheet2/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('timesheet2/mirage/config', ['exports'], function (exports) {
    exports['default'] = function () {

        this.get('/rentals', function () {
            return {
                data: [{
                    type: 'rentals',
                    id: 1,
                    attributes: {
                        title: 'Grand Old Mansion 2',
                        owner: 'Veruca Salt',
                        city: 'San Francisco',
                        type: 'Estate',
                        bedrooms: 15,
                        image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
                    }
                }, {
                    type: 'rentals',
                    id: 2,
                    attributes: {
                        title: 'Urban Living',
                        owner: 'Mike Teavee',
                        city: 'Seattle',
                        type: 'Condo',
                        bedrooms: 1,
                        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg'
                    }
                }, {
                    type: 'rentals',
                    id: 3,
                    attributes: {
                        title: 'Downtown Charm',
                        owner: 'Violet Beauregarde',
                        city: 'Portland',
                        type: 'Apartment',
                        bedrooms: 3,
                        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg'
                    }
                }]
            };
        });
        // These comments are here to help you get started. Feel free to delete them.

        /*
         Config (with defaults).
          Note: these only affect routes defined *after* them!
         */
        // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
        // this.namespace = '';    // make this `api`, for example, if your API is namespaced
        // this.timing = 400;      // delay for each request, automatically set to 0 during testing

        /*
         Route shorthand cheatsheet
         */
        /*
         GET shorthands
          // Collections
         this.get('/contacts');
         this.get('/contacts', 'users');
         this.get('/contacts', ['contacts', 'addresses']);
          // Single objects
         this.get('/contacts/:id');
         this.get('/contacts/:id', 'user');
         this.get('/contacts/:id', ['contact', 'addresses']);
         */

        /*
         POST shorthands
          this.post('/contacts');
         this.post('/contacts', 'user'); // specify the type of resource to be created
         */

        /*
         PUT shorthands
          this.put('/contacts/:id');
         this.put('/contacts/:id', 'user'); // specify the type of resource to be updated
         */

        /*
         DELETE shorthands
          this.del('/contacts/:id');
         this.del('/contacts/:id', 'user'); // specify the type of resource to be deleted
          // Single object + related resources. Make sure parent resource is first.
         this.del('/contacts/:id', ['contact', 'addresses']);
         */

        /*
         Function fallback. Manipulate data in the db via
          - db.{collection}
         - db.{collection}.find(id)
         - db.{collection}.where(query)
         - db.{collection}.update(target, attrs)
         - db.{collection}.remove(target)
          // Example: return a single object with related models
         this.get('/contacts/:id', function(db, request) {
         var contactId = +request.params.id;
          return {
         contact: db.contacts.find(contactId),
         addresses: db.addresses.where({contact_id: contactId})
         };
         });
          */
    };

    /*
     You can optionally export a config that is only loaded during tests
     export function testConfig() {
    
     }
     */
});
define('timesheet2/mirage/factories/contact', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  exports['default'] = _emberCliMirage['default'].Factory.extend({
    // name: 'Pete',                         // strings
    // age: 20,                              // numbers
    // tall: true,                           // booleans

    // email: function(i) {                  // and functions
    //   return 'person' + i + '@test.com';
    // },

    // firstName: faker.name.firstName,       // using faker
    // lastName: faker.name.firstName,
    // zipCode: faker.address.zipCode
  });
});
/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
/*, {faker} */
define("timesheet2/mirage/scenarios/default", ["exports"], function (exports) {
  exports["default"] = function () /* server */{

    // Seed your development database using your factories. This
    // data will not be loaded in your tests.

    // server.createList('contact', 10);
  };
});
define('timesheet2/models/calendar', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        isDefault: _emberData['default'].attr(),
        calendar: _emberData['default'].attr()
    });
});
define('timesheet2/models/compensatory-leave', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        date: _emberData['default'].attr('datephp', {
            defaultValue: function defaultValue() {
                return null;
            }
        }),
        description: _emberData['default'].attr(),
        value: _emberData['default'].attr('number'),
        employeeId: _emberData['default'].attr('number'),

        employee: _emberData['default'].belongsTo('employee', { inverse: 'compensatoryLeaves' })

    });
});
define('timesheet2/models/employee', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr(),
        surname: _emberData['default'].attr(),
        workStart: _emberData['default'].attr('datephp', {
            defaultValue: function defaultValue() {
                return null;
            }
        }),
        workEnd: _emberData['default'].attr('datephp', {
            defaultValue: function defaultValue() {
                return null;
            }
        }),
        position: _emberData['default'].attr(),
        teamId: _emberData['default'].attr('number'),
        team: _emberData['default'].belongsTo('team', { inverse: 'employees' }),
        calendar: _emberData['default'].attr(),

        full_name: _ember['default'].computed('name', 'surname', function () {
            return this.get('name') + ' ' + this.get('surname');
        }),

        compensatoryLeaves: _emberData['default'].hasMany('compensatory-leave', { inverse: 'employee' })

    });
});
define('timesheet2/models/event', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr(),
        code: _emberData['default'].attr(),
        title: _emberData['default'].attr(),
        color: _emberData['default'].attr(),
        backgroundColor: _emberData['default'].attr()

    });
});
define('timesheet2/models/team', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        name: _emberData['default'].attr(),
        code: _emberData['default'].attr(),
        users: _emberData['default'].hasMany('user', { inverse: 'team' }),
        employees: _emberData['default'].hasMany('employee', { inverse: 'team' }),
        calendar: _emberData['default'].attr(),
        isGeneralCalendarEnabled: _emberData['default'].attr()

    });
});
define('timesheet2/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        email: _emberData['default'].attr(),
        username: _emberData['default'].attr(),
        name: _emberData['default'].attr(),
        surname: _emberData['default'].attr(),
        plainPassword: _emberData['default'].attr(),
        roles: _emberData['default'].attr(),
        teamId: _emberData['default'].attr('number'),
        team: _emberData['default'].belongsTo('team', { inverse: 'users' }),
        theHeaviestRole: _emberData['default'].attr(),
        enabled: _emberData['default'].attr()
    });
});
define('timesheet2/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('timesheet2/router', ['exports', 'ember', 'timesheet2/config/environment'], function (exports, _ember, _timesheet2ConfigEnvironment) {

    var Router = _ember['default'].Router.extend({
        location: _timesheet2ConfigEnvironment['default'].locationType,
        rootURL: _timesheet2ConfigEnvironment['default'].rootURL
    });

    Router.map(function () {
        this.route('about');
        this.route('contact');
        this.route('calendar');

        this.route('users', function () {
            this.route('new');
            this.route('user', { path: ':user_id' });
        });

        this.route('teams');
        this.route('team', { path: 'teams/:team_id' }, function () {

            this.route('employees', { path: 'employees' });
            this.route('calendar', { path: 'calendar' });
            this.route('users', { path: 'users' });
            this.route('details', { path: 'details' });
        });

        this.route('employees', { path: "employees" });
        this.route('employee', { path: 'employees/:employee_id' }, function () {

            this.route('details', { path: 'details' });
            this.route('calendar', { path: 'calendar' }, function () {
                this.route('report', { path: 'report' });
            });
            this.route('compensatory-leaves', { path: 'compensatory-leaves' });
            this.route('compensatory-leave', { path: 'compensatory-leaves/:id' });
        });

        this.route('events');
        this.route('event', { path: 'events/:event_id' });
        this.route('unauthorized');
        this.route('my');
    });

    exports['default'] = Router;
});
define('timesheet2/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('timesheet2/routes/application', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        ajax: _ember['default'].inject.service(),
        rolesService: _ember['default'].inject.service('roles'),

        model: function model() {
            var self = this;

            return _ember['default'].RSVP.hash({

                user: this.get('ajax').request('/whoami').then(function (user) {
                    if (!user || !user.username) {
                        throw "Unauthenticated";
                    }

                    return user;
                }).then(function (user) {
                    var rolesService = self.get('rolesService');

                    user.theHeaviestRole = rolesService.getTheHeaviestRole(user.roles);
                    user.menuItems = rolesService.getMenuItemsForRole(user.theHeaviestRole);

                    return user;
                })['catch'](function (err) {
                    if (err !== 'Unauthenticated') {
                        throw err;
                    }
                    window.location.replace("/login");
                }),

                events: this.store.findAll('event')
            })['catch'](function (err) {
                if (err.hasOwnProperty('errors') && err.errors.any(function (e) {
                    return e.hasOwnProperty('status') && e.status >= 400 && e.status !== 403;
                })) {
                    console.log("An error is caught during of loading. To avoid problems try to reload the page. \n " + err.message);
                } else {
                    console.log('Error on application load', err);
                }
            });
        }

    });
});
define('timesheet2/routes/auth', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        rolesService: _ember['default'].inject.service('roles'),

        beforeModel: function beforeModel() {

            var rolesService = this.get('rolesService');

            var user = this.modelFor('application').user;

            if (!rolesService.doesRouteAllowedForRole(this.get('routeName'), user.theHeaviestRole)) {
                this.transitionTo('unauthorized');
            }
        }
    });
});
define('timesheet2/routes/calendar', ['exports', 'timesheet2/routes/auth'], function (exports, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({

        model: function model() {
            return this.store.findRecord('calendar', 1).then(function (model) {
                model.set('calendars', [model.get('calendar')]);
                console.log('remodel');
                return model;
            });
        },

        actions: {
            submit: function submit(model) {
                model.save();
            },

            refresh: function refresh() {
                this.refresh();
            }

        }
    });
});
define('timesheet2/routes/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('timesheet2/routes/employee', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({

        model: function model(params) {

            return _ember['default'].RSVP.hash({
                employee: this.store.findRecord('employee', params.employee_id),
                tabs: [{ route: 'employee.calendar.index', title: 'Calendar', id: params.employee_id }, { route: 'employee.calendar.report', title: 'Report', id: params.employee_id }, { route: 'employee.details', title: 'Details', id: params.employee_id }, { route: 'employee.compensatory-leaves', title: 'Extra compensatory leaves', id: params.employee_id }]
            });
        },

        actions: {
            refresh: function refresh() {
                this.refresh();
            }
        }
    });
});
define('timesheet2/routes/employee/calendar', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        calendarService: _ember['default'].inject.service('calendar'),

        model: function model() {
            var parentModel = this.modelFor("employee"),
                employee = parentModel.employee;

            var generalCalendar = undefined;
            var self = this;

            return _ember['default'].RSVP.hash({
                employee: self.store.findRecord('calendar', 1).then(function (_generalCalendar) {
                    generalCalendar = _generalCalendar;
                    return self.store.findRecord('team', employee.get('teamId'));
                }).then(function (team) {
                    var calendarService = self.get('calendarService');

                    return calendarService.setupEmployee(employee, team, generalCalendar);
                }),
                events: this.store.peekAll('event')
            });
        },

        actions: {
            submit: function submit(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/routes/employee/calendar/report', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {

            return this.modelFor('employee.calendar');
        }
    });
});
define('timesheet2/routes/employee/compensatory-leave', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model(params) {
            // let employee = this.modelFor("employee").employee;
            var self = this;

            return _ember['default'].RSVP.hash({
                leave: self.store.findRecord('compensatory-leave', params.id)
            });
        }
    });
});
define("timesheet2/routes/employee/compensatory-leaves", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Route.extend({
        model: function model() {
            return this.modelFor("employee");
        }
    });
});
define("timesheet2/routes/employee/details", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Route.extend({
        model: function model() {
            return this.modelFor("employee");
        }
    });
});
define('timesheet2/routes/employee/index', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        afterModel: function afterModel() {
            this.transitionTo('employee.calendar');
        }
    });
});
define('timesheet2/routes/employees', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model() {

            function prepareNames(item) {
                return {
                    id: item.get('id'),
                    title: item.get('name')
                };
            }

            return _ember['default'].RSVP.hash({
                employees: this.store.findAll('employee'),
                teams: this.store.findAll('team').then(function (teams) {
                    return teams.map(prepareNames);
                }),
                headers: ['#', 'Name', 'Position', 'Work start', 'Work end']
            });
        }
    });
});
define('timesheet2/routes/event', ['exports', 'timesheet2/routes/auth'], function (exports, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model(params) {
            return this.store.findRecord('event', params.event_id);
        },
        actions: {
            submit: function submit(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/routes/events', ['exports', 'timesheet2/routes/auth'], function (exports, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model() {
            return this.store.findAll('event');
        }
    });
});
define('timesheet2/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('timesheet2/routes/my', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        calendarService: _ember['default'].inject.service('calendar'),

        model: function model() {
            var _this = this;

            var team,
                self = this,
                user = this.modelFor('application').user;

            return _ember['default'].RSVP.hash({
                team: this.store.findRecord('team', user.teamId).then(function (_team) {
                    team = _team;
                    return _this.store.findAll('employee');
                }).then(function () {
                    return self.store.findRecord('calendar', 1);
                }).then(function (defaultCalendar) {
                    var calendarService = self.get('calendarService');
                    return calendarService.setupTeam(team, defaultCalendar);
                }),
                events: []
            });
        }
    });
});
define('timesheet2/routes/team', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({

        model: function model(params) {

            return _ember['default'].RSVP.hash({
                team: this.store.findRecord('team', params.team_id),
                tabs: _ember['default'].RSVP.resolve([{ route: 'team.employees', title: 'Employees', id: params.team_id }, { route: 'team.calendar', title: 'Calendar', id: params.team_id }, { route: 'team.users', title: 'Users', id: params.team_id }, { route: 'team.details', title: 'Details', id: params.team_id }])

            });
        },

        actions: {
            refresh: function refresh() {
                this.refresh();
            }
        }
    });
});
define('timesheet2/routes/team/calendar', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        model: function model() {
            var team = this.modelFor("team").team;
            var self = this;

            return _ember['default'].RSVP.hash({
                team: self.store.findRecord('calendar', 1).then(function (defaultCalendar) {
                    var calendars = undefined;
                    if (team.get('isGeneralCalendarEnabled')) {
                        calendars = [defaultCalendar.get('calendar'), team.get('calendar')];
                    } else {
                        calendars = [team.get('calendar')];
                    }

                    team.set('calendars', calendars);

                    return team;
                }),
                events: this.store.peekAll('event')
            });
        }

    });
});
define("timesheet2/routes/team/details", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Route.extend({
        model: function model() {
            return this.modelFor("team");
        },

        actions: {
            submit: function submit(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/routes/team/employees', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        calendarService: _ember['default'].inject.service('calendar'),

        model: function model() {
            var team = this.modelFor("team").team,
                self = this;

            return _ember['default'].RSVP.hash({
                team: this.store.findAll('employee').then(function () {
                    return self.store.findRecord('calendar', 1);
                }).then(function (defaultCalendar) {
                    var calendarService = self.get('calendarService');

                    return calendarService.setupTeam(team, defaultCalendar);
                }),
                events: this.store.peekAll('event')
            });
        },

        actions: {
            submit: function submit(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/routes/team/index', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        afterModel: function afterModel() {
            this.transitionTo('team.employees');
        }
    });
});
define('timesheet2/routes/team/users', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        model: function model() {
            var team = this.modelFor('team').team;

            return _ember['default'].RSVP.hash({
                team: this.store.findAll('user').then(function () {
                    return team;
                })
            });
        },

        actions: {
            submit: function submit(model) {
                model.save();
            }
        }
    });
});
define('timesheet2/routes/teams', ['exports', 'timesheet2/routes/auth'], function (exports, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model() {
            return this.store.findAll('team');
        }
    });
});
define('timesheet2/routes/unauthorized', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('timesheet2/routes/users/index', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model() {

            function prepareNames(item) {
                return {
                    id: item.get('id'),
                    title: item.get('name')
                };
            }

            return _ember['default'].RSVP.hash({
                users: this.store.findAll('user'),
                teams: this.store.findAll('team').then(function (teams) {
                    return teams.map(prepareNames);
                }),
                headers: ['#', 'Username', 'Name', 'Roles']
            });
        }
    });
});
define('timesheet2/routes/users/new', ['exports', 'ember', 'timesheet2/routes/auth'], function (exports, _ember, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({
        model: function model() {

            return _ember['default'].RSVP.hash({
                teams: this.store.findAll('team'),
                user: this.modelFor('application').user
            });
        }

    });
});
define('timesheet2/routes/users/user', ['exports', 'timesheet2/routes/auth'], function (exports, _timesheet2RoutesAuth) {
    exports['default'] = _timesheet2RoutesAuth['default'].extend({

        model: function model(params) {
            return this.store.findRecord('user', params.user_id);
        }
    });
});
define('timesheet2/serializers/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].JSONSerializer.extend({});
});
define('timesheet2/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('timesheet2/services/calendar', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({

        crcService: _ember['default'].inject.service('crc'),

        setupTeam: function setupTeam(team, generalCalendar) {
            var calendars = undefined;
            var crc = '';
            var crcService = this.get('crcService');

            if (team.get('isGeneralCalendarEnabled')) {
                calendars = [generalCalendar.get('calendar'), team.get('calendar')];
            } else {
                calendars = [team.get('calendar')];
            }

            team.set('calendars', calendars);

            team.set('employees', team.get('employees')
            ///* TODO: remove filter */
            //   .filter(employee => employee.id == 153)
            .map(function (employee) {
                var _calendars = calendars.slice(0);
                _calendars.push(employee.get('calendar'));
                employee.set('calendars', _calendars);

                var crc2 = crcService.crc32(employee.get('calendar'));
                crc += '-' + crc2;

                employee.set('crc', crc2);
                return employee;
            }));

            team.set('employeesCalendarsCrc', crc);

            return team;
        },

        setupEmployee: function setupEmployee(employee, team, generalCalendar) {

            var calendars = [team.get('calendar'), employee.get('calendar')];
            if (team.get('isGeneralCalendarEnabled')) {
                calendars.unshift(generalCalendar.get('calendar'));
            }
            employee.set('calendars', calendars);
            return employee;
        }
    });
});
define('timesheet2/services/configuration', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        roles: {
            ROLE_USER: {
                pattern: '(unauthorized|about|contact|my)',
                menuItems: [{
                    route: 'my',
                    title: 'My schedule'
                }]
            },

            ROLE_ADMIN: {
                pattern: '.*',
                menuItems: [{
                    route: 'teams',
                    title: 'Teams'
                }, {
                    route: 'users',
                    title: 'Users'
                }, {
                    route: 'employees',
                    title: 'Employees'
                }, {
                    route: 'calendar',
                    title: 'Calendar'
                }, {
                    route: 'events',
                    title: 'Events'
                }]
            }
        },

        rolesWeight: ['ROLE_ADMIN', 'ROLE_USER']
    });
});
define("timesheet2/services/crc", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Service.extend({
        crc32: function crc32(str) {
            // Calculates the crc32 polynomial of a string
            //
            // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)

            //str = utf8_encode(str);
            var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
            var crc = 0;
            if (typeof str === "undefined") {
                str = '';
            }
            var x = 0;
            var y = 0;

            crc = crc ^ -1;
            for (var i = 0, iTop = str.length; i < iTop; i++) {
                y = (crc ^ str.charCodeAt(i)) & 0xFF;
                x = "0x" + table.substr(y * 9, 8);
                crc = crc >>> 8 ^ x;
            }

            return crc ^ -1;
        }
    });
});
define('timesheet2/services/error-handler', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({

        handle: function handle(err) {
            //console.log(err.errors[0].detail);
            if (err.hasOwnProperty('errors')) {
                if (Array.isArray(err.errors)) {
                    if (err.errors[0].detail) {
                        alert(err.errors[0].detail);
                    } else {
                        alert(err.errors[0].status + '. ' + err.errors[0].title);
                    }
                } else {
                    alert(err.errors.errors.join('; '));
                }
            } else if (err.hasOwnProperty('error')) {
                alert(err.error.message);
            }
        }
    });
});
define('timesheet2/services/ical', ['exports', 'npm:ical.js', 'npm:moment-timezone', 'ember'], function (exports, _npmIcalJs, _npmMomentTimezone, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        updateDays: function updateDays(iCalData, value, days, events) {

            var jCalData = _npmIcalJs['default'].parse(iCalData);

            var comp = new _npmIcalJs['default'].Component(jCalData);
            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new _npmIcalJs['default'].Timezone(vtz);

            var packageFormat = new RegExp(/t2:(.+)/);
            var event = undefined;

            days.map(function (day) {
                if (events.events.hasOwnProperty(day.date) && events.events[day.date].some(function (item) {
                    return item.isInstance;
                })) {

                    var vevents = comp.getAllSubcomponents("vevent");
                    for (var i = 0; i < vevents.length; i++) {
                        event = new _npmIcalJs['default'].Event(vevents[i]);
                        var index1 = _npmMomentTimezone['default'].tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        var index2 = _npmMomentTimezone['default'].tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        if (index1 === day.date && index2 === day.date) {

                            var summary = vevents[i].getFirstPropertyValue("summary");

                            var packageBody = summary.match(packageFormat);
                            if (packageBody && packageBody.length === 2) {
                                var packageParts = packageBody[1].split(';');
                                var isFound = false;

                                for (var j = 0; j < packageParts.length; j++) {
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
                } else {
                    var vevent = new _npmIcalJs['default'].Component('vevent');

                    event = new _npmIcalJs['default'].Event(vevent);

                    event.summary = 't2:' + value + ';';
                    event.startDate = _npmIcalJs['default'].Time.fromDateString(day.date);
                    event.endDate = _npmIcalJs['default'].Time.fromDateString(day.date);

                    comp.addSubcomponent(vevent);
                }
            });

            return comp.toString();
        },

        addDiapason: function addDiapason(iCalData, events, begin, end, type) {
            var value = 'd:' + type;

            var jCalData = _npmIcalJs['default'].parse(iCalData);

            var comp = new _npmIcalJs['default'].Component(jCalData);
            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new _npmIcalJs['default'].Timezone(vtz);

            var packageFormat = new RegExp(/t2:(.+)/);
            var event = undefined;

            if (events.events.hasOwnProperty(begin) && events.events[begin].some(function (item) {
                return item.isInstance;
            })) {

                var vevents = comp.getAllSubcomponents("vevent");
                for (var i = 0; i < vevents.length; i++) {
                    event = new _npmIcalJs['default'].Event(vevents[i]);
                    var index1 = _npmMomentTimezone['default'].tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    if (index1 === begin) {

                        var summary = vevents[i].getFirstPropertyValue("summary");

                        var packageBody = summary.match(packageFormat);
                        if (packageBody && packageBody.length === 2) {
                            var packageParts = packageBody[1].split(';');
                            var isFound = false;

                            for (var j = 0; j < packageParts.length; j++) {
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
            } else {
                var vevent = new _npmIcalJs['default'].Component('vevent');

                event = new _npmIcalJs['default'].Event(vevent);

                event.summary = 't2:' + value + ';';
                event.startDate = _npmIcalJs['default'].Time.fromDateString(begin);
                event.endDate = _npmIcalJs['default'].Time.fromDateString(end);
                comp.addSubcomponent(vevent);
            }

            return comp.toString();
        },

        clearData: function clearData(iCalData, days, events) {

            var jCalData = _npmIcalJs['default'].parse(iCalData);

            var comp = new _npmIcalJs['default'].Component(jCalData);
            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new _npmIcalJs['default'].Timezone(vtz);

            var event = undefined;

            days.map(function (day) {
                if (events.events.hasOwnProperty(day.date) && events.events[day.date].some(function (item) {
                    return item.isInstance;
                })) {

                    var vevents = comp.getAllSubcomponents("vevent");
                    for (var i = 0; i < vevents.length; i++) {
                        event = new _npmIcalJs['default'].Event(vevents[i]);
                        var index1 = _npmMomentTimezone['default'].tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        var index2 = _npmMomentTimezone['default'].tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                        if (index1 === day.date && index2 === day.date) {

                            comp.removeSubcomponent(vevents[i]);
                        }
                    }
                }
            });

            return comp.toString();
        },

        removeDiapason: function removeDiapason(iCalData, events, begin, end) {

            var jCalData = _npmIcalJs['default'].parse(iCalData);

            var comp = new _npmIcalJs['default'].Component(jCalData);
            var vtz = comp.getFirstSubcomponent('vtimezone');
            var tz = new _npmIcalJs['default'].Timezone(vtz);

            var event = undefined;

            if (events.events.hasOwnProperty(begin) && events.events[begin].some(function (item) {
                return item.isInstance;
            })) {

                var vevents = comp.getAllSubcomponents("vevent");
                for (var i = 0; i < vevents.length; i++) {
                    event = new _npmIcalJs['default'].Event(vevents[i]);
                    var index1 = _npmMomentTimezone['default'].tz(event.startDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    var index2 = _npmMomentTimezone['default'].tz(event.endDate.toJSDate(), tz.tzid).format('YYYY-MM-DD');
                    if (index1 === begin && index2 === end) {

                        comp.removeSubcomponent(vevents[i]);
                    }
                }
            }

            return comp.toString();
        },

        //noinspection JSUnusedGlobalSymbols
        getEventsIndex: function getEventsIndex(calendars, year) {

            var eIndex = { events: {}, diapasons: [], holidays: {} };

            if (!calendars) {
                return eIndex;
            }
            var time1 = new Date().getTime();

            if (!Array.isArray(calendars)) {
                calendars = [calendars];
            }

            calendars.map(function (iCalData, calendarIndex) {

                if (!iCalData) {
                    console.log('Invalid calendar format');
                    return;
                }

                var jCalData = _npmIcalJs['default'].parse(iCalData);

                var comp = new _npmIcalJs['default'].Component(jCalData);
                var vevents = comp.getAllSubcomponents("vevent");

                var vtz = comp.getFirstSubcomponent('vtimezone');
                var tz = new _npmIcalJs['default'].Timezone(vtz);

                // Month -1 and 12 used to count events for combinations like "Dec Jan Feb" or "Nov Dec Jan"
                var beginOfYear = (0, _npmMomentTimezone['default'])().year(year).month(-1).date(1).set({ hour: 0, minute: 0, second: 0 }).tz(tz.tzid);
                var endOfYear = (0, _npmMomentTimezone['default'])().year(year).month(12).date(31).set({ hour: 23, minute: 59, second: 59 }).tz(tz.tzid);

                var dateRegExp = new RegExp(/d:(\d{1,2});/);
                var holidayRegExp = new RegExp(/n:(ph|we);/);
                var valueRegExp = new RegExp(/v:([^;]+);/);
                var shiftRegExp = new RegExp(/s:([^;]+);/);

                for (var i = 0; i < vevents.length; i++) {
                    var isHoliday = false;

                    var isInstance = calendarIndex + 1 === calendars.length;

                    var summaryOrig = vevents[i].getFirstPropertyValue("summary");
                    var summary = {};

                    var match = summaryOrig.match(dateRegExp);
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

                    var _event = new _npmIcalJs['default'].Event(vevents[i]);
                    var eBegin = _npmMomentTimezone['default'].tz(_event.startDate.toJSDate(), tz.tzid);
                    var eEnd = _npmMomentTimezone['default'].tz(_event.endDate.toJSDate(), tz.tzid);

                    if ((eBegin.isAfter(beginOfYear, 'day') || eBegin.isSame(beginOfYear, 'day')) && (eBegin.isBefore(endOfYear, 'day') || eBegin.isSame(endOfYear, 'day')) || eEnd.isAfter(beginOfYear, 'day') && (eEnd.isBefore(endOfYear, 'day') || eEnd.isSame(endOfYear, 'day'))) {
                        var index = eBegin.format('YYYY-MM-DD');
                        if (eBegin.isSame(eEnd, 'day') || _event.duration.toICALString() === 'P1D' && eBegin.format('HHmm') === '0000') {
                            if (!eIndex.events.hasOwnProperty(index)) {
                                eIndex.events[index] = [];
                            }
                            eIndex.events[index].push({ isInstance: isInstance, summary: summary });
                        } else {
                            eIndex.diapasons.push({
                                begin: eBegin.format('YYYY-MM-DD'),
                                end: eEnd.format('YYYY-MM-DD'),
                                summary: summary
                            });

                            for (var d = eBegin; d.isBefore(eEnd, 'hour'); d.add(1, 'd')) {
                                var dIndex = eBegin.format('YYYY-MM-DD');

                                if (!eIndex.events.hasOwnProperty(dIndex)) {
                                    eIndex.events[dIndex] = [];
                                }
                                eIndex.events[dIndex].push({ isInstance: isInstance, summary: summary });
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

            var time2 = new Date().getTime();
            console.log('Calendar parsing time: ' + (time2 - time1) + ' ms');

            return eIndex;
        }
    });
});
//noinspection JSFileReferences
define('timesheet2/services/local-storage', ['exports', 'ember'], function (exports, _ember) {

    var CALENDAR_OPTIONS = 'CALENDAR_OPTIONS';

    exports['default'] = _ember['default'].Service.extend({

        getCalendarOptions: function getCalendarOptions() {
            var options = { year: 2016, month: 5 };

            if (localStorage && localStorage.hasOwnProperty(CALENDAR_OPTIONS)) {
                try {
                    var preOptions = JSON.parse(localStorage.getItem(CALENDAR_OPTIONS));

                    if (preOptions.hasOwnProperty('year') && preOptions.hasOwnProperty('month') && preOptions.year && preOptions.month) {
                        options = preOptions;
                    }
                } catch (e) {}
            }

            // this.setCalendarOptions(options);

            return options;
        },

        setCalendarOptions: function setCalendarOptions(o) {
            if (localStorage) {
                var existing = this.getCalendarOptions();

                localStorage.setItem(CALENDAR_OPTIONS, JSON.stringify(Object.assign({}, existing, o)));
            }
        }

    });
});
define('timesheet2/services/moment', ['exports', 'ember', 'timesheet2/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _timesheet2ConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_timesheet2ConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('timesheet2/services/roles', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({

        configuration: _ember['default'].inject.service('configuration'),

        getTheHeaviestRole: function getTheHeaviestRole(roles) {

            var configuration = this.get('configuration');
            var selectedRole = null;

            roles.map(function (role) {
                var indexOfCurrentRole = configuration.rolesWeight.indexOf(role);

                if (!selectedRole && indexOfCurrentRole > -1 || indexOfCurrentRole > -1 && indexOfCurrentRole < configuration.rolesWeight.indexOf(selectedRole)) {
                    selectedRole = role;
                }
            });

            return selectedRole;
        },

        doesRouteAllowedForRole: function doesRouteAllowedForRole(route, _role) {
            var configuration = this.get('configuration');

            var role = configuration.roles[_role];

            if (role) {
                if (route.match(new RegExp(role.pattern))) {
                    return true;
                }
            }

            return false;
        },

        getMenuItemsForRole: function getMenuItemsForRole(_role) {
            var configuration = this.get('configuration');

            var role = configuration.roles[_role];

            if (role) {
                return role.menuItems;
            }

            return [];
        }
    });
});
define("timesheet2/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RVAlhIZ5", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\nAbout page\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/about.hbs" } });
});
define("timesheet2/templates/application-loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "o68+e4K+", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Please wait for data loading\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/waiting-f9b76dc9bba462ece85fc9d7f8f2c33e.gif\"],[\"static-attr\",\"alt\",\"waiting GIF\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/application-loading.hbs" } });
});
define("timesheet2/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VuV5+g9W", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"comment\",\"suppress CssUnusedSymbol \"],[\"text\",\"\\n\"],[\"open-element\",\"style\",[]],[\"static-attr\",\"type\",\"text/css\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"events\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"menu-bar\"],null,[[\"user\"],[[\"get\",[\"model\",\"user\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        .event_\"],[\"append\",[\"unknown\",[\"event\",\"id\"]],false],[\"text\",\" {\\n            background-color: #\"],[\"append\",[\"unknown\",[\"event\",\"backgroundColor\"]],false],[\"text\",\";\\n            color: #\"],[\"append\",[\"unknown\",[\"event\",\"color\"]],false],[\"text\",\";\\n        }\\n        .event_\"],[\"append\",[\"unknown\",[\"event\",\"id\"]],false],[\"text\",\":before {\\n            content: \\\"\"],[\"append\",[\"unknown\",[\"event\",\"title\"]],false],[\"text\",\"\\\";\\n        }\\n\"]],\"locals\":[\"event\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/application.hbs" } });
});
define("timesheet2/templates/calendar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Jcr0eMHF", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"calendar-year\"],null,[[\"year\",\"month\",\"changeMonthAction\",\"model\",\"calendars\",\"refreshAction\",\"nonWorkingOnly\",\"showDiapasons\"],[[\"get\",[\"year\"]],[\"get\",[\"month\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],[\"get\",[\"model\"]],[\"get\",[\"model\",\"calendars\"]],\"refresh\",true,false]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/calendar.hbs" } });
});
define("timesheet2/templates/components/bread-crumbs", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VZVR+WNc", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"crumbs\"]]],null,3],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"append\",[\"unknown\",[\"crumb\",\"title\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"unknown\",[\"crumb\",\"title\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"block\",[\"link-to\"],[[\"get\",[\"crumb\",\"pathName\"]]],null,1],[\"text\",\" >\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"crumb\",\"pathName\"]]],null,2,0]],\"locals\":[\"crumb\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/bread-crumbs.hbs" } });
});
define("timesheet2/templates/components/calendar-actions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "rpQf5mx3", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-responsive table-bordered calendar-actions\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Working days\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Day value\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Shifts\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Nonworking days\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Actions\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showButtons\"]]],null,6],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showButtons\"]]],null,4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showButtons\"]]],null,3],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"events_agenda \"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event event_we\"],[\"flush-element\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setNonworkingDay\",\"we\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Weekend\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event event_ph\"],[\"flush-element\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setNonworkingDay\",\"ph\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Public holiday\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onUnpick\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Unpick dates\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"danger_button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onClearAll\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"⊗ Clear data\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"h4\",[]],[\"flush-element\"],[\"text\",\"Pick dates using an algorithm:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"type\",\"class\"],[[\"get\",[\"pickValue\"]],\"number\",\"short_input_70\"]]],false],[\"text\",\"\\n                per\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"type\",\"class\"],[[\"get\",[\"pickGap\"]],\"number\",\"short_input_70\"]]],false],[\"text\",\"\\n                *\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"type\",\"class\"],[[\"get\",[\"pickQuantity\"]],\"number\",\"short_input_70\"]]],false],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onPickWithAlgorithm\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Pick dates\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Checked dates:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"sections\"]]],null,2],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"json\"],[[\"get\",[\"event\",\"summary\"]]],null],false]],\"locals\":[\"event\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\" - \"],[\"append\",[\"unknown\",[\"day\",\"date\"]],false],[\"text\",\" - \"],[\"block\",[\"each\"],[[\"get\",[\"day\",\"events\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"day\"]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Section: \"],[\"append\",[\"unknown\",[\"section\",\"sectionId\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"section\",\"days\"]]],null,1]],\"locals\":[\"section\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"events_agenda\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event event_shift event_shift_1\"],[\"flush-element\"],[\"text\",\"1\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setShift\",1],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Shift 1\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event event_shift event_shift_2\"],[\"flush-element\"],[\"text\",\"2\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setShift\",2],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Shift 2\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event event_shift event_shift_3\"],[\"flush-element\"],[\"text\",\"3\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setShift\",3],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Shift 3\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"type\"],[[\"get\",[\"value\"]],\"text\"]]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setValue\",[\"get\",[\"event\",\"id\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Apply\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"i\",[]],[\"flush-element\"],[\"text\",\"Example: 1.25\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"event event_\",[\"unknown\",[\"event\",\"id\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\" - \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"setEvent\",[\"get\",[\"event\",\"id\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"event\",\"name\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"event\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"events_agenda\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"event_types\"]]],null,5],[\"text\",\"                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-actions.hbs" } });
});
define("timesheet2/templates/components/calendar-day", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YMb5p6bU", "block": "{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"date_event_container\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"click\",[\"get\",[\"sectionId\"]],[\"get\",[\"date\"]]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"title\"]],false],[\"open-element\",\"small\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"dayOfWeek\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"isHeader\"]]],null,4],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"event_shift event_shift_\",[\"unknown\",[\"event\",\"summary\",\"s\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"event\",\"summary\",\"s\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"event_value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"event\",\"summary\",\"v\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"event event_\",[\"unknown\",[\"event\",\"summary\",\"d\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"event\",\"summary\",\"d\"]]],null,2],[\"block\",[\"if\"],[[\"get\",[\"event\",\"summary\",\"v\"]]],null,1],[\"block\",[\"if\"],[[\"get\",[\"event\",\"summary\",\"s\"]]],null,0]],\"locals\":[\"event\"]},{\"statements\":[[\"block\",[\"each\"],[[\"get\",[\"localEvents\"]]],null,3]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-day.hbs" } });
});
define("timesheet2/templates/components/calendar-diapasons", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "LSZfklm8", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"diapason-options\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"hidden\"]]],null,3,2],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"td\",[]],[\"static-attr\",\"colspan\",\"4\"],[\"flush-element\"],[\"text\",\"No items found\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"append\",[\"helper\",[\"inc\"],[[\"get\",[\"i\"]]],null],false],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"append\",[\"unknown\",[\"diapason\",\"begin\"]],false],[\"text\",\" — \"],[\"append\",[\"unknown\",[\"diapason\",\"end\"]],false],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"event event_\",[\"unknown\",[\"diapason\",\"summary\",\"d\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeDiapason\",[\"get\",[\"diapason\",\"begin\"]],[\"get\",[\"diapason\",\"end\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Remove\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"diapason\",\"i\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"hide\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Hide\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"\\n            Diapasons\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"diapasons\"]]],null,1,0],[\"text\",\"            \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"New\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"newBegin\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"newEnd\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"eventTypesNames\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeNewType\"],null],[\"get\",[\"newType\"]]]]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addDiapason\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Add new diapason\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"show\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Show diapasons options\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-diapasons.hbs" } });
});
define("timesheet2/templates/components/calendar-month", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "KVzE4Kqc", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-responsive table-bordered  table-striped calendar-month\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"caption\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"monthName\"]],false],[\"text\",\" \"],[\"open-element\",\"small\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"year\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"daysOfWeek\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"weeks\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"append\",[\"helper\",[\"calendar-day\"],null,[[\"date\",\"isHoliday\",\"localEvents\",\"month\",\"isChecked\",\"onPickDate\",\"showNumbers\",\"sectionId\"],[[\"get\",[\"day\",\"date\"]],[\"get\",[\"day\",\"isHoliday\"]],[\"get\",[\"day\",\"localEvents\"]],[\"get\",[\"month\"]],[\"get\",[\"day\",\"isChecked\"]],[\"get\",[\"onPickDate\"]],true,[\"get\",[\"sectionId\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"day\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"week\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"week\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"th\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onPickDaysOfWeek\",[\"get\",[\"year\"]],[\"get\",[\"sectionId\"]],[\"get\",[\"day\"]],[\"get\",[\"on\"]],\"click\"]],[\"flush-element\"],[\"append\",[\"get\",[\"day\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"day\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-month.hbs" } });
});
define("timesheet2/templates/components/calendar-with-actions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qq+LKluS", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-with-actions.hbs" } });
});
define("timesheet2/templates/components/calendar-year", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gYNtCuX8", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"calendar_options\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"years\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeYear\"],null],[\"get\",[\"selectedYear\"]]]]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"months\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],[\"get\",[\"selectedMonth\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clearfix\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"monthSections\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clearfix\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showDiapasons\"]]],null,0],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"calendar-actions\"],null,[[\"sections\",\"showButtons\",\"event_types\",\"onUpdate\",\"onUnpick\",\"onPickWithAlgorithm\"],[[\"get\",[\"monthSections\"]],[\"get\",[\"showButtons\"]],[\"get\",[\"event_types\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"onUpdate\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"onUnpick\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"onPickWithAlgorithm\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"calendar-diapasons\"],null,[[\"event_types\",\"diapasons\",\"addDiapasonAction\",\"removeDiapasonAction\"],[[\"get\",[\"event_types\"]],[\"get\",[\"model\",\"events\",\"diapasons\"]],[\"get\",[\"addDiapasonAction\"]],[\"get\",[\"removeDiapasonAction\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"append\",[\"helper\",[\"calendar-month\"],null,[[\"month\",\"year\",\"onPickDaysOfWeek\",\"onPickDate\",\"checkedDates\",\"model\",\"nonWorkingOnly\",\"sectionId\"],[[\"get\",[\"m\",\"month\"]],[\"get\",[\"year\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"onPickDaysOfWeek\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"onPickDate\"],null],[\"get\",[\"m\",\"days\"]],[\"get\",[\"model\"]],[\"get\",[\"nonWorkingOnly\"]],[\"get\",[\"m\",\"sectionId\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"m\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/calendar-year.hbs" } });
});
define("timesheet2/templates/components/drop-down", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "7P0BEnFT", "block": "{\"statements\":[[\"open-element\",\"select\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"change\"],[[\"on\"],[\"change\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"content\"]]],[[\"key\"],[\"@index\"]],0],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"item\",\"id\"]]]]],[\"dynamic-attr\",\"selected\",[\"helper\",[\"is-selected\"],[[\"get\",[\"item\"]],[\"get\",[\"selectedValue\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"unknown\",[\"item\",\"title\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/drop-down.hbs" } });
});
define("timesheet2/templates/components/employee-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QhAlUj8Z", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"aright pull-right\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\",[\"get\",[\"employee\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        Name: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"employee\",\"name\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        Surname: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"employee\",\"surname\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        Position: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"employee\",\"position\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        The first working day: \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"employee\",\"workStart\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        The last working day: \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"employee\",\"workEnd\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"workStartDate\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/employee-form.hbs" } });
});
define("timesheet2/templates/components/employee-report", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "uqcyLEg4", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"employee-report\"],[\"flush-element\"],[\"text\",\"\\n\\n    Report from \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\"],[[\"get\",[\"model\",\"report_from\"]],\"yyyy-mm-dd\",false,true,1]]],false],[\"text\",\"\\n    to \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\"],[[\"get\",[\"model\",\"report_to\"]],\"yyyy-mm-dd\",false,true,1]]],false],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"getReport\",[\"get\",[\"employee\"]],[\"get\",[\"events\"]],[\"get\",[\"model\",\"report_from\"]],[\"get\",[\"model\",\"report_to\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Get report\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"results\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Working days: \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"report\",\"w\"]],false],[\"close-element\"],[\"text\",\";\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Nonworking days: \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"report\",\"n\"]],false],[\"close-element\"],[\"text\",\";\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Otguls: \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"report\",\"ot\"]],false],[\"close-element\"],[\"text\",\";\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"report\",\"other\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"item\",\"event\",\"name\"]],false],[\"text\",\": \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"item\",\"value\"]],false],[\"close-element\"],[\"text\",\";\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/employee-report.hbs" } });
});
define("timesheet2/templates/components/filtered-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RBlADHvd", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n    Filter:\\n    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\"],[[\"get\",[\"filterWithAll\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"select\"],null]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"headers\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"filteredItems\"]]],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"yield\",\"default\",[[\"get\",[\"item\"]],[\"get\",[\"id\"]]]],[\"text\",\"\\n\"]],\"locals\":[\"item\",\"id\"]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"get\",[\"header\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"header\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/filtered-list.hbs" } });
});
define("timesheet2/templates/components/horizontal-month", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ABB/G1pj", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"table\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"horizontal-month \",[\"helper\",[\"if\"],[[\"get\",[\"showNumbers\"]],\"calendar-header\",\"calendar-body\"],null]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"days\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"append\",[\"helper\",[\"calendar-day\"],null,[[\"date\",\"isHoliday\",\"localEvents\",\"month\",\"isSingleMonth\",\"isChecked\",\"onPickDate\",\"showNumbers\",\"isHeader\",\"sectionId\"],[[\"get\",[\"day\",\"date\"]],[\"get\",[\"day\",\"isHoliday\"]],[\"get\",[\"day\",\"localEvents\"]],[\"get\",[\"month\"]],true,[\"get\",[\"day\",\"isChecked\"]],[\"get\",[\"onPickDate\"]],[\"get\",[\"showNumbers\"]],[\"get\",[\"isHeader\"]],[\"get\",[\"sectionId\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"day\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/horizontal-month.hbs" } });
});
define("timesheet2/templates/components/menu-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "dvrEO08G", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-default\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse\"],[\"static-attr\",\"id\",\"bs-example-navbar-collapse-1\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"active\"],[\"flush-element\"],[\"block\",[\"link-to\"],[\"index\"],null,2],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"user\",\"menuItems\"]]],null,1],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"navbar-text pull-right\"],[\"flush-element\"],[\"text\",\"\\n                You are logged in as \"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"username\"]],false],[\"text\",\" \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"/logout\"],[\"flush-element\"],[\"text\",\"log out\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clearfix\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"menuItem\",\"title\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[[\"get\",[\"menuItem\",\"route\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"menuItem\"]},{\"statements\":[[\"text\",\"Timesheet \"],[\"open-element\",\"small\",[]],[\"flush-element\"],[\"text\",\"v2\"],[\"close-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"(current)\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/menu-bar.hbs" } });
});
define("timesheet2/templates/components/nav-tabs", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UATyZxrj", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-tabs\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"localTabs\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"tab\",\"title\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"role\",\"presentation\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"unknown\",[\"tab\",\"className\"]]]]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"onTransition\"],null],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[[\"get\",[\"tab\",\"route\"]],[\"get\",[\"tab\",\"id\"]]],null,0],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"tab\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/nav-tabs.hbs" } });
});
define("timesheet2/templates/components/new-user-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "sub5xZLt", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group pull-right\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\",[\"get\",[\"newUser\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Create\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Team: \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"teamNames\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeTeam\"],null],[\"get\",[\"newUser\",\"teamId\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Email: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"newUser\",\"email\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Password: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"newUser\",\"plainPassword\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Name: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"newUser\",\"name\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Surname: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"newUser\",\"surname\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"Roles:\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"newUser\",\"roles\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"get\",[\"role\"]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"role\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/new-user-form.hbs" } });
});
define("timesheet2/templates/components/team-month", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gFHbE1gz", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"calendar_options\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"years\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeYear\"],null],[\"get\",[\"selectedYear\"]]]]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"onChange\",\"selectedValue\"],[[\"get\",[\"months\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],[\"get\",[\"selectedMonth\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"append\",[\"helper\",[\"horizontal-month\"],null,[[\"month\",\"year\",\"showNumbers\",\"model\",\"isHeader\",\"checkedDates\",\"sectionId\"],[[\"get\",[\"month\"]],[\"get\",[\"year\"]],true,[\"get\",[\"team\"]],true,[\"get\",[\"emptyArray\"]],\"none\"]]],false],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"monthSections\"]]],null,2],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showActions\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"calendar-actions\"],null,[[\"sections\",\"checkedDates\",\"showButtons\",\"model\",\"event_types\",\"onUpdate\",\"onUnpick\",\"onPickWithAlgorithm\"],[[\"get\",[\"monthSections\"]],[\"get\",[\"checkedDates\"]],true,[\"get\",[\"team\"]],[\"get\",[\"event_types\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"onUpdate\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"onUnpick\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"onPickWithAlgorithm\"],null]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"unknown\",[\"section\",\"model\",\"name\"]],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"section\",\"model\",\"surname\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"employee\",[\"get\",[\"section\",\"model\",\"id\"]]],null,1],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"horizontal-month\"],null,[[\"month\",\"year\",\"showNumbers\",\"checkedDates\",\"onPickDate\",\"model\",\"sectionId\"],[[\"get\",[\"section\",\"month\"]],[\"get\",[\"year\"]],false,[\"get\",[\"section\",\"days\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"onPickDate\"],null],[\"get\",[\"section\",\"model\"]],[\"get\",[\"section\",\"sectionId\"]]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"section\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/team-month.hbs" } });
});
define("timesheet2/templates/components/user-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Kys6HHZc", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group pull-right\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\",[\"get\",[\"user\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Name: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"user\",\"name\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Surname: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"user\",\"surname\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group bg-info\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"fieldset\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"Roles:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"user\",\"roles\"]]],null,0],[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"placeholder\"],[[\"get\",[\"new_role\"]],\"ROLE NAME\"]]],false],[\"text\",\"\\n                    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-default btn-s\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addRole\",[\"get\",[\"user\"]],[\"get\",[\"new_role\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Add new\\n                        role\\n                    \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        Enabled: \"],[\"append\",[\"helper\",[\"drop-down\"],null,[[\"content\",\"selectedValue\",\"onChange\"],[[\"get\",[\"enabledDisabled\"]],[\"get\",[\"user\",\"enabled\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeStatus\"],null]]]],false],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"pull-right\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-danger\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteUser\",[\"get\",[\"user\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Delete user\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                        \"],[\"append\",[\"get\",[\"role\"]],false],[\"text\",\"\\n                        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-danger btn-xs\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteRole\",[\"get\",[\"user\"]],[\"get\",[\"role\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Delete\\n                        \"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"role\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/components/user-form.hbs" } });
});
define("timesheet2/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1M2ccKTU", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\nContact us!!!\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/contact.hbs" } });
});
define("timesheet2/templates/employee", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "GobaV/gp", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Employee \"],[\"append\",[\"unknown\",[\"model\",\"employee\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"nav-tabs\"],null,[[\"tabs\"],[[\"get\",[\"model\",\"tabs\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee.hbs" } });
});
define("timesheet2/templates/employee/calendar-loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "46GIHLld", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Please wait for a initialization of a calendar\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/waiting-f9b76dc9bba462ece85fc9d7f8f2c33e.gif\"],[\"static-attr\",\"alt\",\"waiting GIF\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/calendar-loading.hbs" } });
});
define("timesheet2/templates/employee/calendar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+VSVd0Qf", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"calendar-year\"],null,[[\"year\",\"month\",\"changeMonthAction\",\"addDiapasonAction\",\"removeDiapasonAction\",\"refreshAction\",\"model\",\"showButtons\",\"event_types\",\"showDiapasons\"],[[\"get\",[\"year\"]],[\"get\",[\"month\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"addDiapason\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"removeDiapason\"],null],\"refresh\",[\"get\",[\"model\",\"employee\"]],true,[\"get\",[\"model\",\"events\"]],true]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/calendar.hbs" } });
});
define("timesheet2/templates/employee/calendar/report", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "tWAvozVF", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"employee-report\"],null,[[\"calendars\",\"employee\",\"events\"],[[\"get\",[\"model\",\"employee\",\"calendars\"]],[\"get\",[\"model\",\"employee\"]],[\"get\",[\"model\",\"events\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/calendar/report.hbs" } });
});
define("timesheet2/templates/employee/compensatory-leave", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "zl7MQH+X", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Edit a compensatory leave #\"],[\"append\",[\"unknown\",[\"model\",\"leave\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"block\",[\"link-to\"],[\"employee.compensatory-leaves\"],null,0],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n    Date:\\n    \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"model\",\"leave\",\"date\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Description: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"leave\",\"description\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Value: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"leave\",\"value\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onSave\",[\"get\",[\"model\",\"leave\"]],[\"get\",[\"on\"]],\"click\"]],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"<< Back to list\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/compensatory-leave.hbs" } });
});
define("timesheet2/templates/employee/compensatory-leaves", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QcLyRxr+", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"\\n    Extra compensatory leaves\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"employee\",\"compensatoryLeaves\"]]],null,2,0],[\"text\",\"    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"New\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"bootstrap-datepicker\"],null,[[\"value\",\"format\",\"todayHighlight\",\"autoclose\",\"weekStart\",\"forceParse\"],[[\"get\",[\"newDate\"]],\"yyyy-mm-dd\",true,true,1,false]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"value\"],[[\"get\",[\"newDescription\"]]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"newValue\"]]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onAdd\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Add new diapason\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"static-attr\",\"colspan\",\"5\"],[\"flush-element\"],[\"text\",\"No items found\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"edit\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"inc\"],[[\"get\",[\"i\"]]],null],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"leave\",\"id\"]],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"leave\",\"date\"]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"leave\",\"description\"]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"leave\",\"value\"]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"onRemove\",[\"get\",[\"leave\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Remove\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"employee.compensatory-leave\",[\"get\",[\"leave\",\"id\"]]],null,1],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"leave\",\"i\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/compensatory-leaves.hbs" } });
});
define("timesheet2/templates/employee/details", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "mA4SdXsJ", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"employee-form\"],null,[[\"employee\"],[[\"get\",[\"model\",\"employee\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employee/details.hbs" } });
});
define("timesheet2/templates/employees", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Ip6YqTxa", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"filtered-list\"],null,[[\"items\",\"filter\",\"headers\",\"id\"],[[\"get\",[\"model\",\"employees\"]],[\"get\",[\"model\",\"teams\"]],[\"get\",[\"model\",\"headers\"]],\"teamId\"]],1],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"employee\",\"name\"]],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"employee\",\"surname\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"sum\"],[[\"get\",[\"id\"]],1],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"employee\",[\"get\",[\"employee\",\"id\"]]],null,0],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"employee\",\"position\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"employee\",\"workStart\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"employee\",\"workEnd\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"employee\",\"id\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/employees.hbs" } });
});
define("timesheet2/templates/event", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "SdhZ+1jA", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"name\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Code: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"code\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Color: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"color\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Background color: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"backgroundColor\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\",[\"get\",[\"model\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/event.hbs" } });
});
define("timesheet2/templates/events", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "g+h5fbAc", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"#\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"id\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"name\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"title\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"event\",\"name\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"sum\"],[[\"get\",[\"number\"]],1],null],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"event\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"event\",[\"get\",[\"event\",\"id\"]]],null,0],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"event\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"event\",\"number\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/events.hbs" } });
});
define("timesheet2/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bDLweeBo", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Welcome to Timesheet2\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/index.hbs" } });
});
define("timesheet2/templates/my-loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "wLcrtywP", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Please wait for data loading\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/waiting-f9b76dc9bba462ece85fc9d7f8f2c33e.gif\"],[\"static-attr\",\"alt\",\"waiting GIF\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/my-loading.hbs" } });
});
define("timesheet2/templates/my", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VDiI4JfF", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"My team\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"team-month\"],null,[[\"year\",\"month\",\"team\",\"showActions\"],[2016,1,[\"get\",[\"model\",\"team\"]],false]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/my.hbs" } });
});
define("timesheet2/templates/public-holidays", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1Fna2QQR", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/public-holidays.hbs" } });
});
define("timesheet2/templates/team", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Sbq/Fqf9", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Team \"],[\"append\",[\"unknown\",[\"model\",\"team\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"nav-tabs\"],null,[[\"tabs\"],[[\"get\",[\"model\",\"tabs\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team.hbs" } });
});
define("timesheet2/templates/team/calendar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xdqqZi1j", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"calendar-year\"],null,[[\"year\",\"month\",\"calendars\",\"changeMonthAction\",\"refreshAction\",\"model\",\"showButtons\",\"event_types\",\"nonWorkingOnly\",\"showDiapasons\"],[[\"get\",[\"year\"]],[\"get\",[\"month\"]],[\"get\",[\"model\",\"team\",\"calendars\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],\"refresh\",[\"get\",[\"model\",\"team\"]],false,[\"get\",[\"model\",\"events\"]],true,false]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team/calendar.hbs" } });
});
define("timesheet2/templates/team/details", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "genWElvj", "block": "{\"statements\":[[\"text\",\"\\n\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"team\",\"name\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Code: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"model\",\"team\",\"code\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Is general calendar enabled: \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"model\",\"team\",\"isGeneralCalendarEnabled\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team/details.hbs" } });
});
define("timesheet2/templates/team/employees-loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gxN3n4pN", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Please wait for a initialization of a calendar\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/waiting-f9b76dc9bba462ece85fc9d7f8f2c33e.gif\"],[\"static-attr\",\"alt\",\"waiting GIF\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team/employees-loading.hbs" } });
});
define("timesheet2/templates/team/employees", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "2hvOaGgk", "block": "{\"statements\":[[\"append\",[\"helper\",[\"team-month\"],null,[[\"year\",\"month\",\"changeMonthAction\",\"refreshAction\",\"team\",\"showButtons\",\"showActions\",\"event_types\"],[[\"get\",[\"year\"]],[\"get\",[\"month\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"changeMonth\"],null],\"refresh\",[\"get\",[\"model\",\"team\"]],false,true,[\"get\",[\"model\",\"events\"]]]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team/employees.hbs" } });
});
define("timesheet2/templates/team/users", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "rbUKJWw1", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"team\",\"users\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"user\",\"username\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"users.user\",[\"get\",[\"user\",\"id\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/team/users.hbs" } });
});
define("timesheet2/templates/teams", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Xg0tUQ41", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"#\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"id\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"name\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"code\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"unknown\",[\"team\",\"name\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"sum\"],[[\"get\",[\"number\"]],1],null],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"team\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"team\",[\"get\",[\"team\",\"id\"]]],null,0],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"team\",\"code\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"team\",\"number\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/teams.hbs" } });
});
define("timesheet2/templates/unauthorized", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9nVPmhH3", "block": "{\"statements\":[[\"text\",\"The page is not allowed for your account.\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/unauthorized.hbs" } });
});
define("timesheet2/templates/users/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "D/36PTTl", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"filtered-list\"],null,[[\"items\",\"filter\",\"headers\",\"id\"],[[\"get\",[\"model\",\"users\"]],[\"get\",[\"model\",\"teams\"]],[\"get\",[\"model\",\"headers\"]],\"teamId\"]],3],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"pull-right\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"users.new\"],[[\"class\"],[\"btn btn-primary\"]],0],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"New user\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"append\",[\"get\",[\"role\"]],false],[\"text\",\"\\n\"]],\"locals\":[\"role\"]},{\"statements\":[[\"append\",[\"unknown\",[\"user\",\"username\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"sum\"],[[\"get\",[\"id\"]],1],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"users.user\",[\"get\",[\"user\",\"id\"]]],null,2],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"name\"]],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"user\",\"surname\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"user\",\"roles\"]]],null,1],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\",\"id\"]}],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/users/index.hbs" } });
});
define("timesheet2/templates/users/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "hl2NyHiy", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"new-user-form\"],null,[[\"teams\",\"user\"],[[\"get\",[\"model\",\"teams\"]],[\"get\",[\"model\",\"user\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/users/new.hbs" } });
});
define("timesheet2/templates/users/user", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VSktV1ET", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"bread-crumbs\"]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"user-form\"],null,[[\"user\"],[[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "timesheet2/templates/users/user.hbs" } });
});
define('timesheet2/transforms/datephp', ['exports', 'ember-data/transform', 'moment'], function (exports, _emberDataTransform, _moment) {
    exports['default'] = _emberDataTransform['default'].extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                return new Date(serialized);
            }
            return null;
        },

        serialize: function serialize(deserialized) {
            if (!deserialized || deserialized === 'Invalid date') {
                return null;
            }
            return (0, _moment['default'])(deserialized).format("YYYY-MM-DD");
        }
    });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('timesheet2/config/environment', ['ember'], function(Ember) {
  var prefix = 'timesheet2';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("timesheet2/app")["default"].create({"name":"timesheet2","version":"0.0.1+16b37302"});
}

/* jshint ignore:end */
