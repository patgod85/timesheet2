import Ember from 'ember';

import moment from 'moment';

export default Ember.Component.extend({

    hidden: true,

    newType: 11,
    newBegin: null,
    newEnd: null,

    eventTypesNames: Ember.computed('event_types', function(){
        return this.get('event_types').map(t => {return {id: parseInt(t.id, 10), title: t.get('name')}; });
    }),

    actions: {

        removeDiapason(diapasonBegin, diapasonEnd){
            if(confirm('Are you sure?')){
                const removeDiapasonAction = this.get('removeDiapasonAction');

                if(typeof removeDiapasonAction === 'function'){
                    removeDiapasonAction(diapasonBegin, diapasonEnd);
                }
            }
        },

        changeNewType(id){
            this.set('newType', id);
        },

        addDiapason(){
            if(confirm('Are you sure?')){
                const addDiapasonAction = this.get('addDiapasonAction');

                if(typeof addDiapasonAction === 'function'){
                    addDiapasonAction(moment(this.get('newBegin')).format('YYYY-MM-DD'), moment(this.get('newEnd')).format('YYYY-MM-DD'), this.get('newType'));
                }
            }
        },

        show(){
            this.set('hidden', false);
        },

        hide(){
            this.set('hidden', true);
        }
    }
});
