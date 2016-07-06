import DS from 'ember-data';

export default DS.Model.extend({
    isDefault: DS.attr(),
    calendar: DS.attr()
});
