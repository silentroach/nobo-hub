import { command } from '../command';

import { H00, H01, H02, H03, H04, Y02 } from '../responses';

/**
 * Gets all information from hub
 *
 * structure:
 * G00
 *
 * example:
 * G00
 *
 * returns:
 * H01, H02, H03, H04, Y02, V06
 *
 * start: H00
 * stop: H05
 */
export default () =>
	command('G00').expect(
		H00,
		H01,
		H02,
		H03,
		H04,
		Y02
		// @todo V06
	);
