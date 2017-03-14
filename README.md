# dropDown

下拉加载H5+WEB版本

## 下拉加载(持续更新react和vue组件版)

* 不依赖任何JS库,支持移动端和PC端,支持所有主流浏览器
* 直接引用dropDown.js既可以使用

<<<<<<< HEAD
## 不定期更新以下版本
=======
## 不定期更新一下版本
>>>>>>> d71a5ce3188b1ac64b1d72e4bcf417ceae48e9e3

* 下拉视差动画版本
* react组件版本
* vue组件版本

## 初始化调用方法(增加定时器模拟,实际开发可以剔除)

```js
var drop = new drops(document.body,function(){
	var timer = setTimeout(function () {
        clearTimeout(timer);
        i++;
        alert("下拉已经刷新, Do someThing")
    	drop.pullToRefreshDone();
    }, 500);
});
```

## [DEMO请点击](http://weiqunwang.net/dropDown/demo.html)
