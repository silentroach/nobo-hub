import { Component, serialize, validate } from '../structures/Component';

import { command } from '../command';

import { S01 } from '../responses';

/**
 * Removes a Component from the hub internal database.
 * All values except serial number are ignored
 *
 * structure:
 * R01 <Component>
 *
 * example:
 * R01 200154035201 0 component_name 0 -1 23 2
 *
 * returns:
 * S01
 */
export default (component: Component) => {
	validate(component);
	return command('R01', serialize(component)).expect(S01);
};
