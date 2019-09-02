import { Override, serialize, validate } from '../structures/Override';

import { command } from '../command';

/**
 * Adds an override to the hub internal database
 *
 * structure:
 * A03 <Override>
 *
 * example:
 * A03 1 2 0 -1 -1 0 1
 *
 * returns:
 * B03
 */
export const A03 = (override: Override) => {
	validate(override);
	return command('A03', serialize(override));
};
