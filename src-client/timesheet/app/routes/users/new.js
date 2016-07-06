import Ember from 'ember';
import Auth from '../auth';

export default Auth.extend({
    model() {

        return Ember.RSVP.hash({
            teams: this.store.findAll('team'),
            user: this.modelFor('application').user
        });
    }

});
