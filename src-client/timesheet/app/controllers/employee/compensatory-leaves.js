import Ember from 'ember';

export default Ember.Controller.extend({

    store: Ember.inject.service('store'),

    newDate: null,
    newDescription: "Why the extra leave should be added",
    newValue: 1,

    actions: {
        onRemove(leave){
            if(confirm("Are you sure?")){
                leave.destroyRecord();
            }
        },

        onAdd(){

            const store = this.get('store');

            const newLeave = store.createRecord('compensatory-leave', {
                date: this.get('newDate'),
                description: this.get('newDescription'),
                value: this.get('newValue'),
                employeeId: this.get('model').employee.id,
                employee: this.get('model').employee,
            });

            newLeave.save()
                .then(() => {
                    alert('The leave is successfully created');
                })
                .catch(err => {
                    newLeave.destroyRecord();
                    this.get('error-handler').handle(err);
                });
        }
    }
});
