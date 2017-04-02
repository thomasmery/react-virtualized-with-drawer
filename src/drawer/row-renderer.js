/**
 * External dependencies
 */
import React from 'react';

/**
 * row renderer for React-Virtualized Table that allows to show sub-rows in a drawer
 *	@return {React.element} the element to show in the row's drawer
 */
export default function RowRendererWithDrawer( {
	rowData,
	className,
	columns,
	style,
	collapsedHeight,
	expandedHeight,
	drawerContent,
	expanded
} ) {
	return (
		<div
			className={ className }
			style={ { ...style, display: 'block', borderBottom: 'solid 1px black', paddingTop: 10 } }
		>
			<div className="ReactVirtualized__Table__sub-row" style={ { display: 'flex', height: collapsedHeight } }>
				{columns}
			</div>
			<div className="ReactVirtualized__Table__sub-row" style={ { display: 'flex', height: expandedHeight - collapsedHeight } }>
				{
					( expanded )
						? drawerContent
						: ''
				}
			</div>
		</div>
	);
}
