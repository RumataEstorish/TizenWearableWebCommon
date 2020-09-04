/*global Utils*/
QUnit.module("utils-2.1.4.8Test");

QUnit.test("toDateInputValue test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayTime test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayDate test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toYYYYMMDD test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toYYYYMMDDTHHMM test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayDateTime test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayTime test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayDate test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toYYYYMMDD test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toYYYYMMDDTHHMM test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("toDisplayDateTime test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getTheme test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getFileNameWithoutExtension test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getFileName test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("setTheme test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("createIndexScrollBar test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("generateUUID test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("appendHtmlAtCaret test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getRandomInt test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getGearVersion test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("isNewGear test", function() {
	assert.ok(false, "Not implemented");
});
QUnit.test("getActivePage test", function() {
	assert.ok(false, "Not implemented");
});

QUnit.test("bytesToSize", function(assert) {
	assert.ok(Utils.bytesToSize(0) === '0 Byte');
	assert.ok(Utils.bytesToSize(1000) === '1.00 KB');
	assert.throws(Utils.bytesToSize() === 'NAN undefined');
});

QUnit.test("isString", function(assert) {
	assert.ok(Utils.isString('String') === true);
	assert.ok(Utils.isString(10) === false);
	assert.ok(Utils.isString({
		a : 10
	}) === false);
	assert.ok(Utils.isString() === false);
	assert.ok(Utils.isString(function() {
	}) === false);
});

/*
 * QUnit.test("getFileExtension test", function() { assert.ok(false, "Not
 * implemented"); }); QUnit.test("dynamicSort test", function() {
 * assert.ok(false, "Not implemented"); }); QUnit.test("dynamicSortMultiple
 * test", function() { assert.ok(false, "Not implemented"); });
 */


QUnit.test('stringToBoolean', function(assert) {
	assert.ok(Utils.stringToBoolean("false", false) === false);
	assert.ok(Utils.stringToBoolean("true", false) === true);
	assert.ok(Utils.stringToBoolean(true, false) === true);
	assert.ok(Utils.stringToBoolean(false, true) === false);
	assert.ok(Utils.stringToBoolean('incorrectString', true) === true);
	assert.ok(Utils.stringToBoolean('incorrectString', false) === false);
	assert.ok(!Utils.stringToBoolean());
	assert.ok(!Utils.stringToBoolean('incorrectString'));
});

/*
 * QUnit.test("getMime test", function() { assert.ok(false, "Not implemented");
 * });
 */
QUnit.test("hashCode test", function(assert) {
	assert.ok(Utils.hashCode('hash code') === 250959295);
	assert.throws(function() {
		Utils.hashCode(1);
	});
	assert.throws(function() {
		Utils.hashCode();
	});
});