import { deserialize } from '../structures/Component';

import { Response } from '../response';

/**
 * Response to the U01 command
 */
export default new Response('V01', deserialize);
