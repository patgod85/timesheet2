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
    this.route('employees');
    this.route('employee', {path: 'employees/:employee_id'});
    this.route('calendar');
    this.route('events');
    this.route('event', {path: 'events/:event_id'});
});

export default Router;
