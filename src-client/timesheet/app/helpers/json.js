import Ember from 'ember';

export function json(params/*, hash*/) {
    return JSON.stringify(params);
}

export default Ember.Helper.helper(json);
