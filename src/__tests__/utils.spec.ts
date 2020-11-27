import { escapeSpace, unescapeSpace } from '../utils';

it('using non-breaking spaces instead of spaces', () => {
	const value = 'convert spaces to non-breaking spaces';
	const escaped = escapeSpace(value);

	expect(escaped).not.toBe(value);
	expect(escaped).toMatchInlineSnapshot(
		`"convert spaces to non-breaking spaces"`
	);
	expect(value.split(/\s/g).length).toBe(escaped.split(/\xA0/g).length);

	expect(unescapeSpace(escaped)).toBe(value);
});
