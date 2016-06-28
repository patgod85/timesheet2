import Ember from 'ember';
import Auth from './auth';

export default Auth.extend({
    model(params) {
        return this.store
            .findRecord('event', params.event_id);
    },
    actions: {
        submit(model){
            model.save();
        }
    }
});
