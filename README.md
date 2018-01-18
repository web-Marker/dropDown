# dropDown

下拉加载H5+WEB版本

![](https://github.com/web-Marker/dropDown/blob/master/example-1.gif) 

## 下拉加载(持续更新react和vue组件版)

* 不依赖任何JS库,支持移动端和PC端,支持所有主流浏览器
* 直接引用dropDown.js既可以使用

## 不定期更新一下版本

* 下拉视差动画版本
* react组件版本
* vue组件版本

## 更新支持视差动画(结合模块gka序列帧)

![](https://github.com/web-Marker/dropDown/blob/master/example-2.gif) 


* gka模块可以生成css3 canvas svg等序列帧动画代码,demo目前用的是css3，图片是gka自动生成的一个精灵图
[gka官网地址](https://gka.js.org/#/?id=gka)

```js
	var drop = new drops({
		el: document.body,//插入的节点
		callback: function(){ //下拉刷新成功后的回调
			var timer = setTimeout(function () {
	            clearTimeout(timer);
	            alert("下拉已经刷新, Do someThing")
	        	drop.pullToRefreshDone();
	        }, 500);
		},
		isFilter: false, //是否支付滤镜效果,
		isAnima: true, //是否开启下拉动画
		animaClass: 'animation', //动画类名
		imgClassName: 'a', //css3动画序列类名首a1-an 就填写a就行
		frameSize: '21'//动画一共有多少帧
	})
```


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

## React 调用方法


```js
import Drop from './drop'

export default class Index extends Component {

	constructor(props) {
		super(props)

		//数据请求回调callback
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
```



