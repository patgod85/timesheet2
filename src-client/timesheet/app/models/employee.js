import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    surname: DS.attr(),
    work_start: DS.attr(),
    work_end: DS.attr(),
    position: DS.attr(),
    team_id: DS.attr('number'),
    team: DS.belongsTo('team', {inverse: 'employees'})

});
