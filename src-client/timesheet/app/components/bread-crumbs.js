import Ember from 'ember';

export default Ember.Component.extend({
    willRender(){
        var currentPath = this.get('router').get('currentPath');
//console.log(this.get('router'));
//console.log(currentPath);
        this.setProperties({currentPath});
    }
});
