import { deserialize } from '../structures/Zone';

import { Response } from '../response';

/**
 * Response for R00 command
 */
export default new Response('S00', deserialize);
