import Auth from './auth';

export default Auth.extend({

    model() {
        return this.store.findRecord('calendar', 1)
            .then(function(model){
                model.set('calendars', [model.get('calendar')]);
                return model;
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
