import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    code: DS.attr(),
    title: DS.attr(),
    color: DS.attr(),
    background_color: DS.attr()

});
