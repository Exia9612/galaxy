import { container } from "@sentinel/container";
import { UserInfo } from "../userInfo";
import { PVMetric } from "./types";

export const pvHandler = (): PVMetric => {
	const useInfoInstance = container.get<UserInfo>("userInfo");
	const userInfo = useInfoInstance.getUserInfo();

	return {
		timeStamp: Date.now(),
		href: window.location.href,
		...userInfo,
	};
};
