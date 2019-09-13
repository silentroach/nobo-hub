import { deserialize } from '../structures/WeekProfile';

import { Response } from '../response';

/**
 * Response for R02 command
 */
export default new Response('S02', deserialize);
