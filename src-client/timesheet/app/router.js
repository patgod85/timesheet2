import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function () {
    this.route('about');
    this.route('contact');
    this.route('users');
    this.route('user', {path: 'users/:user_id'});
});

export default Router;
