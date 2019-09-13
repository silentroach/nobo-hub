import { deserialize } from '../structures/Override';

import { Response } from '../response';

/**
 * Response for A03 command
 */
export default new Response('B03', deserialize);
