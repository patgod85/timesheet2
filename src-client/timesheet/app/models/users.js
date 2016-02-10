import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr(),
    username: DS.attr(),
    name: DS.attr(),
    surname: DS.attr(),
    roles: DS.attr()
});
