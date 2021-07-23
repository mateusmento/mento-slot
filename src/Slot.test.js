import ReactDOM from 'react-dom';
import Slot from './Slot';
import fireEvent from '@testing-library/user-event';
import { forwardRef } from 'react';


function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}

describe("A default slot", () => {

	let Component = ({children}) => <Slot $source={children}/>

	test("should be filled with unnamed fillings", () => {
		let actual = renderDOM(
			<Component>
				<h1>Hello World</h1>
				<small>Welcome to our page</small>
			</Component>
		);

		let expected = renderDOM(<>
			<h1>Hello World</h1>
			<small>Welcome to our page</small>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should not be filled with named slots", () => {
		let actual = renderDOM(
			<Component>
				<h1>Hello World</h1>
				<small $welcome>Welcome to our page</small>
				<a href="#">Start here</a>
			</Component>
		);

		let expected = renderDOM(<>
			<h1>Hello World</h1>
			<a href="#">Start here</a>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve any value besides react elements as filling", () => {
		let actual = renderDOM(
			<Component>
				{"Hello"} <b>world</b> {1} {[2, "3"]}{true}{null}
			</Component>
		);

		let expected = renderDOM(<>Hello <b>world</b> 1 23</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve fillings from non-array values as source of fillings", () => {
		let actual = renderDOM(<>
			<Component>Hello</Component>
			<Component><b>world</b></Component>
		</>);

		let expected = renderDOM(<>Hello<b>world</b></>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});


	test("should resolve fillings maintaining its props and ref", () => {
		let Welcome = forwardRef(({name, greet, ...props}, ref) => <h1 {...props} onClick={greet} ref={ref}>Welcome, {name}!</h1>)

		let actualRef = { current: null }
		let greet = jest.fn();

		let actual = renderDOM(
			<Component>
				<Welcome className="welcome" name="Mateus" greet={greet} ref={actualRef}/>
			</Component>
		);

		let expected = renderDOM(
			<h1 className="welcome">Welcome, Mateus!</h1>
		);

		fireEvent.click(actual.firstChild, {});

		expect(actual.innerHTML).toBe(expected.innerHTML);
		expect(greet).toHaveBeenCalledTimes(1);
		expect(actualRef.current).toBe(actual.firstChild);
	});
});

describe("Named slots", () => {

	let Component = ({children}) =>
		<>
			<Slot $name="title" $source={children}/>
			<Slot $name="description" $source={children}/>
			<Slot $name="tag" $source={children}/>
		</>

	test("should be filled all corresponding named fillings", () => {
		let actual = renderDOM(
			<Component>
				<h2 $title>Article title</h2>
				<h4 $description>Article description</h4>
				<span $tag className="tag">news</span>
				<span $tag className="tag">today</span>
			</Component>
		);

		let expected = renderDOM(<>
			<h2>Article title</h2>
			<h4>Article description</h4>
			<span className="tag">news</span>
			<span className="tag">today</span>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should not be filled with unnamed fillings or not corresponding named fillings", () => {
		let actual = renderDOM(
			<Component>
				<h2 $title>Article title</h2>
				<span $wrong-slot-name>Not rendered</span>
				<span>Also not rendered</span>
			</Component>
		);

		let expected = renderDOM(<h2>Article title</h2>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should only treat react elements as fillings", () => {
		let actual = renderDOM(
			<>
				<Component>{"Hello world"}</Component>
				<Component>{12}</Component>
				<Component><b $title>Welcome</b></Component>
			</>
		);

		let expected = renderDOM(<b>Welcome</b>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve fillings maintaining its props and ref", () => {
		let Welcome = forwardRef(({name, greet, ...props}, ref) => <h1 {...props} onClick={greet} ref={ref}>Welcome, {name}!</h1>)

		let actualRef = { current: null };
		let greet = jest.fn();

		let actual = renderDOM(
			<Component>
				<Welcome $title className="welcome" name="Mateus" greet={greet} ref={actualRef}/>
			</Component>
		);

		let expected = renderDOM(
			<h1 className="welcome">Welcome, Mateus!</h1>
		);

		fireEvent.click(actual.firstChild, {});

		expect(actual.innerHTML).toBe(expected.innerHTML);
		expect(greet).toHaveBeenCalledTimes(1);
		expect(actualRef.current).toBe(actual.firstChild);
	});

	test("should have its name removed from resolved fillings", () => {
		let children = (<>
			<textarea $input $editor></textarea>
			<button></button>
			<input $input/>
		</>).props.children;

		let result = Slot.render({$name: "input", $source: children}, null);

		expect(result).toHaveLength(2);

		for (let {props} of result)
			expect(props).not.toHaveProperty("$input");
	});

	test.todo("should have default props passed to all fillings");
});

test("Fillings should be placed in appropriate slot positions", () => {
	let Component = ({children}) =>
		<>
			<Slot $name="title" $source={children}/>
			<Slot $name="description" $source={children}/>
			<Slot $source={children}/>
		</>

	let actual = renderDOM(
		<Component>
			<button>Get started</button>
			<small $description>Welcome to our page</small>
			<a href="#">Documentation</a>
			<h1 $title>Hello world</h1>
		</Component>
	);

	let expected = renderDOM(<>
		<h1>Hello world</h1>
		<small>Welcome to our page</small>
		<button>Get started</button>
		<a href="#">Documentation</a>
	</>);

	expect(actual.innerHTML).toBe(expected.innerHTML);
});

describe("Named slots with not corresponding filling found", () => {
	test.todo("should render nothing if default content and $as prop are not defined");
	test.todo("should render only default content if it is defined and $as prop not defined");
	test.todo("should render a empty element base on $as prop if it defined and default content not defined")
	test.todo("should render a wrapper element base on $as prop containing default content if both are defined");
});

test.todo("Fillings should be placed in appropriate slot positions");

test.todo("named slot default props should be passed to all fillings");
