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
            var previousRoles = roles.slice();
            roles.push(newRole);
            model.set('roles', roles);
            model.save()
                .catch(err => {
                    if(err.hasOwnProperty('errors')){

                        alert(err.errors.errors.join('; '));
                    }
                    model.set('roles', previousRoles);
                });
        },

        deleteRole(model, _role){
            var roles = model.get('roles');
            var previousRoles = roles.slice();
            model.set('roles', roles.filter(role => role !== _role));
            model.save()
                .catch(err => {
                    if(err.hasOwnProperty('errors')){

                        alert(err.errors.errors.join('; '));
                    }
                    model.set('roles', previousRoles);
                });
        }
    }
});
