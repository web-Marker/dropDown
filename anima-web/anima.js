/*
* @Author: mark
* @Date:   2018-01-12 10:05:42
* @Last Modified by:   mark
* @Last Modified time: 2018-02-13 16:05:08
*/

// Object.is(typeof exports, "object") && Object.is(typeof module, "undefined") ? module.exports = factory() : Object.is(typeof define, 'function') && define.amd ? define(factory) : (global.drops = factory())

((global, factory) => {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global.webDrop = factory())
})(self, () => {
	
	/**
	 * *插件参数
	 * @param  {[type]} options [description] 
	 * {
	 * 		el: 绑定的结构
	 * 		callback: 下拉之后做的回调处理
	 * 		isFilter: 是否去开启滤镜模式
	 * 		isAnima: 是否开启下拉动画帧模式
	 * 		animaClass: 动画类名
	 * 		imgClassName: 序列帧的类名前缀
	 * 		frameSize: 帧数
	 * } 
	 */
	//super属于集成父对象上面的函数以及属性super(props)

	const webDrop = class drops {
		constructor(options){
			this.options = options;
			this.contain = options.el;
			this.distance = 50;
			this.attachEvents(options.callback);
		}

		//是否是移动端模式
		support() {
			return !! (("ontouchstart" in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
		}

		//分别的几个触摸事件
		touchEvents() {
			return {
				start: this.support() ? 'touchstart' : 'mousedown',
				move: this.support() ? 'touchmove' : 'mousemove',
				end: this.support() ? 'touchend' : 'mouseup',
			}
		}

		//移动坐标
		getTouchPosition(e) {
			if (this.support()) {
				return {
					x: e.targetTouches[0].pageX,
					y: e.targetTouches[0].pageY
				}
			} else {
				return {
					x: e.pageX,
					y: e.pageY
				}
			}
		}

		//触摸开始
		touchStart(e){
			if (this.contain.classList.contains('refreshing')) {
				return
			}
			var p = this.getTouchPosition(e);
			this.start = p;
			this.diffY = 0;
		}

		//触摸移动
		touchMove(e) {
			if (this.contain.classList.contains("refreshing") || !this.start || (this.contain.scrollTop > 0)) {
				return
			}

			var p = this.getTouchPosition(e);
			this.diffY = p.y - this.start.y;

			if (this.diffY < 0) {
				return
			}
		
			this.contain.classList.add("touching");

			e.preventDefault();
			e.stopPropagation();

			this.diffY = Math.pow(this.diffY, 0.8);
		
			this.odiv.firstChild.style.height = this.diffY + 'px';
			var list = this.contain.classList;

			//是否开启苹果滤镜模式
			if (this.options.isFilter) {
				this.contain.style.cssText = `-webkit-filter: blur(${parseInt((5 * (this.diffY) / 50),10)}px);filter: blur(${parseInt((5 * (this.diffY) / 50),10)}px)`;
				
			}

			//开启序列帧动画模式
			if (this.options.isAnima) {
				var frameSize =  Math.floor(this.options.frameSize * (this.diffY) / 150);

				if (frameSize > this.options.frameSize ) frameSize = this.options.frameSize;

				var name = this.options.imgClassName + frameSize;
			
				document.querySelector(`.${this.options.animaClass}`).className = this.options.animaClass + ' ' + name;
				
			}

			if (this.diffY < this.distance) {
				list.remove('pull-up');
				list.add('pull-down')
			}else {
				list.remove('pull-down');
				list.add('pull-up')
			}
			return false
		}

		//触摸结束
		touchEnd(callback) {

			this.start = false;

			if (this.diffY <= 0 || this.contain.classList.contains('refreshing')) {
				return
			}
			var list = this.contain.classList;
			list.remove('touching');
			list.remove("pull-down");
			list.remove("pull-up");
			if (this.options.isFilter) {
				this.contain.style.cssText = '-webkit-filter: blur(0px);filter: blur(0px);'
			}
			if (Math.abs(this.diffY) <= this.distance) {
				this.odiv.firstChild.style.height = 0;
			}else {
				this.odiv.firstChild.style.height = this.distance + 'px';
				list.add('refreshing');

				if (this.options.isAnima) {
					document.querySelector(`.${this.options.animaClass}`).classList.add('hide');
				}

				this.refresh(callback)
			}
			return false
		}

		//移动结束之后
		refresh(callback) {
			if (callback) {
				callback()
			}
		}

		//插入html代码
		attachEvents(callback) {
			var el = this.contain;
			console.log(el)
			el.classList.add('dropload');

			if (this.options.isAnima) {
				var classList = '1';
				var imgClassName = this.options.imgClassName + classList;
			}
			
			var arrow = this.options.isAnima ? `<div class="${this.options.animaClass} ${this.options.animaClass}"></div>` : `<div class="arrow"></div>`;

			var tpl = ['<div class="dropload-layer">','<div class="inner">',''+arrow+'','<div class="loader"></div>','<div class="down">下拉刷新</div>','<div class="up">释放刷新</div>','<div class="refresh">正在刷新</div></div></div>'];

			this.odiv = document.createElement('div');
			this.odiv.innerHTML = tpl.join("");
			el.insertBefore(this.odiv, el.firstChild);
			el.addEventListener(this.touchEvents().start, this.touchStart.bind(this), false);
			el.addEventListener(this.touchEvents().move, this.touchMove.bind(this), false);
			el.addEventListener(this.touchEvents().end, this.touchEnd.bind(this, callback), false)

		}

		//松开之后
		pullToRefreshDone() {
			this.contain.classList.remove("refreshing");
			if (this.options.isAnima) {
				document.querySelector(`.${this.options.animaClass}`).classList.remove('hide');
			}
			this.contain.querySelector(".dropload-layer").style.height = 0
		}

	}

	return webDrop;
	
});
