import Ember from 'ember';

export function isSelected([item, selectedValue]) {
    return item === selectedValue || item.id === selectedValue;
}

export default Ember.Helper.helper(isSelected);
