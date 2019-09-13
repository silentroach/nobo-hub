import { Zone, serialize, validate } from '../structures/Zone';

import { command } from '../command';

import { S00, S01, V01 } from '../responses';

/**
 * Removes a Zone from the hub internal database.
 * All values except zone id are ignored.
 *
 * Any components in the zone are also deleted (+ S01).
 *
 * Any components used as temperature sensor for the zone is modified
 * to no longer be temperature sensor for the zone (+ V01).
 *
 * structure:
 * R00 <Zone>
 *
 * example:
 * R01 2 ZoneName 1 23 15 0 -1
 *
 * returns:
 * S00 S02 V01
 */
export default (component: Zone) => {
	validate(component);
	return command('R00', serialize(component)).expect(S00, S01, V01);
};
