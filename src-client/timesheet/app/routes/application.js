import Ember from 'ember';

export default Ember.Route.extend({
    model() {

        return Ember.$.ajax({
            url: '/whoami'
        }).then(
            (user) => {
                if(!user){
                    window.location.replace("/login");
                }
                else{
                    return {user};
                }
            },
            () => {
                window.location.replace("/login");
            }
        );
    }

});
