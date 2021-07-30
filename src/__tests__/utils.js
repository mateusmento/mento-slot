import ReactDOM from 'react-dom';

function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}
