import { command } from '../command';

import { HELLO, REJECT } from '../responses';

/**
 * First command to send after connection
 *
 * structure:
 * <version of command set> <Hub serial number> <date and time in format 'yyyyMMddHHmmss'>
 *
 * example:
 * HELLO 1.1 102000000123 20131220092040
 *
 * returns:
 * HELLO REJECT
 */
export default (serialNumber: string) => {
	const date = new Date();

	return command(
		'HELLO',
		'1.1',
		serialNumber,
		[
			date.getFullYear(),
			...[
				date.getMonth(),
				date.getDay(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
			].map((value) => String(value).padStart(2, '0')),
		].join('')
	).expect(HELLO, REJECT);
};
