/*
* @Author: mark
* @Date:   2018-01-12 10:05:42
* @Last Modified by:   mark
* @Last Modified time: 2018-01-18 17:54:43
*/

(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global.drops = factory())
})(this, function() {

	var drops = function(options) {
		console.log(options.el.classList);
		this.options = options;
		this.contain = options.el;
		this.distance = 50;
		this.attachEvents(options.callback)
	};

	drops.prototype = {
		//是否是移动端模式
		support: function() {
			return !! (("ontouchstart" in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
		},

		//分别的几个触摸事件
		touchEvents: function() {
			return {
				start: this.support() ? "touchstart": "mousedown",
				move: this.support() ? "touchmove": "mousemove",
				end: this.support() ? "touchend": "mouseup",
			}
		},

		//移动坐标
		getTouchPosition: function(e) {
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
		},

		//触摸开始
		touchStart: function(e) {
			if (this.contain.classList.contains("refreshing")) {
				return
			}
			var p = this.getTouchPosition(e);
			this.start = p;
			this.diffY = 0
		},

		//触摸移动
		touchMove: function(e) {
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
		
			this.odiv.firstChild.style.height = this.diffY + "px";
			var list = this.contain.classList;

			//是否开启苹果滤镜模式
			if (this.options.isFilter) {
				this.contain.style.cssText = '-webkit-filter: blur('+(5 * (this.diffY) / 50)+'px);filter: blur('+(5 * (this.diffY) / 50)+'px);'
			}

			//开启序列帧动画模式
			if (this.options.isAnima) {
				var frameSize =  Math.floor(this.options.frameSize * (this.diffY) / 150);

				if (frameSize > this.options.frameSize ) frameSize = this.options.frameSize;

				var name = this.options.imgClassName + frameSize;
			
				document.querySelector('.'+this.options.animaClass).className = this.options.animaClass + ' ' + name;
				
			}

			if (this.diffY < this.distance) {
				list.remove("pull-up");
				list.add("pull-down")
			}else {
				list.remove("pull-down");
				list.add("pull-up")
			}
			return false
		},

		//触摸结束
		touchEnd: function(callback) {
			this.start = false;
			if (this.diffY <= 0 || this.contain.classList.contains("refreshing")) {
				return
			}
			var list = this.contain.classList;
			list.remove("touching");
			list.remove("pull-down");
			list.remove("pull-up");
			if (this.options.isFilter) {
				this.contain.style.cssText = '-webkit-filter: blur(0px);filter: blur(0px);'
			}
			if (Math.abs(this.diffY) <= this.distance) {
				this.odiv.firstChild.style.height = "0px"
			}else {
				this.odiv.firstChild.style.height = this.distance + "px";
				list.add("refreshing");

				if (this.options.isAnima) {
					document.querySelector('.' + this.options.animaClass).classList.add('hide');
				}

				this.refresh(callback)
			}
			return false
		},

		//移动结束之后
		refresh: function(callback) {
			if (callback) {
				callback()
			}
		},

		//插入html代码
		attachEvents: function(callback) {
			var el = this.contain;
			el.classList.add("dropload");

			if (this.options.isAnima) {
				var classList = '1';
				var imgClassName = this.options.imgClassName + classList;
			}
			
			var arrow = this.options.isAnima ? '<div class="'+this.options.animaClass+' '+imgClassName+'"></div>' : '<div class="arrow"></div>';

			var tpl = ['<div class="dropload-layer">','<div class="inner">',''+arrow+'','<div class="loader"></div>','<div class="down">下拉刷新</div>','<div class="up">释放刷新</div>','<div class="refresh">正在刷新</div></div></div>'];

			this.odiv = document.createElement("div");
			this.odiv.innerHTML = tpl.join("");
			el.insertBefore(this.odiv, el.firstChild);

			el.addEventListener(this.touchEvents().start, this.touchStart.bind(this), this, false);
			el.addEventListener(this.touchEvents().move, this.touchMove.bind(this), this, false);
			el.addEventListener(this.touchEvents().end, this.touchEnd.bind(this, callback), this, false)
		},

		//松开之后
		pullToRefreshDone: function() {
			this.contain.classList.remove("refreshing");
			if (this.options.isAnima) {
				document.querySelector('.' + this.options.animaClass).classList.remove('hide');
			}
			this.contain.querySelector(".dropload-layer").style.height = "0px"
		}
	};

	return drops
});
