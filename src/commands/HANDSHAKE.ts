import { command } from '../command';

/**
 * Handshake command, send after HELLO
 *
 * structure:
 * HANDSHAKE
 *
 * returns:
 * HANDSHAKE
 */
export const HANDSHAKE = () => command('HANDSHAKE');
