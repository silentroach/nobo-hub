import { deserialize } from '../structures/Zone';

import { Response } from '../response';

/**
 * Response to the U00 command
 */
export default new Response('V00', deserialize);
