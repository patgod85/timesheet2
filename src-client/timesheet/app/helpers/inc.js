import Ember from 'ember';

export function inc(n) {
  return n+1;
}

export default Ember.Helper.helper(inc);
