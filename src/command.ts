import { Response } from './response';

import { E00 } from './responses';

export class CommandError extends Error {
	constructor(
		public readonly command: string,
		public readonly message: string
	) {
		super(message);
	}
}

// @todo terminator?
export class Command<K extends object | string = any> {
	private readonly expectations: Map<string, Response<K>> = new Map();

	constructor(private readonly value: string) {}

	public expect<T extends Response<K>>(...response: T[]): this {
		const responses = ([] as T[]).concat(response);
		responses.forEach((one) => {
			this.expectations.set(one.name, one);
		});

		return this;
	}

	public processResponse(code: string, data?: string): K | string | undefined {
		const expectation = this.expectations.get(code);
		if (!expectation || data === undefined) {
			return;
		}

		if (expectation.handler) {
			return expectation.handler(data);
		}

		return data;
	}

	public toString(): string {
		return this.value;
	}
}

export const command = (name: string, ...parameters: any[]): Command =>
	new Command([name, ...parameters].join(' ')).expect(E00);
