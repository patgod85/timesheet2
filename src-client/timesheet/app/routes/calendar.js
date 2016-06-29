import Auth from './auth';

export default Auth.extend({

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
