import { render, screen } from '@testing-library/react';
import Slot from './Slot';

describe("A default slot", () => {

	let Component = ({children}) =>
		<div>
			<Slot $source={children}/>
		</div>

	test("should be filled with unnamed fillings", () => {
		render(
			<Component>
				<h1>Hello World</h1>
				<small>Welcome to our page</small>
			</Component>
		);
	
		screen.getByText("Hello World", { selector: "h1"});
		screen.getByText("Welcome to our page", { selected: "small" });
	});

	test("should not be filled with named slots", () => {
		render(
			<Component>
				<h1>Hello World</h1>
				<small $welcome>Welcome to our page</small>
			</Component>
		);
	
		screen.getByLabelText("Search");
		screen.getByRole("textbox");
	});
});

});

test.skip("named slots should be filled with all existing and corresponding named fillings", () => {
});

test.skip("slots without a filling should use Slot's children, if not a function, as default content", () => {
});

test.skip("named slots without a filling and with $as prop defined should use the prop as tag of the root element wrapping default content", () => {
});
