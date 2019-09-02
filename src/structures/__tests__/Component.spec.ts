import test from 'ava';

import { Component, deserialize, serialize, validate } from '../Component';

test('validate normal info', t => {
	validate({
		serialNumber: '200154035201',
		name: 'name'
	});

	t.pass();
});

test('validate spaces in name', t => {
	validate({
		serialNumber: '200154035201',
		name: 'name with multiple words'
	});

	t.pass();
});

test('validate throws on invalid serial number', t => {
	t.throws(() =>
		validate({
			serialNumber: 'just bad',
			name: 'name'
		})
	);

	t.throws(() =>
		validate({
			serialNumber: '20015403520112345',
			name: 'name'
		})
	);

	t.throws(() =>
		validate({
			serialNumber: '300154035201',
			name: 'name'
		})
	);
});

test('validate throws on invalid name', t => {
	t.throws(() =>
		validate({
			serialNumber: '200154035201',
			name: ['name is just t', 'o'.repeat(100), ' long'].join(' ')
		})
	);
});

test('serialize minimal component info', t => {
	const component: Component = { serialNumber: '200154035201', name: 'name' };

	const serialized = serialize(component);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), component);
});

test('escape component name with spaces and emoji', t => {
	const component: Component = {
		serialNumber: '200154035201',
		name: 'some utf 🦄 name'
	};

	const serialized = serialize(component);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), component);
});

test('escape component name with spaces', t => {
	const component: Component = {
		serialNumber: '200154035201',
		name: 'some name'
	};

	const serialized = serialize(component);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), component);
});

test('serialize component with zone id', t => {
	const component: Component = {
		serialNumber: '200154035201',
		name: 'name',
		zoneId: 5
	};

	const serialized = serialize(component);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), component);
});

test('serialize component as a zone sensor', t => {
	const component: Component = {
		serialNumber: '200154035201',
		name: 'name',
		sensorForZoneId: 5
	};

	const serialized = serialize(component);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), component);
});

test('deserializer throws on invalid data', t => {
	t.throws(() => deserialize('some invalid data'));
});
