import Ember from 'ember';

export default Ember.Component.extend({

    filterToken: null,
    sortToken: null,
    sortDirection: true,
    items: [],

    actions: {
        select(selected){

            this.set('filterToken', selected);
        },

        sort(selected){
            const previousValue = this.get('sortToken');

            if(previousValue === selected){
                this.set('sortDirection', !this.get('sortDirection'));
            }

            this.set('sortToken', selected);
        }
    },

    filterWithAll: Ember.computed('filter', function(){
        let filter = this.get('filter');

        filter.unshift({id: 'all', title: 'All'});

        return filter;
    }),

    filteredItems: Ember.computed('filterToken', 'sortToken', 'sortDirection', function(){
        const filterToken = this.get('filterToken');
        const sortToken = this.get('sortToken');

        let items = this.get('items');

        items = this.filterList(items, filterToken);

        return this.sortList(items, sortToken);
    }),

    sortList(a, token){
        if(!token){
            return a;
        }
        if(this.get('sortDirection')){
            return a.sortBy(token).reverseObjects();
        }
        return a.sortBy(token);
    },

    filterList(a, token){

        if(!token || token.id === 'all'){
            return a;
        }

        const index = this.get('id');

        return a.filter(function(item) {
            return item.get(index) + '' === token.id + '';
        });
    }
});
