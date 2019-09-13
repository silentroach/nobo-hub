import { deserialize } from '../structures/Override';

import { Response } from '../response';

/**
 * Part of response to G00 command
 * Response to G04 command
 */
export default new Response('H04', deserialize);
