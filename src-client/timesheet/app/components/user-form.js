import Ember from 'ember';

export default Ember.Component.extend({
    enabledDisabled: [
        {id: false, title: 'Disabled'},
        {id: true, title: 'Enabled'}
    ],

    actions: {
        submit(model){
            model.save()
                .catch(this.get('error-handler').handle);
        },

        changeStatus(newValue){
            this.get('user').set('enabled', newValue.id);
        },

        addRole(model, newRole){
            const self = this;
            const roles = model.get('roles');
            const previousRoles = roles.slice();
            roles.push(newRole);
            model.set('roles', roles);
            model.save()
                .catch(err => {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
        },

        deleteRole(model, _role){
            const self = this;
            const roles = model.get('roles');
            const previousRoles = roles.slice();
            model.set('roles', roles.filter(role => role !== _role));
            model.save()
                .catch(err => {
                    self.get('error-handler').handle(err);
                    model.set('roles', previousRoles);
                });
        },

        deleteUser(model){
            const self = this;
            if(confirm('You try to completely remove the user. Are you sure?')){
                model.destroyRecord()
                    .then(() => {
                        self.get('router').transitionTo('users');
                    })
                    .catch(self.get('error-handler').handle);
            }
        }
    }});
