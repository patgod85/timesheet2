import Ember from 'ember';
import Auth from '../auth';

export default Auth.extend({
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
            headers: {
                id: '#',
                username: 'Username',
                name: 'Name',
                roles: 'Roles'
            }
        });
    }
});
