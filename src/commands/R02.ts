import { serialize, validate, WeekProfile } from '../structures/WeekProfile';

import { command } from '../command';

import { S02 } from '../responses';

/**
 * Removes a week profile from hub internal database.
 *
 * All values except week profile id are ignored. Any zones
 * that are set to use the week profile are set to use the default
 * week profile instead (+ V00 zone updated messages are sent)
 *
 * structure:
 * R02 <WeekProfile>
 *
 * example:
 * R02 12 week_profile_name 00000,02154,13453
 *
 * returns:
 * S02 // @todo ??? V00
 */
export default (profile: WeekProfile) => {
	validate(profile);
	return command('R02', serialize(profile)).expect(S02); //, V00);
};
