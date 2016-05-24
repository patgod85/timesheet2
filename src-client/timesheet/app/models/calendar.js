import DS from 'ember-data';

export default DS.Model.extend({
    is_default: DS.attr(),
    ical: DS.attr()
});
