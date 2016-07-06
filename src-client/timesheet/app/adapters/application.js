import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'api',
    loadSaveResponse: true

    //handleResponse: function (status, headers, payload) {
    //    if (status == 422) {
    //    console.log(status, payload);
    //    }
    //    return this._super(...arguments);
    //}
});
