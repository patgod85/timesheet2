import Ember from 'ember';
import Auth from './auth';

export default Auth.extend({

    model(params) {
        return this.store.findRecord('user', params.user_id);
    },

    actions: {
        submit(model){
            model.save();
        },

        addRole(model, newRole){
            var roles = model.get('roles');
            roles.push(newRole);
            model.set('roles', roles);
            model.save();
        },

        deleteRole(model, _role){
            var roles = model.get('roles');
            model.set('roles', roles.filter(role => role !== _role));
            model.save();
        }
    }
});
