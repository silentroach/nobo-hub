import { deserialize, serialize, validate, Zone } from '../Zone';

describe('validate', () => {
	it('validate minimal valid info', () => {
		validate({
			id: 1,
			name: 'zone',
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false,
		});
	});

	it('validate throws on empty name', () => {
		expect(() =>
			validate({
				id: 1,
				name: '',
				comfortTemperature: 7,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();
	});

	it('validate throws on name is too long', () => {
		expect(() =>
			validate({
				id: 1,
				name: ['name is just t', 'o'.repeat(100), ' long'].join(' '),
				comfortTemperature: 7,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();
	});

	it('validate throws on invalid temperature', () => {
		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: -5,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();

		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 5,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();

		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 35,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();

		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 9,
				ecoTemperature: -5,
				allowOverrides: false,
			})
		).toThrow();

		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 9,
				ecoTemperature: 4,
				allowOverrides: false,
			})
		).toThrow();

		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 9,
				ecoTemperature: 35,
				allowOverrides: false,
			})
		).toThrow();
	});

	it('validate throws on eco temperature is greater than comfort temperature', () => {
		expect(() =>
			validate({
				id: 1,
				name: 'zone',
				comfortTemperature: 10,
				ecoTemperature: 15,
				allowOverrides: false,
			})
		).toThrow();
	});

	it('validate throws on invalid week profile id', () => {
		expect(() =>
			validate({
				id: 1,
				name: 'name',
				activeWeekProfileId: -5,
				comfortTemperature: 7,
				ecoTemperature: 7,
				allowOverrides: false,
			})
		).toThrow();
	});
});

describe('serialization', () => {
	it('should serialize/deserialize minimal component info', () => {
		const zone: Zone = {
			id: 1,
			name: 'zone',
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false,
		};

		const serialized = serialize(zone);
		expect(serialized).toMatchSnapshot();

		const deserialized = deserialize(serialized);

		zone.activeWeekProfileId = 1; // by default
		expect(zone).toEqual(deserialized);
	});

	it('should escape spaces in name', () => {
		const zone: Zone = {
			id: 1,
			name: 'zone with spaces',
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false,
		};

		const serialized = serialize(zone);
		expect(serialized).toMatchSnapshot();

		const deserialized = deserialize(serialized);

		zone.activeWeekProfileId = 1; // by default
		expect(zone).toEqual(deserialized);
	});

	it('name with utf', () => {
		const zone: Zone = {
			id: 1,
			name: 'zone 😎',
			comfortTemperature: 7,
			ecoTemperature: 7,
			allowOverrides: false,
		};

		const serialized = serialize(zone);
		expect(serialized).toMatchSnapshot();

		const deserialized = deserialize(serialized);

		zone.activeWeekProfileId = 1; // by default
		expect(zone).toEqual(deserialized);
	});
});
