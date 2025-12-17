// fmp: 首次有效绘制，标记主角元素渲染完成的时间点，主角元素可以是视频网站的视频控件，内容网站的页面框架也可以是资源网站的头图等。
// 参考 https://juejin.cn/post/6844903817612361735

/**
 * "SCRIPT", "STYLE"，不影响fmp计算，因为计算时机在onload后，此时所有资源都已加载完成
 */
const IGNORE_TAGS = ["SCRIPT", "STYLE", "META", "HEAD", "LINK", "TITLE"];
const TAG_PREFIX = "__f_tag_";
const START_TIME = performance.timing.responseEnd;
const VIEWPORT_HEIGHT = window.innerHeight;
const VIEWPORT_WIDTH = window.innerWidth;
// 允许用户自定义权重
const TAG_WEIGHT_MAP = {
	SVG: 2,
	IMG: 2,
	CANVAS: 4,
	OBJECT: 4,
	EMBED: 4,
	VIDEO: 4,
};
const TIME_LIMIT = 6000;
type SubTreeScore = {
	score: number;
	node: HTMLElement;
	subTreeScores: SubTreeScore[];
	tag: string;
};

interface SourceNodePrefData {
	endTime: number;
	encodedBodySize: number;
	decodedBodySize: number;
	initiatorType: string;
	loadTime: number;
}

class FMPTiming {
	private tagCount: number;
	private obsTimingStack: Map<number, number>;
	private mutationObserver: MutationObserver;
	private sourcePrefStore: Map<string, SourceNodePrefData>;
	private perfObserver: PerformanceObserver;
	private shouldCalculate: boolean;

	constructor() {
		this.tagCount = 1;
		this.obsTimingStack = new Map();
		this.mutationObserver = new MutationObserver(this.obsCallBack.bind(this));
		this.perfObserver = new PerformanceObserver(
			this.perfObsCallBack.bind(this),
		);
		this.sourcePrefStore = new Map();
		this.shouldCalculate = true;

		this.initOberver();
	}

	initOberver() {
		/*
			MutationRecord = {
				type：如果是属性变化，返回"attributes"，如果是一个CharacterData节点（Text节点、Comment节点）变化，返回"characterData"，节点树变化返回"childList"
				target：返回影响改变的节点
				addedNodes：返回添加的节点列表
				removedNodes：返回删除的节点列表
				previousSibling：返回分别添加或删除的节点的上一个兄弟节点，否则返回null
				nextSibling：返回分别添加或删除的节点的下一个兄弟节点，否则返回null
				attributeName：返回已更改属性的本地名称，否则返回null
				attributeNamespace：返回已更改属性的名称空间，否则返回null
				oldValue：返回值取决于type。对于"attributes"，它是更改之前的属性的值。对于"characterData"，它是改变之前节点的数据。对于"childList"，它是null
			}
		*/
		this.mutationObserver.observe(document, {
			childList: true,
			subtree: true,
		});

		/**
		 * 为什么不用DomContentLoaded事件？
		 * 因为DomContentLoaded事件在DOM解析完成后触发，但DOM解析完成后，可能存在一些资源未加载完成，导致FMP计算不准确
		 * 所以需要使用load事件，load事件在所有资源加载完成后触发，这样可以确保FMP计算准确
		 * 触发顺序参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/load_event
		 */
		window.addEventListener("load", this.onLoadCb);

		// 如果规定时间内页面没有触发onload，不再等待，直接计算FMP
		setTimeout(() => {
			if (this.shouldCalculate) {
				window.removeEventListener("load", this.onLoadCb);
				this.calculateAllScore();
			}
		}, TIME_LIMIT);
	}

	onLoadCb() {
		if (this.shouldCalculate) {
			// 页面load后，所有节点被标记完成，开始计算FMP
			// 不能在webworker 里调用，因为涉及dom打标操作
			window.requestIdleCallback(this.calculateAllScore);
		}
	}

	obsCallBack() {
		const now = Date.now();
		this.obsTimingStack.set(this.tagCount, now);
		this.markTag(document.body);
	}

	perfObsCallBack(entryList: PerformanceObserverEntryList) {
		entryList.getEntriesByType("resource").forEach((resourceEntry: any) => {
			// 值意义参考 https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceResourceTiming
			const url = resourceEntry.name; // 资源URL
			const endTime = resourceEntry.responseEnd; // 资源加载完成的时间
			const encodedBodySize = resourceEntry.encodedBodySize; // 资源编码后的体积
			const decodedBodySize = resourceEntry.decodedBodySize; // 资源解码后的体积
			const initiatorType = resourceEntry.initiatorType; // 资源发起类型
			const startTime = resourceEntry.startTime; // 资源开始加载的时间
			const loadTime = endTime - startTime;

			this.sourcePrefStore.set(url, {
				endTime,
				encodedBodySize,
				decodedBodySize,
				initiatorType,
				loadTime,
			});
		});
	}

	// 根据tag标记能对应标记时间
	markTag(ele: HTMLElement) {
		const tagName = ele.tagName;
		if (IGNORE_TAGS.includes(tagName)) {
			return;
		}

		const childrenEles = ele.children;
		if (childrenEles && childrenEles.length > 0) {
			// 从后往前是因为每次body的变动都会触发一次回调，新元素都是被添加到末尾的
			for (let i = childrenEles.length - 1; i >= 0; i--) {
				if (!childrenEles[i].hasAttribute(`${TAG_PREFIX}`)) {
					childrenEles[i].setAttribute(`${TAG_PREFIX}`, `${this.tagCount}`);
				}
				this.markTag(childrenEles[i] as HTMLElement);
			}
		} else {
			this.markTag(ele);
		}
	}

