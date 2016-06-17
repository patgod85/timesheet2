import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        var team = this.modelFor('team').team;

        return Ember.RSVP.hash({
            team: this.store.findAll('user')
                .then(() => {
                    return team;
                })
        });
    },

    actions: {
        submit(model){
            model.save();
        }
    }
});

