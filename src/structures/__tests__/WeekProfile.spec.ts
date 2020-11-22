import {
	deserialize,
	serialize,
	validate,
	Status,
	WeekProfile,
} from '../WeekProfile';

describe('validation', () => {
	it('validate normal info', () => {
		validate({
			id: 5,
			name: 'name',
			program: [[5, 15, Status.Off]],
		});
	});

	it('validate spaces in name', () => {
		validate({
			id: 5,
			name: 'name',
			program: [[5, 15, Status.Off]],
		});
	});

	it('validate throws on empty name', () => {
		expect(() =>
			validate({
				id: 5,
				name: '',
				program: [[5, 15, Status.Off]],
			})
		).toThrow();
	});

	it('validate throws on invalid name', () => {
		expect(() =>
			validate({
				id: 5,
				program: [[5, 15, Status.Off]],
				name: ['name is just t', 'o'.repeat(150), ' long'].join(' '),
			})
		).toThrow();
	});

	it('validate throws on empty program ', () => {
		expect(() =>
			validate({
				id: 5,
				name: 'name',
				program: [],
			})
		).toThrow();
	});

	it('validate throws on invalid program time', () => {
		expect(() =>
			validate({
				id: 5,
				name: 'name',
				program: [[-5, 15, Status.Off]],
			})
		).toThrow();

		expect(() =>
			validate({
				id: 5,
				name: 'name',
				program: [[25, 15, Status.Off]],
			})
		).toThrow();

		expect(() =>
			validate({
				id: 5,
				name: 'name',
				program: [[5, 75, Status.Off]],
			})
		).toThrow();
	});

	it('validate throws on minutes not dividable by 15', () => {
		expect(() =>
			validate({
				id: 5,
				name: 'name',
				program: [[5, 10, Status.Off]],
			})
		).toThrow();
	});
});

describe('serialization', () => {
	it('serialize/deserialize minimal week profile info', () => {
		const profile: WeekProfile = {
			id: 5,
			name: 'name',
			program: [[0, 0, Status.Away]],
		};

		const serialized = serialize(profile);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(profile);
	});

	it('serialize/deserialize minimal week profile info with utf name', () => {
		const profile: WeekProfile = {
			id: 5,
			name: 'some ☃️ utf',
			program: [[0, 0, Status.Away]],
		};

		const serialized = serialize(profile);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(profile);
	});

	it('serialize/deserialize more complex week profile info', () => {
		const profile: WeekProfile = {
			id: 5,
			name: 'name',
			program: [
				[0, 0, Status.Away],
				[1, 0, Status.Comfort],
				[2, 0, Status.Eco],
				[3, 0, Status.Off],
			],
		};

		const serialized = serialize(profile);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(profile);
	});

	it('deserialize throws on invalid data', () => {
		expect(() => deserialize('some invalid data'));
	});
});
