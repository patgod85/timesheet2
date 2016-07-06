export function initialize(application) {
    // Injects all Ember components with a router object:
    application.inject('component', 'router', 'router:main');
    application.inject('route', 'error-handler', 'service:error-handler');
    application.inject('component', 'error-handler', 'service:error-handler');
}

export default {
    name: 'component-router-injector',
    initialize
};
