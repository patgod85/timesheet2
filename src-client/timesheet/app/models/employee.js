import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name: DS.attr(),
    surname: DS.attr(),
    workStart: DS.attr('date'),
    workEnd: DS.attr(),
    position: DS.attr(),
    teamId: DS.attr('number'),
    team: DS.belongsTo('team', {inverse: 'employees'}),
    calendar: DS.attr(),

    full_name: Ember.computed('name', 'surname', function(){
        return this.get('name')+' '+this.get('surname');
    })
});
