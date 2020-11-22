import {
	deserialize,
	Mode,
	Override,
	serialize,
	Target,
	Type,
} from '../Override';

it('serialize/deserialize minimal override info', () => {
	const override: Override = {
		id: 5,
		mode: Mode.Normal,
		type: Type.Now,
		target: Target.Hub,
	};

	const serialized = serialize(override);
	expect(serialized).toMatchSnapshot();

	expect(deserialize(serialized)).toEqual(override);
});

it('serialize/deserialize override info with zone target', () => {
	const override: Override = {
		id: 5,
		mode: Mode.Normal,
		type: Type.Now,
		target: Target.Zone,
		targetId: 5,
	};

	const serialized = serialize(override);
	expect(serialized).toMatchSnapshot();

	expect(deserialize(serialized)).toEqual(override);
});
