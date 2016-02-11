import Ember from 'ember';

export function sum(params/*, hash*/) {
    if(!Array.isArray(params)){
        return params;
    }

    let result = 0;
    params.map(item => {
        result += item;
    });
    return result;
}

export default Ember.Helper.helper(sum);
