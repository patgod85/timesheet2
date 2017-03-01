import Ember from 'ember';
import Auth from './auth';

export default Auth.extend({
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
            headers: {
                id: '#',
                name: 'Name',
                teamId: 'Team',
                position: 'Position',
                workStart: 'Work start',
                workEnd: 'Work end'
            }
        });
    }
});
