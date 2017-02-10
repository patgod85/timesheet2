import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
    this.route('about');
    this.route('contact');
    this.route('calendar');

    this.route('users', function(){
        this.route('new');
        this.route('user', {path: ':user_id'});
    });

    this.route('teams');
    this.route('team', {path: 'teams/:team_id'}, function () {

        this.route('employees', {path: 'employees'});
        this.route('calendar', {path: 'calendar'});
        this.route('users', {path: 'users'});
        this.route('details', {path: 'details'});
    });

    this.route('employees', {path: "employees"});
    this.route('employee', {path: 'employees/:employee_id'}, function () {

        this.route('details', {path: 'details'});
        this.route('calendar', {path: 'calendar'}, function () {
            this.route('report', {path: 'report'});
        });
        this.route('compensatory-leaves', {path: 'compensatory-leaves'});
        this.route('compensatory-leave', {path: 'compensatory-leaves/:id'});
    });

    this.route('events');
    this.route('event', {path: 'events/:event_id'});
    this.route('unauthorized');
    this.route('my');
});

export default Router;
