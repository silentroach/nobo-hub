import test from 'ava';

import {
	deserialize,
	Mode,
	Override,
	serialize,
	Target,
	Type,
} from '../Override';

test('should serialize/deserialize minimal override info', (t) => {
	const override: Override = {
		id: 5,
		mode: Mode.Normal,
		type: Type.Now,
		target: Target.Hub,
	};

	const serialized = serialize(override);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), override);
});

test('should serialize/deserialize override info with zone target', (t) => {
	const override: Override = {
		id: 5,
		mode: Mode.Normal,
		type: Type.Now,
		target: Target.Zone,
		targetId: 5,
	};

	const serialized = serialize(override);
	t.snapshot(serialized);

	t.deepEqual(deserialize(serialized), override);
});
