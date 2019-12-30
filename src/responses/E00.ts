import { CommandError } from '../command';
import { Response } from '../response';

/**
 * Error message
 *
 * structure
 * E00 <command> <message>
 *
 * example
 * E00 U06 Wrong number of/format of arguments
 */
export default new Response('E00', (input: string): never => {
	const [command, ...message] = input.split(/\s/);

	throw new CommandError(command, message.join(' '));
});
