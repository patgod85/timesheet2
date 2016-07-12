import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr(),
    username: DS.attr(),
    name: DS.attr(),
    surname: DS.attr(),
    plainPassword: DS.attr(),
    roles: DS.attr(),
    teamId: DS.attr('number'),
    team: DS.belongsTo('team', {inverse: 'users'}),
    theHeaviestRole: DS.attr(),
    enabled: DS.attr()
});
