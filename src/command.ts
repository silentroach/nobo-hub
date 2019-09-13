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

export class Command {
	private readonly expectations: Map<string, Response<any>> = new Map();

	constructor(private readonly value: string) {}

	expect(...response: Response<any>[]): this {
		([] as Response<any>[]).concat(response).forEach(one => {
			this.expectations.set(one.name, one);
		});

		return this;
	}

	toString(): string {
		return this.value;
	}
}

export const command = (name: string, ...parameters: any[]): Command =>
	new Command([name, ...parameters].join(' ')).expect(E00);
