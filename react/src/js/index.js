/*
* @Author: Mark
* @Date:   2017-07-07 16:59:18
* @Last Modified by:   mark
* @Last Modified time: 2017-07-17 16:51:34
*/

import React, {Component, PropTypes} from 'react';

import Drop from './drop'


export default class Index extends Component {

	constructor(props) {
		super(props)
		
        this.fetch = (call)=>{
            console.log("111")
            setTimeout(()=>{
                call()
            },9000)
        }
 
	}

	render() {
		
		return (
			<div className={`index need`}>
                <Drop run={this.fetch}/>
			</div>		
			
		)
	}
}
