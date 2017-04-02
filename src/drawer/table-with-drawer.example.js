import React, { PropTypes, PureComponent } from 'react';
import { AutoSizer, Table, Column } from 'react-virtualized';
import css from 'react-virtualized/styles.css'; 

import { generateRandomList } from '../list-maker'

import WithDrawer from './with-drawer';
import RowRendererWithDrawer from './row-renderer';


export default class TableWithDrawer extends PureComponent {

    constructor( props ) {
        super( props );

        this.list = generateRandomList();

    }

    _rowGetter = ( { index } ) => {

        return this.list[ index ];

    }

    render() {
       return (
        <WithDrawer
                drawerContent={ ( rowProps ) => {
                    return ( <div style={ { padding: 4 }}>More infos on { rowProps.rowData.name }</div> ); 
                } }
                rowsDimensions={ this.list.map( () => ( { collapsedHeight: 52, expandedHeight: 100 } ) ) }
            >
                { ( { rowHeight, rowRenderer, toggleDrawer, toggleDrawerWithAnimation, setTableRef } ) => (

                    <AutoSizer disableHeight>
                        {
                            ( { width } ) => (
                                <Table
                                    ref={ setTableRef }
                                    headerHeight={ 40 }
                                    height={ 600 }
                                    width={ width }
                                    rowCount={ this.list.length }
                                    rowGetter={ this._rowGetter }
                                    rowHeight={ rowHeight }
                                    rowRenderer={ rowRenderer }
                                    style={ { border: 'solid 1px black' } }
                                >
                                    <Column
                                        label="Toggle"
                                        dataKey="name"
                                        width={ 200 }
                                        cellRenderer= {
                                            ( { rowIndex } ) => {
                                                return (
                                                    <div>
                                                        <button onClick={ () => toggleDrawer( rowIndex ) }>Toggle Row</button><br />
                                                        <button onClick={ () => toggleDrawerWithAnimation( rowIndex ) }>with animation</button>
                                                    </div>
                                                );
                                            }
                                        }
                                    />
                                    <Column
                                        label="Name"
                                        dataKey="name"
                                        width={ 200 }
                                    />
                                    <Column
                                        label="What she/he had to say ..."
                                        dataKey="random"
                                        flexGrow= { 1 }
                                        flexShrink= { 0 }
                                        width={ 400 }
                                    />
                                </Table>
                            )
                        }
                    </AutoSizer>

                    
                ) }
            </WithDrawer>
       );
    }

}