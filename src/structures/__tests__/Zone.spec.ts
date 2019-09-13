import test from 'ava';

import { deserialize, serialize, validate, Zone } from '../Zone';

test('validate minimal valid info', t => {
	validate({
		id: 1,
		name: 'zone',
		comfortTemperature: 7,
		ecoTemperature: 7,
		allowOverrides: false
	});

	t.pass();
});

test('validate throws on empty name', t => {
	t.throws(() =>
		validate({
			id: 1,
			name: '',
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);
});

test('validate throws on name is too long', t => {
	t.throws(() =>
		validate({
			id: 1,
			name: ['name is just t', 'o'.repeat(100), ' long'].join(' '),
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);
});

test('validate throws on invalid temperature', t => {
	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: -5,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);

	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 5,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);

	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 35,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);

	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 9,
			ecoTemperature: -5,
			allowOverrides: false
		})
	);

	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 9,
			ecoTemperature: 4,
			allowOverrides: false
		})
	);

	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 9,
			ecoTemperature: 35,
			allowOverrides: false
		})
	);
});

test('validate throws on eco temperature is greater than comfort temperature', t => {
	t.throws(() =>
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 10,
			ecoTemperature: 15,
			allowOverrides: false
		})
	);
});

test('validate throws on invalid week profile id', t => {
	t.throws(() =>
		validate({
			id: 1,
			name: 'name',
			activeWeekProfileId: -5,
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false
		})
	);
});

test('should serialize/deserialize minimal component info', t => {
	const zone: Zone = {
		id: 1,
		name: 'zone',
		comfortTemperature: 7,
		ecoTemperature: 7,
		allowOverrides: false
	};

	const serialized = serialize(zone);
	t.snapshot(serialized);

	const deserialized = deserialize(serialized);

	zone.activeWeekProfileId = 1; // by default
	t.deepEqual(zone, deserialized);
});

test('should escape spaces in name', t => {
	const zone: Zone = {
		id: 1,
		name: 'zone with spaces',
		comfortTemperature: 7,
		ecoTemperature: 7,
		allowOverrides: false
	};

	const serialized = serialize(zone);
	t.snapshot(serialized);

	const deserialized = deserialize(serialized);

	zone.activeWeekProfileId = 1; // by default
	t.deepEqual(zone, deserialized);
});

test('name with utf', t => {
	const zone: Zone = {
		id: 1,
		name: 'zone 😎',
		comfortTemperature: 7,
		ecoTemperature: 7,
		allowOverrides: false
	};

	const serialized = serialize(zone);
	t.snapshot(serialized);

	const deserialized = deserialize(serialized);

	zone.activeWeekProfileId = 1; // by default
	t.deepEqual(zone, deserialized);
});
