import { Response } from '../response';

enum RejectReasons {
	IncompatibleVersion = 0,
	SerialNumberMismatch = 1,
	WrongNumberOfArguments = 2,
	TimestampIncorrectlyFormatted = 3,
}

export default new Response('REJECT', (input: string): never => {
	const code = Number(input);

	switch (code) {
		case RejectReasons.IncompatibleVersion:
			throw new TypeError('Incompatible version');
		case RejectReasons.SerialNumberMismatch:
			throw new TypeError('Serial number mismatch');
		case RejectReasons.WrongNumberOfArguments:
			throw new TypeError('Arguments count mismatch');
		case RejectReasons.TimestampIncorrectlyFormatted:
			throw new TypeError('Timestamp incorrectly formatted');
		default:
			throw new TypeError('Unknown reject reason');
	}
});
