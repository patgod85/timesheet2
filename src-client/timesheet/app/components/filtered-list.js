import Ember from 'ember';

export default Ember.Component.extend({

    filterToken: null,
    items: [],

    actions: {
        select(selected){

            this.set('filterToken', selected);
        }
    },

    filteredItems: Ember.computed('filterToken', function(){
        var filterToken = this.get('filterToken');

        if(!filterToken){
            return this.get('items');
        }

        return this.get('items').filter(item => {
            return item.get('team_id') === filterToken.id;
        });

    })
});
