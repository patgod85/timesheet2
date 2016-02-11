import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store
            .findRecord('team', params.team_id)
            /*.then(function (team) {
                return Ember.RSVP.all(appointments.getEach('user'))
                    .then(function () {
                        return appointments;
                    });
            })*/;
    }
});
