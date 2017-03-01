import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        submit(model){
            model.save()
                .catch(this.get('error-handler').handle);

        },

        deleteEmployee(model){
            const self = this;
            if(confirm('You try to completely remove the employee. Are you sure?')){
                model.destroyRecord()
                    .then(() => {
                        self.get('router').transitionTo('employees');
                    })
                    .catch(self.get('error-handler').handle);
            }
        }
    }
});
