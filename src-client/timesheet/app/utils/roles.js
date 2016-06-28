

const roles = {
    ROLE_USER: {
        pattern: '(unauthorized|about|contact)'
    },

    ROLE_ADMIN: {
        pattern: '.*'
    }
};

const rolesWeight = [
    'ROLE_ADMIN',
    'ROLE_USER'
];

export function getTheHeaviestRole(roles) {

    var selectedRole = null;

    roles.map(role => {
        var indexOfCurrentRole = rolesWeight.indexOf(role);

        if(!selectedRole && indexOfCurrentRole > -1 || indexOfCurrentRole > -1 && indexOfCurrentRole < rolesWeight.indexOf(selectedRole)){
            selectedRole = role;
        }
    });

    return selectedRole;
}

export function doesRouteAllowedForRole(route, _role){
    var role = roles[_role];

    if(role){
        if(route.match(new RegExp(role.pattern))){
            return true;
        }
    }

    return false;
}
