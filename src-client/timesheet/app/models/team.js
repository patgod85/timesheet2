import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    code: DS.attr(),
    users: DS.hasMany('user', {inverse: 'team'}),
    employees: DS.hasMany('employee', {inverse: 'team'}),
    calendar: DS.attr(),
    isGeneralCalendarEnabled: DS.attr()

});
