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

        this.set('newUser', Ember.Object.create({
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

            var store = this.get('store');
            var user = store.createRecord('user', JSON.parse(JSON.stringify(newUser)));

            user.save()
                .then(createdUser => {
                    alert('The user successfully created');
                    var router = self.get('router');
                    router.transitionTo('users.user', createdUser);
                })
                .catch(err => {
                    user.deleteRecord();
                    this.get('error-handler').handle(err);
                });
        }
    }
});
