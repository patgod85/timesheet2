import Ember from 'ember';

export default Ember.Component.extend({

    newEmployee: null,

    store: Ember.inject.service('store'),

    teamNames: Ember.computed.map('teams', function(team){
        return {
            id: team.get('id'),
            title: team.get('name')
        };
    }),

    init() {
        this._super(...arguments);

        this.set('newEmployee', Ember.Object.create({
            name: '',
            surname: '',
            position: '',
            calendar: '',
            workStart: '',
            workEnd: '',
            teamId: this.get('user').teamId
        }));
    },

    actions: {
        changeTeam(newValue){
            this.get('newEmployee').set('teamId', parseInt(newValue.id, 10));
        },

        submit(newEmployee){
            const self = this;

            const store = this.get('store');
            const employee = store.createRecord('employee', JSON.parse(JSON.stringify(newEmployee)));

            employee.save()
                .then(createdEmployee => {
                    alert('The employee successfully created');
                    const router = self.get('router');
                    router.transitionTo('employee.details', createdEmployee.id);
                })
                .catch(err => {
                    employee.deleteRecord();
                    this.get('error-handler').handle(err);
                });
        }
    }
});
