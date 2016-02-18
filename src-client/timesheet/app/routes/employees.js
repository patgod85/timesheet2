import Ember from 'ember';

export default Ember.Route.extend({
    model() {

        function prepareNames(item){
            return {
                id: item.get('id'),
                title: item.get('name')
            };
        }

        return Ember.RSVP.hash({
            employees: this.store.findAll('employee'),
            teams: this.store.findAll('team').then(teams => teams.map(prepareNames)),
            headers: ['#', 'Name', 'Position', 'Work start', 'Work end']
        });
    }
});
