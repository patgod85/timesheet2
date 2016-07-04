
import Ember from 'ember';

export default Ember.Service.extend({

    configuration: Ember.inject.service('configuration'),

    getTheHeaviestRole(roles) {

        var configuration = this.get('configuration');
        var selectedRole = null;

        roles.map(role => {
            var indexOfCurrentRole = configuration.rolesWeight.indexOf(role);

            if(!selectedRole && indexOfCurrentRole > -1 || indexOfCurrentRole > -1 && indexOfCurrentRole < configuration.rolesWeight.indexOf(selectedRole)){
                selectedRole = role;
            }
        });

        return selectedRole;
    },

    doesRouteAllowedForRole(route, _role){
        var configuration = this.get('configuration');

        var role = configuration.roles[_role];

        if(role){
            if(route.match(new RegExp(role.pattern))){
                return true;
            }
        }

        return false;
    },

    getMenuItemsForRole(_role){
        var configuration = this.get('configuration');

        var role = configuration.roles[_role];

        if(role){
            return role.menuItems;
        }

        return [];
    }
});
