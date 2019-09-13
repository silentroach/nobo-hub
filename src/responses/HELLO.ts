import { Response } from '../response';

/**
 * Hello command response message with hub version of command set
 *
 * structure
 * HELLO <version>
 *
 * example
 * HELLO 1.1
 */
export default new Response('HELLO', (input: string): string => input);
