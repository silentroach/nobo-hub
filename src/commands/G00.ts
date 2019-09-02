import { command } from '../command';

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
 * H00, H01, H02, Y02, H03, H04, V06
 *
 * stop-response: H05
 */
export const G00 = () => command('G00');
