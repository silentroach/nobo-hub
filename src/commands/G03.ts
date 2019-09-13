import { command } from '../command';

import { H03 } from '../responses';

/**
 * Gets all week profile data from hub
 *
 * structure:
 * G03
 *
 * example:
 * G03
 *
 * returns:
 * H03 (series)
 */
export default () => command('G03').expect(H03);
