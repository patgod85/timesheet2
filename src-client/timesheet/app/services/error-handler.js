import Ember from 'ember';

export default Ember.Service.extend({

    handle(err){
//console.log(err.errors[0].detail);
        if (err.hasOwnProperty('errors')) {
            if (Array.isArray(err.errors)) {
                if(err.errors[0].detail){
                    alert(err.errors[0].detail);
                }
                else{
                    alert(err.errors[0].status + '. ' + err.errors[0].title);
                }
            }
            else {
                alert(err.errors.errors.join('; '));
            }
        }
        else if (err.hasOwnProperty('error')) {
            alert(err.error.message);
        }
    }
});
