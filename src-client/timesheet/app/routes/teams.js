import Auth from './auth';

export default Auth.extend({
    model() {
        return this.store.findAll('team');
    }
});
