import { deserialize } from '../Hub';

it('deserialize normal reply', () => {
	expect(
		deserialize('123000012121 My Eco Hub 7200 64 114 11123610_rev._1 20181117')
	).toMatchSnapshot();
});

it('deserialize normal reply with no active override id', () => {
	expect(
		deserialize('123000012121 My Eco Hub 7200 -1 114 11123610_rev._1 20181117')
	).toMatchSnapshot();
});

it('deserializer throws on invalid data', () => {
	expect(() => deserialize('some invalid data')).toThrow();
});
