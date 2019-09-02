export const command = (name: string, ...parameters: any[]): string =>
	[[name, ...parameters].join(' '), ''].join('\r');
