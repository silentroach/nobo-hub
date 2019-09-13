import { deserialize } from '../structures/Component';

import { Response } from '../response';

/**
 * Response for R01 command
 */
export default new Response('S01', deserialize);
