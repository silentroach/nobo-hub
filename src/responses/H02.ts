import { deserialize } from '../structures/Component';

import { Response } from '../response';

/**
 * Part of response to G00 command
 * Response to G02 command
 */
export default new Response('H02', deserialize);
