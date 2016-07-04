import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr(),
    username: DS.attr(),
    name: DS.attr(),
    surname: DS.attr(),
    roles: DS.attr(),
    team_id: DS.attr('number'),
    team: DS.belongsTo('team', {inverse: 'users'}),
    theHeaviestRole: DS.attr()
});
