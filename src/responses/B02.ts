import { deserialize } from '../structures/WeekProfile';

import { Response } from '../response';

/**
 * Response for A02 command
 */
export default new Response('B02', deserialize);
