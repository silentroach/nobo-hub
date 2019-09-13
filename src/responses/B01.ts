import { deserialize } from '../structures/Component';

import { Response } from '../response';

/**
 * Response for A01 command
 */
export default new Response('B01', deserialize);
