import Ember from 'ember';

export default Ember.Route.extend({

    model(params) {

        return Ember.RSVP.hash({
            team: this.store.findRecord('team', params.team_id),
            tabs: [
                {route: 'team.employees', title: 'Employees', id: params.team_id},
                {route: 'team.calendar', title: 'Calendar', id: params.team_id},
                {route: 'team.users', title: 'Users', id: params.team_id},
                {route: 'team.details', title: 'Details', id: params.team_id}
            ]

        });
    },

    actions: {
        refresh(){
            this.refresh();
        }
    }
});
