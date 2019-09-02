/**
 * Error message
 *
 * @todo E01, E02, E03 reexport?
 *
 * structure
 * E00 <command> <message>
 *
 * example
 * E00 U06 Wrong number of/format of arguments
 */
export const E00 = (input: string): never => {
	const [command, ...message] = input.split(/\s/);

	throw new TypeError(`Command ${command} error: ${message.join(' ')}`);
};
