/**
* External dependencies
*/
import React, { Component, PropTypes } from 'react';
import TWEEN from 'tween.js';

/**
 * Internal dependencies
 */
import RowRendererWithDrawer from './row-renderer';

/**
 * Function as Child Component
 * allowing to compose a table with a collapsible drawer
 *
 * this FaCC will manage rows expansion state & animation
 *
 * it will take the drawer content and expected expanded/collapsed rows dimensions as props
 *
 * the decorated component is passed the necessary elements
 * it will need to render the table (rowHeight, rowRenderer, rowsExpandedState)
 *
 * and optionnaly controls to toggle the drawer (toggleDrawer, toggleDrawerWithAnimation)
 * as well as an toggleDrawerCellRenderer as a convenience
 *
 * it is also passed a setTableRef function that will set the ref to the React Virtualized table
 * so that it is possible to recomputeRowHeights() on the RV Table when a row is toggled
 *
 */

class WithDrawer extends Component {

	static propTypes = {

		/**
		* Function responsible for rendering children.
		* This function should implement the following signature:
		* (
			{
				rowHeight: number,
				rowRenderer: func - has to be passed as the React-Virtualized rowRenderer prop,
				toggleDrawer: func - can be used by decorated component to trigger drawer expansion
				toggleDrawerWithAnimation: func - can be used by decorated component to trigger drawer expansion
				toggleDrawerCellRenderer: func - can be passed as a cellRenderer prop for a RV Table Column

			}) => PropTypes.element
		*/
		children: PropTypes.func.isRequired,

		/**
		 * a function that will return the React element to be used in the drawer
		 * it will be passed the props that are passed to a RV rowRenderer
		 * so that the drawer content element can use them to display data
		 */
		drawerContent: PropTypes.func.isRequired,

		/**
		 * array of data for each row's drawer
		 * { collapsedHeight; number, expandedHeight: number }
		 */
		rowsDimensions: PropTypes.array.isRequired,
	}

	constructor( props ) {
		super( props );

		this.state = {
			rowsExpandedState: {}
		};

		// used by the expand row mechanism
		this.rowsHeight = [];
		this.rowsTween = {};
	}

	/**
	* a custom function as the row renderer
	* returning what we want to see in the drawer of each row
	*
	* @param {object} props passed by the React Virtualized rowRenderer function
	* @returns {React.element} a React element that will render a Table row
	*/
	rowRenderer = ( rowProps ) => {
		const drawerContent = this.props.drawerContent( rowProps );

		const {
			collapsedHeight,
			expandedHeight
		} = this.props.rowsDimensions[ rowProps.index ];

		return (
			<RowRendererWithDrawer
				drawerContent={ drawerContent }
				collapsedHeight={ collapsedHeight }
				expandedHeight={ expandedHeight }
				key={ rowProps.key }
				expanded={ this.state.rowsExpandedState[ rowProps.index ] }
				{ ...rowProps }
			/>
		);
	}

	/**
	 * toggles the drawer
	 */
	toggleDrawer = ( index ) => {
		this.setState( ( state ) => {
			return { rowsExpandedState: {
				...state.rowsExpandedState,
				[ index ]: ! state.rowsExpandedState[ index ],
			} };
		},
		() => this.table.recomputeRowHeights() );
	}

	/**
	* sets up & starts the drawer animated expansion mechanism
	* @param {integer} index - the index of the row we want to expand
	*/
	toggleDrawerWithAnimation = ( index ) => {
		const _this = this;
		this._animating = true;

		const expanded = this.state.rowsExpandedState[ index ];

		if ( ! expanded ) {
			_this.toggleDrawer( index );
		}

		const height = expanded
			? this.props.rowsDimensions[ index ].expandedHeight
			: this.props.rowsDimensions[ index ].collapsedHeight;

		const targetHeight = expanded
			? this.props.rowsDimensions[ index ].collapsedHeight
			: this.props.rowsDimensions[ index ].expandedHeight;

		this.rowsHeight[ index ] = { height };

		this.rowsTween[ index ] ? this.rowsTween[ index ].stop() : null;
		this.rowsTween[ index ] =
			new TWEEN.Tween( { height } )
			.to( { height: targetHeight }, 250 )
			.easing( TWEEN.Easing.Quadratic.Out )
			.onUpdate( function() {
				// store tweened height for this row
				_this.rowsHeight[ index ] = this.height;
				// React Virtualized needs this to update row heights & positions
				// on each frame
				_this.table.recomputeRowHeights( index );
			} )
			.onComplete( function() {
				delete _this.rowsHeight[ index ];
				if ( expanded ) {
					_this.toggleDrawer( index );
				}
				_this._animating = false;
			} )
			.start();

		// start the loop
		this._animate();
	}

	/**
	* starts the animation loop
	* @param {DOMHighResTimeStamp} time the current time
	*/
	_animate = ( time ) => {
		if ( this._animating ) {
			requestAnimationFrame( this._animate );
		}
		TWEEN.update( time );
	}

	rowHeight = ( { index } ) => {
		const {
			expandedHeight,
			collapsedHeight
		} = this.props.rowsDimensions[ index ];
		const expanded = this.state.rowsExpandedState[ index ];
		const initialHeight = expanded ? expandedHeight : collapsedHeight;
		return this.rowsHeight[ index ] || initialHeight;
	}

	setTableRef = ( element ) => {
		this.table = element;
	}

	render() {
		return this.props.children( {
			rowRenderer: this.rowRenderer,
			rowHeight: this.rowHeight,
			setTableRef: this.setTableRef,
			rowsExpandedState: this.state.rowsExpandedState,
			toggleDrawer: this.toggleDrawer,
			toggleDrawerWithAnimation: this.toggleDrawerWithAnimation,
		} );
	}
}

export default WithDrawer;
