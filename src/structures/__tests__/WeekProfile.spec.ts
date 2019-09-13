import test from 'ava';

import {
	deserialize,
	serialize,
	validate,
	Status,
	WeekProfile
} from '../WeekProfile';

test('validate normal info', t => {
	validate({
		id: 5,
		name: 'name',
		program: [[5, 15, Status.Off]]
	});

	t.pass();
});

test('validate spaces in name', t => {
	validate({
		id: 5,
		name: 'name',
		program: [[5, 15, Status.Off]]
	});

	t.pass();
});

test('validate throws on empty name', t => {
	t.throws(() =>
		validate({
			id: 5,
			name: '',
			program: [[5, 15, Status.Off]]
		})
	);
});

test('validate throws on invalid name', t => {
	t.throws(() =>
		validate({
			id: 5,
			program: [[5, 15, Status.Off]],
			name: ['name is just t', 'o'.repeat(150), ' long'].join(' ')
		})
	);
});

test('validate throws on empty program ', t => {
	t.throws(() =>
		validate({
			id: 5,
			name: 'name',
			program: []
		})
	);
});

test('validate throws on invalid program time', t => {
	t.throws(() =>
		validate({
			id: 5,
			name: 'name',
			program: [[-5, 15, Status.Off]]
		})
	);

	t.throws(() =>
		validate({
			id: 5,
			name: 'name',
			program: [[25, 15, Status.Off]]
		})
	);

	t.throws(() =>
		validate({
			id: 5,
			name: 'name',
			program: [[5, 75, Status.Off]]
		})
	);
});

test('validate throws on minutes not dividable by 15', t => {
	t.throws(() =>
		validate({
			id: 5,
			name: 'name',
			program: [[5, 10, Status.Off]]
		})
	);
});

test('serialize/deserialize minimal week profile info', t => {
	const profile: WeekProfile = {
		id: 5,
		name: 'name',
		program: [[0, 0, Status.Away]]
	};

	const serialized = serialize(profile);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), profile);
});

test('serialize/deserialize minimal week profile info with utf name', t => {
	const profile: WeekProfile = {
		id: 5,
		name: 'some ☃️ utf',
		program: [[0, 0, Status.Away]]
	};

	const serialized = serialize(profile);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), profile);
});

test('serialize/deserialize more complex week profile info', t => {
	const profile: WeekProfile = {
		id: 5,
		name: 'name',
		program: [
			[0, 0, Status.Away],
			[1, 0, Status.Comfort],
			[2, 0, Status.Eco],
			[3, 0, Status.Off]
		]
	};

	const serialized = serialize(profile);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), profile);
});

test('deserialize throws on invalid data', t => {
	t.throws(() => deserialize('some invalid data'));
});
