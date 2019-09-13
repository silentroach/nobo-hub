import { command } from '../command';

import { H01 } from '../responses';

/**
 * Gets all zones from hub
 *
 * structure:
 * G01
 *
 * example:
 * G01
 *
 * returns:
 * H01 (series)
 */
export default () => command('G01').expect(H01);
