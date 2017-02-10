import Ember from 'ember';

export function inc(n) {
  return parseInt(n, 10)+1;
}

export default Ember.Helper.helper(inc);
