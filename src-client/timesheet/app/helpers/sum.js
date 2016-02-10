import Ember from 'ember';

export function sum(params/*, hash*/) {
    let result = 0;
    params.map(item => {
        result += item;
    });
    return result;
}

export default Ember.Helper.helper(sum);
