import Ember from 'ember';

export default Ember.Service.extend({
    roles: {
        ROLE_USER: {
            pattern: '(unauthorized|about|contact)'
        },

        ROLE_ADMIN: {
            pattern: '.*'
        }
    },

    rolesWeight: [
        'ROLE_ADMIN',
        'ROLE_USER'
    ]
});