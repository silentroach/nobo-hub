export enum Mode {
	Normal = 0,
	Comfort = 1,
	Eco = 2,
	Away = 3,
}

export enum Type {
	Now = 0,
	Timer = 1,
	FromTo = 2,
	Constant = 3,
}

export enum Target {
	Hub = 0,
	Zone = 1,
}

export interface Override {
	/**
	 * Ignored when you add an override, will return new id
	 */
	id: number;
	mode: Mode;
	type: Type;
	/**
	 * Start time, used for FromTo type only
	 */
	startTime?: any; // @todo
	/**
	 * End time, used for FromTo type only
	 */
	endTime?: any; // @todo
	target: Target;
	/**
	 * Zone id if target is zone
	 */
	targetId?: number; // -1 if hub (undefined) or zone id
}

export const validate = (override: Override) => {
	if (override.type === Type.FromTo) {
		if (override.startTime === undefined) {
			throw new TypeError(
				'Start time is not defined for override with type From-To'
			);
		}

		if (override.endTime === undefined) {
			throw new TypeError(
				'End time is not defined for override with type From-To'
			);
		}
	}

	if (override.target === Target.Zone && override.targetId === undefined) {
		throw new TypeError(
			'Target zone id is not defined for zone targeted override'
		);
	}
};

// <Id> <Mode> <Type> <End time> <Start time> <Override target> <Override target id>
const OverrideRegexp = /^(?<id>\d+)\s(?<mode>\d)\s(?<type>\d)\s(?<end>-1)\s(?<start>-1)\s(?<target>\d)\s(?<targetId>-?\d+)$/;

export const deserialize = (input: string): Override => {
	const matches = input.match(OverrideRegexp);
	if (matches === null) {
		throw new SyntaxError('Invalid override info structure');
	}

	const groups = matches.groups as {
		id: string;
		mode: string;
		type: string;
		end: string;
		start: string;
		target: string;
		targetId: string;
	};

	const override: Override = {
		id: Number(groups.id),
		mode: Number(groups.mode),
		type: Number(groups.type),
		target: Number(groups.target),
	};

	// @todo start + end

	const targetId = Number(groups.targetId);
	if (targetId !== -1) {
		override.targetId = targetId;
	}

	return override;
};

export const serialize = (override: Override) =>
	[
		override.id,
		override.mode,
		override.type,
		override.type === Type.FromTo ? override.endTime : -1,
		override.type === Type.FromTo ? override.startTime : -1,
		override.target,
		override.target === Target.Zone ? override.targetId : -1,
	].join(' ');
