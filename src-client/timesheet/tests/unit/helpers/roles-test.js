import {doesRouteAllowedForRole, getTheHeaviestRole } from '../../../utils/roles';
import { module, test } from 'qunit';


module('Unit | Utils | Roles', {
});


test('it works for defined role. ASC', function (assert) {
    let result = getTheHeaviestRole(['ROLE_USER', 'ROLE_ADMIN']);
    assert.equal(result, 'ROLE_ADMIN');
});

test('it works for defined role. DESC', function (assert) {
    let result = getTheHeaviestRole(['ROLE_ADMIN', 'ROLE_USER']);
    assert.equal(result, 'ROLE_ADMIN');
});


test('it works when UNDEFINED_ROLE is passed', function (assert) {
    let result = getTheHeaviestRole(['UNDEFINED_ROLE', 'ROLE_ADMIN', 'ROLE_USER']);
    assert.equal(result, 'ROLE_ADMIN');
});

test('it works when roles are not defined', function (assert) {
    let result = getTheHeaviestRole([]);
    assert.equal(result, null);
});

test('Route is allowed for ROLE_ADMIN', function (assert) {
    let result = doesRouteAllowedForRole('user', 'ROLE_ADMIN');
    assert.equal(result, true);
});

test('Route is not allowed for ROLE_USER', function (assert) {
    let result = doesRouteAllowedForRole('user', 'ROLE_USER');
    assert.equal(result, false);
});

test('Route is not allowed for UNDEFINED_ROLE', function (assert) {
    let result = doesRouteAllowedForRole('user', 'ROLE_UNDEFINED');
    assert.equal(result, false);
});


test('Route is allowed for ROLE_USER', function (assert) {
    let result = doesRouteAllowedForRole('unauthorized', 'ROLE_USER');
    assert.equal(result, true);
});
