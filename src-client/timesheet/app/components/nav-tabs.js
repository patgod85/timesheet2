import Ember from 'ember';

export default Ember.Component.extend({

    router: Ember.inject.service('router'),

    clicks: null,

    currentPath: null,

    init(){
        this._super(...arguments);
        this.set('clicks', 0);
        this.set('currentPath', this.get('router').get('currentPath'));
    },

    localTabs: Ember.computed('tabs', 'clicks', 'currentPath', function(){

        const tabs = this.get('tabs');
        const currentPath = this.get('currentPath');

        if(!tabs){
            return [];
        }

        return tabs.map(t => {
            let tab = Ember.Object.create(t);
            tab.set('className', tab.get('route') === currentPath ? 'active' : '');
            return tab;
        });
    }),

    actions: {
        onTransition: function(){
            let self = this;
            let tryingCount = 0;
            let interval;

            function intervalFunction(){
                const currentPath = self.get('currentPath');
                const realPath = self.get('router').get('currentPath');
                if(currentPath !== realPath){
                    self.set('currentPath', realPath);
                    clearInterval(interval);
                }
                else if(tryingCount++ > 10){
                    clearInterval(interval);
                }
            }

            interval = setInterval(intervalFunction, 100);
        }
    }
});
