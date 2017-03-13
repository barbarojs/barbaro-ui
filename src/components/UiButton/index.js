import {h, Component} from 'preact';
import {StreamComponent} from 'barbarojs-stream';
import componentConstant from './constants.js';
import style from './style.scss';

let className = style.locals;

export default class BUIButton extends StreamComponent {
	constructor(props) {
		super(props);
	}

	handleClick(evt) {
		this.streams.CHANGE.next({
			id: componentConstant.id,
			data: {
				id: this.props.id
			}
		});
	}

	render() {
		console.log("style is here", className);
		
		return (
			<button
				class={ className.button }
				onClick={evt => this.handleClick(evt)}
			>{this.props.children}</button>
		);
	}
}