import Ember from 'ember';

export default Ember.Component.extend({

    filterToken: null,
    items: [],

    actions: {
        select(selected){

            this.set('filterToken', selected);
        }
    },

    filterWithAll: Ember.computed('filter', function(){
        var filter = this.get('filter');

        filter.unshift({id: 'all', title: 'All'});

        return filter;
    }),

    filteredItems: Ember.computed('filterToken', function(){
        var filterToken = this.get('filterToken');

        if(!filterToken || filterToken.id === 'all'){
            return this.get('items');
        }

        var index = this.get('id');
        return this.get('items').filter(function(item) {
            return item.get(index) == filterToken.id;// jshint ignore:line
        });

    })
});
