import Auth from '../auth';

export default Auth.extend({

    model(params) {
        return this.store.findRecord('user', params.user_id);
    }
});

