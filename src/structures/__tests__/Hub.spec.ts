import test from 'ava';

import { deserialize } from '../Hub';

test('deserialize normal reply', t => {
	t.snapshot(
		deserialize('123000012121 My Eco Hub 7200 64 114 11123610_rev._1 20181117')
	);
});

test('deserialize normal reply with no active override id', t => {
	t.snapshot(
		deserialize('123000012121 My Eco Hub 7200 -1 114 11123610_rev._1 20181117')
	);
});

test('deserializer throws on invalid data', t => {
	t.throws(() => deserialize('some invalid data'));
});
