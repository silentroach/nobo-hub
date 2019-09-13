import { Override, serialize } from '../structures/Override';

import { command } from '../command';

/**
 * Updates an override in the hub internal database
 *
 * structure:
 * U03 <Override>
 *
 * example:
 * U03 1 2 0 -1 -1 0 1
 *
 * returns:
 * V03
 */
export default (override: Override) => command('U03', serialize(override));
// @expect V03
