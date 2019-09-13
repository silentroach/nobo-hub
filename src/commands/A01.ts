import { Component, serialize, validate } from '../structures/Component';

import { command } from '../command';

import { B01 } from '../responses';

/**
 * Adds a component to the hub internal database
 *
 * structure:
 * A01 <Component>
 *
 * example:
 * A01 200154035201 0 component_name 0 -1 23 2
 *
 * returns:
 * B01
 */
export default (component: Component) => {
	validate(component);
	return command('A01', serialize(component)).expect(B01);
};
