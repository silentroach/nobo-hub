import { deserialize } from '../structures/Zone';

import { Response } from '../response';

/**
 * Part of response to G00 command
 * Response to G01 command
 */
export default new Response('H01', deserialize);
