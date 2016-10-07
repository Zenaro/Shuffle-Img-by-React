require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

// 获取图片相关的数据
let imagesData = require('../data/imagesData.json');

// 自执行函数，将图片名信息转成图片URL路径信息
imagesData = (function genImageURL(imagesDataArr) {
	for (let i = 0, j = imagesDataArr.length; i < j; i++) {
		let singleImageData = imagesDataArr[i];

		singleImageData.imageURL = require('../images/' +
			singleImageData.fileName);

		imagesDataArr[i] = singleImageData;
	}

	return imagesDataArr;
})(imagesData);

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">

				</section>
				<nav className="controller-nav">

				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;