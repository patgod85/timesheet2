import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name: DS.attr(),
    surname: DS.attr(),
    workStart: DS.attr('datephp', {
        defaultValue() { return null; }
    }),
    workEnd: DS.attr('datephp', {
        defaultValue() { return null; }
    }),
    position: DS.attr(),
    teamId: DS.attr('number'),
    team: DS.belongsTo('team', {inverse: 'employees'}),
    calendar: DS.attr(),

    full_name: Ember.computed('name', 'surname', function(){
        return this.get('name')+' '+this.get('surname');
    }),

    compensatoryLeaves: DS.hasMany('compensatory-leave', {inverse: 'employee'}),

});
