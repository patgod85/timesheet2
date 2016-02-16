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
            users: this.store.findAll('user'),
            teams: this.store.findAll('team').then(teams => teams.map(prepareNames)),
            headers: ['#', 'Username', 'Name', 'Roles']
        });
    }
});
