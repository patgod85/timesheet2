import Ember from 'ember';

export default Ember.Component.extend({
    router: Ember.inject.service('router'),

    willRender(){
        var currentPath = this.get('router').get('currentPath');
        var url = this.get('router').get('url');
        //var currentPath = '123';
        //var url = '234234';


        var parts = url.split('/'),
            lastPart = parts[parts.length - 1];

        var crumbs = [
            {title: 'Home', pathName: 'index'}
        ];

        parts.filter(x => !!x).map(x => {
            if(x === currentPath){
                crumbs.push({title: currentPath});
            }
            else if(x === lastPart){
                crumbs.push({title: currentPath + ' (' + x + ')'});
            }
            else{
                crumbs.push({title: x, pathName: x});
            }
        });

        this.setProperties({crumbs});
    }
});
