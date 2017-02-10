import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr('datephp', {
        defaultValue() { return null; }
    }),
    description: DS.attr(),
    value: DS.attr('number'),
    employeeId: DS.attr('number'),

    employee: DS.belongsTo('employee', {inverse: 'compensatoryLeaves'}),

});
