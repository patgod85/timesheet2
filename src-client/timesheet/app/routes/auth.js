import Ember from 'ember';

export default Ember.Route.extend({

    rolesService: Ember.inject.service('roles'),

    beforeModel: function () {

        var rolesService = this.get('rolesService');

        var user = this.modelFor('application').user;

        if(!rolesService.doesRouteAllowedForRole(this.get('routeName'), user.theHeaviestRole)) {
            this.transitionTo('unauthorized');
        }
    }
});

