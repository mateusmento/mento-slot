import { render, screen } from '@testing-library/react';
import Slot from './Slot';

describe("A default slot", () => {

	let Component = ({children}) => <Slot $source={children}/>

	test("should be filled with unnamed fillings", () => {
		let { container } = render(
			<Component>
				<h1>Hello World</h1>
				<small>Welcome to our page</small>
			</Component>
		);

		screen.getByText("Hello World", { selector: "h1"});
		screen.getByText("Welcome to our page", { selected: "small" });
		expect(container.childNodes).toHaveLength(2);
	});

	test("should not be filled with named slots", () => {
		let { container } = render(
			<Component>
				<h1>Hello World</h1>
				<small $welcome>Welcome to our page</small>
			</Component>
		);

		screen.getByText("Hello World", { selector: "h1"});
		expect(container.childNodes).toHaveLength(1);
	});
});

describe("Named slots", () => {

	let Component = ({children}) =>
		<>
			<Slot $name="title" $source={children}/>
			<Slot $name="description" $source={children}/>
		</>

	test("should be filled with all corresponding named fillings", () => {
	});

	test("should not be filled with unnamed fillings or not corresponding named fillings", () => {
	});
});

test.todo("Fillings should be placed in appropriate slot positions");

test.skip("slots without a filling should use Slot's children, if not a function, as default content", () => {
});

test.skip("named slots without a filling and with $as prop defined should use the prop as tag of the root element wrapping default content", () => {
});
