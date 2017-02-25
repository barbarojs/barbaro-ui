import {h, Component} from 'preact';
import {StreamComponent} from 'barbarojs-stream';
import componentConstant from './constants.js';
import style from './style.scss';

class UiButton extends StreamComponent {
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
		return (
			<button
				class={ style.button }
				onClick={evt => this.handleClick(evt)}
			>{this.props.children}</button>
		);
	}
}

export default {
	component: UiButton,
	constants: componentConstant,
	style
};
