import Auth from '../auth';

export default Auth.extend({

    model(params) {
        return this.store.findRecord('user', params.user_id);
    },

    actions: {
        submit(model){
            model.save()
                .catch(this.get('error-handler').handle);
        },

        addRole(model, newRole){
            var self = this;
            var roles = model.get('roles');
            var previousRoles = roles.slice();
            roles.push(newRole);
            model.set('roles', roles);
            model.save()
                .catch(err => {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
        },

        deleteRole(model, _role){
            var self = this;
            var roles = model.get('roles');
            var previousRoles = roles.slice();
            model.set('roles', roles.filter(role => role !== _role));
            model.save()
                .catch(err => {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
        },

        deleteUser(model){
            var self = this;
            if(confirm('You try to completely remove the user. Are you sure?')){
                model.destroyRecord()
                    .then(() => {
                        self.get('router').transitionTo('users');
                    })
                    .catch(this.get('error-handler').handle);
            }
        }
    }
});

