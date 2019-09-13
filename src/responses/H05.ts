import { deserialize } from '../structures/Hub';

import { Response } from '../response';

/**
 * Part of response to G00 command
 */
export default new Response('H05', deserialize);
