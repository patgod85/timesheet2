import Ember from 'ember';

export default Ember.Service.extend({
    roles: {
        ROLE_USER: {
            pattern: '(unauthorized|about|contact)',
            menuItems: [
                {
                    route: 'my',
                    title: 'My schedule'
                }
            ]
        },

        ROLE_ADMIN: {
            pattern: '.*',
            menuItems: [
                {
                    route: 'teams',
                    title: 'Teams'
                },
                {
                    route: 'users',
                    title: 'Users'
                },
                {
                    route: 'employees',
                    title: 'Employees'
                },
                {
                    route: 'calendar',
                    title: 'Calendar'
                },
                {
                    route: 'events',
                    title: 'Events'
                }
            ]
        }
    },

    rolesWeight: [
        'ROLE_ADMIN',
        'ROLE_USER'
    ]
});