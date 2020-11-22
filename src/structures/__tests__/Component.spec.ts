import { Component, deserialize, serialize, validate } from '../Component';

describe('validation', () => {
	it('validate normal info', () => {
		validate({
			serialNumber: '200154035201',
			name: 'name',
		});
	});

	it('validate spaces in name', () => {
		validate({
			serialNumber: '200154035201',
			name: 'name with multiple words',
		});
	});

	it('validate throws on invalid serial number', () => {
		expect(() =>
			validate({
				serialNumber: 'just bad',
				name: 'name',
			})
		).toThrow();

		expect(() =>
			validate({
				serialNumber: '20015403520112345',
				name: 'name',
			})
		).toThrow();

		expect(() =>
			validate({
				serialNumber: '300154035201',
				name: 'name',
			})
		).toThrow();
	});

	it('validate throws on empty name', () => {
		expect(() => {
			validate({
				serialNumber: '200154035201',
				name: '',
			});
		}).toThrow();
	});

	it('validate throws on too long name', () => {
		expect(() =>
			validate({
				serialNumber: '200154035201',
				name: ['name is just t', 'o'.repeat(100), ' long'].join(' '),
			})
		).toThrow();
	});
});

describe('serialization', () => {
	it('serialize minimal component info', () => {
		const component: Component = { serialNumber: '200154035201', name: 'name' };

		const serialized = serialize(component);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(component);
	});

	it('escape component name with spaces and emoji', () => {
		const component: Component = {
			serialNumber: '200154035201',
			name: 'some utf 🦄 name',
		};

		const serialized = serialize(component);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(component);
	});

	it('escape component name with spaces', () => {
		const component: Component = {
			serialNumber: '200154035201',
			name: 'some name',
		};

		const serialized = serialize(component);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(component);
	});

	it('serialize component with zone id', () => {
		const component: Component = {
			serialNumber: '200154035201',
			name: 'name',
			zoneId: 5,
		};

		const serialized = serialize(component);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(component);
	});

	it('serialize component as a zone sensor', () => {
		const component: Component = {
			serialNumber: '200154035201',
			name: 'name',
			sensorForZoneId: 5,
		};

		const serialized = serialize(component);
		expect(serialized).toMatchSnapshot();

		expect(deserialize(serialized)).toEqual(component);
	});

	it('deserializer throws on invalid data', () => {
		expect(() => deserialize('some invalid data'));
	});
});
