import Ember from 'ember';

export default Ember.Route.extend({

    rolesService: Ember.inject.service('roles'),

    beforeModel: function () {

        var rolesService = this.get('rolesService');

        var user = this.modelFor('application').user;

        var theHeaviestRole = rolesService.getTheHeaviestRole(user.roles);

        if(!rolesService.doesRouteAllowedForRole(this.get('routeName'), theHeaviestRole)) {
            this.transitionTo('unauthorized');
        }
    }
});

