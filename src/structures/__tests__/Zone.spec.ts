import test from 'ava';

import { deserialize, serialize, Zone } from '../Zone';

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
