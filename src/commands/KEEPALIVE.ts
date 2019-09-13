import { command } from '../command';

import { OK } from '../responses';

/**
 * Command to keep the connection open.
 * It is recommended to send it once every 14 seconds with not activity to remain connected
 *
 * returns:
 * OK
 */
export default () => command('KEEPALIVE').expect(OK);
