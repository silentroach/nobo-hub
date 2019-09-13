import { command } from '../command';

import { HANDSHAKE } from '../responses';

/**
 * Handshake command, send after HELLO
 *
 * structure:
 * HANDSHAKE
 *
 * returns:
 * HANDSHAKE
 */
export default () => command('HANDSHAKE').expect(HANDSHAKE);
