import { command } from '../command';

import { H04 } from '../responses';

/**
 * Gets all active overrides from hub
 *
 * structure:
 * G04
 *
 * example:
 * G04
 *
 * returns:
 * H04 (series)
 */
export default () => command('G04').expect(H04);
