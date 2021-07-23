import { render, screen } from '@testing-library/react';
import Slot from './Slot';

test("default slot should be filled with all unnamed fillings", () => {
	let Component = ({children}) =>
		<div>
			<Slot $source={children}/>
		</div>

	render(
		<Component>
			<label htmlFor="search">Search</label>
			<input id="search"/>
		</Component>
	);

	screen.getByLabelText("Search");
	screen.getByRole("textbox");
});

});

test.skip("named slots should be filled with all existing and corresponding named fillings", () => {
});

test.skip("slots without a filling should use Slot's children, if not a function, as default content", () => {
});

test.skip("named slots without a filling and with $as prop defined should use the prop as tag of the root element wrapping default content", () => {
});
