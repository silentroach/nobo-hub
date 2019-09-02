const NonBreakingSpace = String.fromCharCode(160);

export const escapeSpace = (value: string) =>
	value.replace(/\s/g, NonBreakingSpace);

export const unescapeSpace = (value: string) => value.replace(/\xA0/g, ' ');
