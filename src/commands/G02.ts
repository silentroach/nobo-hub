import { command } from '../command';

import { H02 } from '../responses';

/**
 * Gets all components from hub
 *
 * structure:
 * G02
 *
 * example:
 * G02
 *
 * returns:
 * H02 (series)
 */
export default () => command('G02').expect(H02);
