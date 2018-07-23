<template>
	<div class="dropload-layer" :style="{height:height}">
		<div class="inner">
			<div class="arrow">
			</div>
        	<div class="loader"></div>
        	<div class="down">下拉刷新</div>
        	<div class="up">释放刷新</div>
        	<div class="refresh">正在刷新</div>
    	</div>
	</div>
</template>

<script type="text/javascript">
	const el = document.body.classList;

	export default {
		name:'Drop',
		props:{
			run:Function,
        	required: true
		},
		data(){
			return {
				startY: 0,
				diffY: 0,
				moveY:0,
				distance:50,
				height:0
			}
		},
		methods:{

			handleStart(e){
				
	    		if (document.body.classList.contains('refreshing')) return;
	    		this.startY = e.targetTouches[0].pageY;
	    		this.diffY = 0;
			},

			handleMove(e){

				if (document.body.classList.contains('refreshing') || !this.startY)return;
			
				let diffY = e.targetTouches[0].pageY - this.startY;
				diffY = Math.pow(diffY, 0.8);
				if (diffY < 0 ) diffY = 0;
				el.add('touching');
				if (diffY < this.distance) {
					el.remove("pull-up");
					el.add("pull-down");	
				}else{
					el.remove("pull-down");
					el.add("pull-up");
				}
				this.diffY = diffY;
				this.height = diffY+'px';
			},

			handleEnd(e){

				this.startY = false;
				if (this.diffY <= 0 || el.contains('refreshing')) return;
				el.remove("touching");
				el.remove("pull-down");
				el.remove("pull-up");
				if (Math.abs(this.diffY) <= this.distance) {
					this.height = 0;
				}else{
					this.height = this.distance;
					el.add("refreshing");
					this.$emit('run',this.pullToRefreshDone);
				}
				return false;
			},

		

			pullToRefreshDone(){
				console.log("#33")
				el.remove("refreshing"); //移除
				this.height = 0;
			}

		},
		mounted(){

			window.addEventListener('touchstart', this.handleStart.bind(this));
			window.addEventListener('touchmove', this.handleMove.bind(this));
			window.addEventListener('touchend', this.handleEnd.bind(this));
		}
	}
</script>

<style scoped>
.dropload-layer{height:0;overflow:hidden;line-height:50px;text-align:center;-webkit-transition:.4s;transition:.4s;position: relative}
.dropload-layer .inner{position: absolute;left: 0;right: 0;bottom: 0;}

.dropload-layer .down{display:inline-block}
.dropload-layer .refresh,.dropload-layer .up{display:none}
.dropload-layer .arrow{display:inline-block;width:20px;height:20px;margin-right:4px;vertical-align:middle;-webkit-transition:.4s;transition:.4s;-webkit-transform:rotate(0deg) translate3d(0,0,0);transform:rotate(0deg) translate3d(0,0,0);background-size:13px 20px;background:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2026%2040'%3E%3Cpolygon%20points%3D'9%2C22%209%2C0%2017%2C0%2017%2C22%2026%2C22%2013.5%2C40%200%2C22'%20fill%3D'%238c8c8c'%2F%3E%3C%2Fsvg%3E") no-repeat center;}
.dropload-layer .loader{display:none;margin-right:4px;width:20px;height:20px;vertical-align:middle;animation:rotate 1s linear infinite forwards; -webkit-animation:rotate 1s linear infinite forwards; }
.dropload-layer .loader:after{        -webkit-animation: load 1.2s infinite linear;
display:block;width:100%;height:100%;content:"";background-size:cover;background:url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") no-repeat center;}

.pull-up .down,.refreshing .down{display:none}
.pull-up .arrow{display:inline-block;-webkit-transform:rotate(180deg) translate3d(0,0,0);transform:rotate(180deg) translate3d(0,0,0)}
.pull-up .up{display:inline-block}
.pull-down .arrow{display:inline-block}
.pull-down .down{display:inline-block}
.touching .dropload-layer{-webkit-transition: 0s;transition: 0s;}

/*加载中*/
.refreshing .dropload-layer{height: 50px;}
.refreshing .arrow{display:none}
.refreshing .loader{display:inline-block}
.refreshing .refresh{display:inline-block}
@-webkit-keyframes load {
0% {
    -webkit-transform: rotate(0deg);
}
100% {
    -webkit-transform: rotate(360deg);
}
}
</style>