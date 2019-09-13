import { deserialize } from '../structures/WeekProfile';

import { Response } from '../response';

/**
 * Part of response to G00 command
 * Response to G03 command
 */
export default new Response('H03', deserialize);
