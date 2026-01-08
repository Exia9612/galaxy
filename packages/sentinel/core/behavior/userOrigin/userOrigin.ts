// 用户来路
/*
	用户来路地址
	下面三种情况通过referrer获取不到用户来路地址
	- 直接在地址栏中输入地址跳转
	- 直接通过浏览器收藏夹打开
	- 从https的网站直接进入一个http协议的网站
*/
/*
	用户来路方式
	我们可以直接使用 window.performance.navigation.type 来获取用户在我们网页上的来路方式
	该属性返回一个整数值，可能有以下4种情况

	0: 点击链接、地址栏输入、表单提交、脚本操作等。
	1: 点击重新加载按钮、location.reload。
	2: 点击前进或后退按钮。
	255: 任何其他来源。即非刷新/非前进后退、非点击链接/地址栏输入/表单提交/脚本操作等。
*/

import { UserOriginInfo } from "./types";

export const userOrigin = (): UserOriginInfo => {
	const referrer = document.referrer;
	const type = window.performance.navigation.type;

	return {
		referrer,
		type,
	};
};
