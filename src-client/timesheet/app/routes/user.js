import Auth from './auth';

export default Auth.extend({

    model(params) {
        return this.store.findRecord('user', params.user_id);
    },

    actions: {
        submit(model){
            model.save()
                .catch(err => {
                    handleError(err);
                });
        },

        addRole(model, newRole){
            var roles = model.get('roles');
            var previousRoles = roles.slice();
            roles.push(newRole);
            model.set('roles', roles);
            model.save()
                .catch(err => {
                    handleError(err);
                    model.set('roles', previousRoles);
                });
        },

        deleteRole(model, _role){
            var roles = model.get('roles');
            var previousRoles = roles.slice();
            model.set('roles', roles.filter(role => role !== _role));
            model.save()
                .catch(err => {
                    handleError(err);
                    model.set('roles', previousRoles);
                });
        }
    }
});

function handleError(err){
    if(err.hasOwnProperty('errors')){
        if(Array.isArray(err.errors)){
            alert(err.errors[0].status + '. ' + err.errors[0].title);
        }
        else{
            alert(err.errors.errors.join('; '));
        }
    }
    else if(err.hasOwnProperty('error')){
        alert(err.error.message);
    }
}
