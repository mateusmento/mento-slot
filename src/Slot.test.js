import ReactDOM from 'react-dom';
import Slot from './Slot';

function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}

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

describe("Slots", () => {
	test("should resolve array fillings as source of fillings", () => {
		let Component = ({children}) => <>
			<Slot $source={children}/>
			<Slot $name="item" $source={children}/>
		</>

		let actual = renderDOM(
			<Component>
				{[1, 2].map(n => <div $item key={n}>{n}</div>)}
				<h1>Hello world</h1>
				{
					[
						<h2 key={1}>Welcome</h2>,
						[1, 2].map(n => <span $item key={n}>{n}</span>)
					]
				}
			</Component>
		);

		let expected = renderDOM(<>
			<h1>Hello world</h1>
			<h2 key={1}>Welcome</h2>
			{[1, 2].map(n => <div key={n}>{n}</div>)}
			{[1, 2].map(n => <span key={n}>{n}</span>)}
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});
});


describe("Slots with no corresponding filling found", () => {

	test("should render nothing if default content and $as prop are not defined", () => {
		let Component = ({children}) => <Slot $source={children}/>
		let actual = renderDOM(<Component/>);
		expect(actual).toBeEmptyDOMElement();
	});

	test("should render only default content if it is defined and $as prop not defined", () => {
		let Component = ({children}) => <Slot $source={children}>Hello world</Slot>
		let actual = renderDOM(<Component/>);
		let expected = renderDOM("Hello world");
		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should render a empty element base on $as prop if it is defined and default content not defined", () => {
		let Component = ({children}) => <Slot $as="button" $source={children}/>
		let actual = renderDOM(<Component/>);
		let expected = renderDOM(<button/>);
		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should render a wrapper element base on $as prop containing default content if both are defined", () => {
		let Component = ({children}) => <Slot $as="button" $source={children}>Hello world</Slot>
		let actual = renderDOM(<Component/>);
		let expected = renderDOM(<button>Hello world</button>);
		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should render a wrapper element base on defined $as prop containing slot all default props", () => {
		let Component = ({children}) => <Slot $as="button" $source={children} className="welcome">Hello world</Slot>
		let actual = renderDOM(<Component/>);
		let expected = renderDOM(<button className="welcome">Hello world</button>);
		expect(actual.innerHTML).toBe(expected.innerHTML);
	});
});
