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
  this.route('teams');
  this.route('team', {path: 'teams/:team_id'});
});

export default Router;
