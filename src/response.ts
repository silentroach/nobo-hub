export class Response<T extends object | string = any> {
	constructor(
		public readonly name: string,
		public readonly handler?: (input: string) => T
	) {}
}
