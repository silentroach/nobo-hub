import { serialize, validate, WeekProfile } from '../structures/WeekProfile';

import { command } from '../command';

/**
 * Adds a week profile to the hub internal database
 *
 * structure:
 * A02 <WeekProfile>
 *
 * example:
 * A02 12 week_profile_name 00000,02154,13453
 *
 * returns:
 * B02
 */
export const A02 = (profile: WeekProfile) => {
	validate(profile);
	return command('A02', serialize(profile));
};
