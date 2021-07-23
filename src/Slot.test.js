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
			<Slot $name="tag" $source={children}/>
		</>

	let element = (
		<Component>
			<h2 $title>Article title</h2>
			<h4 $description>Article description</h4>
			<span $tag className="tag">news</span>
			<span $tag className="tag">today</span>
			<span $tag className="tag">good news</span>
			<span $wrong-slot-name>Not rendered</span>
			<span>Also not rendered</span>
		</Component>
	);

	test("should be filled with all corresponding named fillings", () => {
		let { container } = render(element);
		screen.getByText("Article title", { selector: "h2" });
		screen.getByText("Article description", { selector: "h4"});
		expect(container.querySelectorAll("span.tag")).toHaveLength(3);
	});

	test("should not be filled with unnamed fillings or not corresponding named fillings", () => {
		render(element);
		screen.getByText("Article title", { selector: "h2" });
		expect(screen.queryByText("Not rendered")).not.toBeInTheDocument();
		expect(screen.queryByText("Also not rendered")).not.toBeInTheDocument();
	});
});

describe("Named slots with not corresponding filling found", () => {
	test.todo("should render nothing if default content and $as prop are not defined");
	test.todo("should render only default content if it is defined and $as prop not defined");
	test.todo("should render a empty element base on $as prop if it defined and default content not defined")
	test.todo("should render a wrapper element base on $as prop containing default content if both are defined");
});

test.todo("Fillings should be placed in appropriate slot positions");

test.todo("slots should treat react element as valid source of fillings");
test.todo("slots should treat string as valid source of fillings");
test.todo("slots should treat number as valid source of fillings");
test.todo("slots should treat array as valid source of fillings");

test.todo("fillings props should remain");
test.todo("named slot default props should be passed to all fillings");
