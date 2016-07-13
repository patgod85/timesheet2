import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        submit(model){
            model.save()
                .catch(this.get('error-handler').handle);

        }
    }
});
