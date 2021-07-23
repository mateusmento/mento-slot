import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import Slot from './Slot';

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

		expect(expected.innerHTML).toBe(actual.innerHTML);
	});

	test("should not be filled with named slots", () => {
		let actual = renderDOM(
			<Component>
				<h1>Hello World</h1>
				<small $welcome>Welcome to our page</small>
			</Component>
		);

		let expected = renderDOM(<h1>Hello World</h1>);

		expect(expected.innerHTML).toBe(actual.innerHTML);
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
