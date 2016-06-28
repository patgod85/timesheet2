import Ember from 'ember';
import {doesRouteAllowedForRole, getTheHeaviestRole} from '../utils/roles';

export default Ember.Route.extend({

    beforeModel: function () {
        var user = this.modelFor('application').user;

        var theHeaviestRole = getTheHeaviestRole(user.roles);

        if(!doesRouteAllowedForRole(this.get('routeName'), theHeaviestRole)) {
            this.transitionTo('unauthorized');
        }
    }
});

