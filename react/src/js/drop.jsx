import React, {Component, PropTypes} from 'react';

const el = document.body.classList;
export default class Drop extends Component {
	constructor(props) {
		super(props)
		this.state = {
			startY: 0,
			diffY: 0,
			moveY:0,
			distance:50,
			height:0
		}

		this.handleStart = (e) =>{
			e.preventDefault();
    		e.stopPropagation();
    		if (document.body.classList.contains('refreshing')) return;
			this.setState({
				startY: e.targetTouches[0].pageY,
				diffY: 0
			})
		}

		this.handleMove = (e) =>{
			if (document.body.classList.contains('refreshing') || !this.state.startY)return;
			e.preventDefault();
    		e.stopPropagation();
			let diffY = e.targetTouches[0].pageY - this.state.startY;
			diffY = Math.pow(diffY, 0.8);
			if (diffY < 0 ) diffY = 0;
			el.add('touching');
			if (diffY < this.state.distance) {
				el.remove("pull-up");
				el.add("pull-down");	
			}else{
				el.remove("pull-down");
				el.add("pull-up");
			}
			this.setState({
				diffY: diffY,
				height:diffY+'px'
			})
		}

		this.handleEnd = (e) =>{
			this.setState({
				startY: false
			})
			if (this.state.diffY <= 0 || el.contains('refreshing')) return;
			el.remove("touching");
			el.remove("pull-down");
			el.remove("pull-up");
			if (Math.abs(this.state.diffY) <= this.state.distance) {
				this.setState({
					height:0
				})
			}else{
				this.setState({
					height:this.state.distance
				})
				el.add("refreshing");
				console.log(this.props.run)
				this.refresh(this.props.run);
			}
			return false;

		}

		this.refresh = (callback) =>{
			if (callback) callback(this.pullToRefreshDone)
		}

		this.pullToRefreshDone = () =>{

			el.remove("refreshing"); //移除
    		this.setState({
    			height:0
    		})
		}
	}

	componentDidMount(){
		window.addEventListener('touchstart', this.handleStart.bind(this));
		window.addEventListener('touchmove', this.handleMove.bind(this));
		window.addEventListener('touchend', this.handleEnd.bind(this));
	}

	render(){
		return(
			<div className="dropload-layer" style={{height:this.state.height}}>
				<div className="inner">
					<div className="arrow">
					</div>
		        	<div className="loader"></div>
		        	<div className="down">下拉刷新</div>
		        	<div className="up">释放刷新</div>
		        	<div className="refresh">正在刷新</div>
	        	</div>
        	</div>
		)
	}
}