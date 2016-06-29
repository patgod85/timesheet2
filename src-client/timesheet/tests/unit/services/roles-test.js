import { moduleFor, test } from 'ember-qunit';

moduleFor('service:roles', 'Unit | Service | roles', {
  // Specify the other units that are required for this test.
   needs: ['service:configuration']
});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});


test('it works for defined role. ASC', function (assert) {
    let service = this.subject();
    let result = service.getTheHeaviestRole(['ROLE_USER', 'ROLE_ADMIN']);
    assert.equal(result, 'ROLE_ADMIN');
});

test('it works for defined role. DESC', function (assert) {
    let service = this.subject();
    let result = service.getTheHeaviestRole(['ROLE_ADMIN', 'ROLE_USER']);
    assert.equal(result, 'ROLE_ADMIN');
});


test('it works when UNDEFINED_ROLE is passed', function (assert) {
    let service = this.subject();
    let result = service.getTheHeaviestRole(['UNDEFINED_ROLE', 'ROLE_ADMIN', 'ROLE_USER']);
    assert.equal(result, 'ROLE_ADMIN');
});

test('it works when roles are not defined', function (assert) {
    let service = this.subject();
    let result = service.getTheHeaviestRole([]);
    assert.equal(result, null);
});

test('Route is allowed for ROLE_ADMIN', function (assert) {
    let service = this.subject();
    let result = service.doesRouteAllowedForRole('user', 'ROLE_ADMIN');
    assert.equal(result, true);
});

test('Route is not allowed for ROLE_USER', function (assert) {
    let service = this.subject();
    let result = service.doesRouteAllowedForRole('user', 'ROLE_USER');
    assert.equal(result, false);
});

test('Route is not allowed for UNDEFINED_ROLE', function (assert) {
    let service = this.subject();
    let result = service.doesRouteAllowedForRole('user', 'ROLE_UNDEFINED');
    assert.equal(result, false);
});


test('Route is allowed for ROLE_USER', function (assert) {
    let service = this.subject();
    let result = service.doesRouteAllowedForRole('unauthorized', 'ROLE_USER');
    assert.equal(result, true);
});
