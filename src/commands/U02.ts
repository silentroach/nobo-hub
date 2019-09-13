import { serialize, WeekProfile } from '../structures/WeekProfile';

import { command } from '../command';

/**
 * Updates a week profile in the hub internal database
 *
 * structure:
 * U02 <WeekProfile>
 *
 * example:
 * U02 12 week_profile_name 00000,02154,13453
 *
 * returns:
 * V02
 */
export default (profile: WeekProfile) => command('U02', serialize(profile));
// @todo expect V02
