import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return this.store.findRecord('calendar', 1)
            .then(function(calendar){
                return calendar;
            });
    },

    actions: {
        submit(model){
            model.save();
        },

        refresh(){
            this.refresh();
        }

    }
});
