import { JSONObject } from "@/lib/definations";
import React from "react";

type ProgressBarProps = {
	name: string;
	percentage: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ name, percentage }) => {

	const bgColor = (percentage > 100) ? "bg-red-500" : "bg-blue-500";
	const textColor = (percentage > 100) ? "text-red-500" : "text-blue-500";

	return (
		<div>
			<h2 className="font-semibold">{name}</h2>
			<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
				<div
					className={`${bgColor} h-full`}
					style={{ width: `${percentage}%` }}
				></div>
			</div>
			<p className={`text-sm mt-2 ${textColor}`}>
				{percentage.toFixed(2)}%
			</p>
		</div>


	);
};

export default ProgressBar;