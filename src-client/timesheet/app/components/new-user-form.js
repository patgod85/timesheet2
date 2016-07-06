import Ember from 'ember';

export default Ember.Component.extend({

    newUser: null,

    store: Ember.inject.service('store'),

    teamNames: Ember.computed.map('teams', function(team){
        return {
            id: team.get('id'),
            title: team.get('name')
        }
    }),

    init() {
        this._super(...arguments);

        var store = this.get('store');

        this.set('newUser', store.createRecord('user', {
            email: '',
            plainPassword: '',
            name: '',
            surname: '',
            username: '',
            teamId: this.get('user').teamId,
            roles: ['ROLE_USER']
        }));
    },

    actions: {
        changeTeam(newValue){
            this.get('newUser').set('teamId', parseInt(newValue.id, 10));
        },

        submit(newUser){
            var self = this;

            newUser.set('username', newUser.get('email'));

            newUser.save()
                .then(createdUser => {
                    var router = self.get('router');
//console.log(createdUser);
                    router.transitionTo('users.user', {id: createdUser.get('id')});
                })
                .catch(this.get('error-handler').handle);
        }
    }
});
