import Ember from 'ember';

export default Ember.Route.extend({

    ajax: Ember.inject.service(),
    rolesService: Ember.inject.service('roles'),

    model() {
        const self = this;

        return Ember.RSVP.hash({

            user:
                this.get('ajax').request('/whoami')
                .then(user => {
                    if (!user || !user.username) {
                        throw "Unauthenticated";
                    }

                    return user;
                })
                .then(user => {
                    const rolesService = self.get('rolesService');

                    user.theHeaviestRole = rolesService.getTheHeaviestRole(user.roles);
                    user.menuItems = rolesService.getMenuItemsForRole(user.theHeaviestRole);

                    return user;
                })
                .catch(err => {
                    if(err !== 'Unauthenticated'){
                        throw err;
                    }
                    window.location.replace("/login");
                }),

            events: this.store.findAll('event')
        })
        .catch(err => {
            if(err.hasOwnProperty('errors') && err.errors.any(e => e.hasOwnProperty('status') && e.status >= 400 && e.status !== 403)){
                console.log("An error is caught during of loading. To avoid problems try to reload the page. \n " + err.message);
            }
            else{
                console.log('Error on application load', err);
            }
        });
    }

});
