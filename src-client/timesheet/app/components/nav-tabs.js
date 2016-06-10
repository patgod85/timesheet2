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

        var tabs = this.get('tabs');
        var currentPath = this.get('currentPath');

        return tabs.map(t => {
            var tab = Ember.Object.create(t);
            tab.set('className', tab.get('route') === currentPath ? 'active' : '');
            return tab;
        });
    }),

    actions: {
        transition: function(){
            var self = this;
            var tryingCount = 0;
            var interval;

            function intervalFunction(){
                var currentPath = self.get('currentPath');
                var realPath = self.get('router').get('currentPath');
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
