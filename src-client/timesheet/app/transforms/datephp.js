import Transform from 'ember-data/transform';
import moment from 'moment';
export default Transform.extend({
    deserialize(serialized) {
        if(serialized){
            return new Date(serialized);
        }
        return null;
    },

    serialize(deserialized) {
        if(!deserialized || deserialized === 'Invalid date'){
            return null;
        }
        return moment(deserialized).format("YYYY-MM-DD");
    }
});
