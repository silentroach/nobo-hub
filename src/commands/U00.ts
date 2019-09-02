import { serialize, Zone } from '../structures/Zone';

import { command } from '../command';

/**
 * Updates a zone in the hub internal database
 *
 * structure:
 * U00 <Zone>
 *
 * example:
 * U00 2 ZoneName 1 23 15 0 -1
 *
 * returns:
 * V00
 */
export const U00 = (zone: Zone) => command('U00', serialize(zone));
