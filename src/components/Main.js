require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

// 获取图片相关的数据
let imagesData = require('json!../data/imagesData.json');

// 自执行函数，将图片名信息转成图片URL路径信息
imagesData = ((imagesDataArr) => {
	for (let i = 0, j = imagesDataArr.length; i < j; i++) {
		let singleImageData = imagesDataArr[i];

		singleImageData.imageURL = require('../images/' +
			singleImageData.fileName);

		imagesDataArr[i] = singleImageData;
	}

	return imagesDataArr;
})(imagesData);

/*
 * 获取区间被的一个随机数
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

class ImgFigure extends React.Component {
		render() {
			let styleObj = {};

			// 如果props属性中之ing了这张图片的位置，则使用
			if (this.props.arrange.pos) {
				styleObj = this.props.arrange.pos;
			}
			return (
				<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			);
		}
	}
	// class AppComponent extends React.Component
class AppComponent extends React.Component {
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { // 水平方向的取值范围
			leftSecX: [0, 0],
			right: [0, 0],
			y: [0, 0]
		},
		vPosRange: { // 垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	}

	/*
	 *	重新布局所有页面
	 *	@param centerIndex 指定居中排布哪个图片
	 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr;
		let Constant = this.Constant;
		let centerPos = Constant.centerPos;
		let hPosRange = Constant.hPosRange;
		let vPosRange = Constant.vPosRange;
		let hPosRangeLeftSecX = hPosRange.leftSecX;
		let hPosRangeRigthSecX = hPosRange.rightSecX;
		let hPosRangeY = hPosRange.y;
		let vPosRangeTopY = vPosRange.topY;
		let vPosRangeX = vPosRange.x;

		let imgsArrangeTopArr = [];
		let topImgNum = Math.ceil(Math.random() * 2);
		let topImgSpliceIndex = 0;

		let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 首先居中，centerIndex
		imgsArrangeCenterArr[0].pos = centerPos;

		// 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach((item, index) => {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			}
		});

		// 布局左右两侧的图片
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;

			// 左边，右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;

			} else {
				hPosRangeLORX = hPosRangeRigthSecX;
			}

			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
			}
		}


		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	// getInitialState() {
	// 	return {
	// 		imgsArrangeArr: [{
	// 			pos: {
	// 				left: '0',
	// 				top: '0'
	// 			}
	// 		}]
	// 	}
	// }

	// 组件加载后，为每张图片计算其位置范围
	componentDidMount() {

		// 首先拿到舞台的大小
		let stageDOM = React.findDOMNode(this.refs.state);
		let stageW = stageDOM.scrollWidth;
		let stageH = stageDOM.scrollHeight;
		let halfStageW = Math.ceil(stageW / 2);
		let halfStageH = Math.ceil(stageH / 2);

		// 拿到一个 imageFigure 的大小
		let imgFigureDOM = React.findDOMNode(this.refs.imgFigure0);
		let imgW = imgFigureDOM.scrollWidth;
		let imgH = imgFigureDOM.scrollHeight;
		let halfImgW = Math.ceil(imgW / 2);
		let halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		/*
		 *	计算走测，右侧区域图片排布位置的取值范围
		 */
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		/*
		 * 计算上侧区域图片的排布位置的取值范围
		 */
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.hPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.hPosRange.x[0] = halfImgW - imgW;
		this.Constant.hPosRange.x[1] = halfImgW;

		this.rearrange(0);
	}

	render() {
		let controllerUnits = [];
		let imgFigures = [];

		imagesData.forEach((item, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					}
				}
			}
			imgFigures.push(<ImgFigure data={item} 
				ref={'imgFigure' + index}
				arrange={this.state.imgsArrangeArr[index]}/>);
		});
		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;