	isOutOfViewport(node: HTMLElement) {
		const { top, bottom, left, right } = node.getBoundingClientRect();
		return (
			top > VIEWPORT_HEIGHT || left > VIEWPORT_WIDTH || bottom < 0 || right < 0
		);
	}

	getStyle(node: HTMLElement, attr: string) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(node).getPropertyValue(attr);
		} else {
			return (node as any).currentStyle[attr];
		}
	}

	// 计算某个元素可视区域的面积占其总面积的百分比
	calculateViewPortPercentage(node: HTMLElement) {
		const { width, height, top, bottom, left, right } =
			node.getBoundingClientRect();
		const vl = 0;
		const vr = VIEWPORT_WIDTH;
		const vt = 0;
		const vb = VIEWPORT_HEIGHT;

		// 节点在视口内的宽度
		let overlapWidth =
			width + VIEWPORT_WIDTH - (Math.max(vr, right) - Math.min(vl, left));
		if (overlapWidth < 0) {
			overlapWidth = 0;
		}

		let overlapHeight =
			height + VIEWPORT_HEIGHT - (Math.max(vb, bottom) - Math.min(vt, top));
		if (overlapHeight < 0) {
			overlapHeight = 0;
		}

		return (overlapWidth * overlapHeight) / (width * height);
	}

	// 计算某个元素的得分，如果其子元素得分大于其自身得分，则返回子元素得分，否则返回自身得分·
	calculateNodeScore(
		node: HTMLElement,
		subTreeScores: SubTreeScore[],
	): SubTreeScore {
		// 子元素得分
		let subTreeTotalScore = 0;
		const isOutOfViewport = this.isOutOfViewport(node);

		subTreeScores.forEach((item) => {
			subTreeTotalScore += item.score;
		});

		const viewPortWeight = isOutOfViewport ? 0 : 1;
		let nodeTypeWeight =
			TAG_WEIGHT_MAP[node.tagName as keyof typeof TAG_WEIGHT_MAP] || 1;
		const viewPortPercentage = isOutOfViewport
			? 0
			: this.calculateViewPortPercentage(node);

		if (nodeTypeWeight === 1 && this.getStyle(node, "background-image")) {
			nodeTypeWeight = TAG_WEIGHT_MAP.IMG;
		}

		let score = viewPortWeight * nodeTypeWeight * viewPortPercentage;
		score = subTreeTotalScore > score ? subTreeTotalScore : score;

		return {
			score: score,
			node: node,
			subTreeScores: subTreeScores,
			tag: node.getAttribute(`${TAG_PREFIX}`) || "",
		};
	}

	// 应该走深度优先遍历，避免计算逻辑随dom树层级变深而呈指数级增长，减少内存消耗
	traverseNodeToCalScore(node: HTMLElement) {
		const childrenNodes = node.children;
		if (childrenNodes && childrenNodes.length > 0) {
			const subTreeScores: SubTreeScore[] = [];
			for (let i = 0; i < childrenNodes.length; i++) {
				subTreeScores.push(
					this.traverseNodeToCalScore(childrenNodes[i] as HTMLElement),
				);
				const curNodeScore = this.calculateNodeScore(
					childrenNodes[i] as HTMLElement,
					subTreeScores,
				);
				return {
					node: node,
					score: curNodeScore.score,
					subTreeScores: subTreeScores,
					tag: node.getAttribute(`${TAG_PREFIX}`) || "",
				};
			}
		}
		return this.calculateNodeScore(node, []);
	}

	// 计算全部元素得分，
	calculateAllScore() {
		// 关闭observer，认为页面已经加载完成
		this.mutationObserver.disconnect();
		this.shouldCalculate = false;

		const allScores = this.traverseNodeToCalScore(document.body);

		return allScores;
	}

	// 计算所有元素的平均分
	getScoreGreatedThanAvg(allScores: SubTreeScore) {
		let sum = 0;

		allScores.subTreeScores.forEach((item) => {
			sum += item.score;
		});

		const avgScore = sum / allScores.subTreeScores.length;
		const scores = allScores.subTreeScores.filter(
			(item) => item.score >= avgScore,
		);

		return scores;
	}

	getFmp() {
		const scores = this.calculateAllScore();
		const scoresGreatedThanAvg = this.getScoreGreatedThanAvg(scores);
		let fmp = 0;

		scoresGreatedThanAvg.forEach((item) => {
			const { node, tag } = item;
			const nodeType = node.tagName;

			switch (nodeType) {
				case "IMG":
				case "VIDEO":
					/**
					 * 资源元素，如video，img等，需要通过performance.res获取其资源加载时间
					 */
					const url = (node as HTMLImageElement | HTMLVideoElement).src;
					const data = this.sourcePrefStore.get(url);
					if (data && data.endTime) {
						fmp = Math.max(fmp, data.endTime - START_TIME);
					}
					break;
				default:
					const renderTime = this.obsTimingStack.get(Number(tag)) || 0;
					fmp = Math.max(fmp, renderTime);
					break;
			}
		});

		return fmp;
	}
}

export default FMPTiming;
