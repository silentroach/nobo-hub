import { serialize, validate, Zone } from '../structures/Zone';

import { B00 } from '../responses';

import { command } from '../command';

/**
 * Adds a zone to the hub internal database
 *
 * structure:
 * A00 <Zone>
 *
 * example:
 * A00 2 ZoneName 1 23 15 0 -1
 *
 * returns:
 * B00
 */
export default (zone: Zone) => {
	validate(zone);
	return command('A00', serialize(zone)).expect(B00);
};
