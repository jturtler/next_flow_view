"use server";

import { randomBytes } from "node:crypto";
import { JSONObject } from "../definations";
import { readFileData, updateDataList } from "@/services/fileService";
import { TMilestone } from "../../../types/model";

const milestoneFileName = "milestones.json";

export async function fetchMilestonesByProjectIdList(
	projectIds: string[]
): Promise<JSONObject> {
	try {
		const projectIdSet = new Set(projectIds);
		const milestones = await readFileData<TMilestone>(milestoneFileName);

		return {
			status: "success",
			data: milestones.filter((milestone) =>
				projectIdSet.has(milestone.projectId),
			),
		};
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function saveMilestone(payload: JSONObject): Promise<JSONObject> {
	try {
		const now = new Date().toISOString();
		const dueDate = new Date(payload.dueDate);
		if (Number.isNaN(dueDate.getTime())) {
			throw new Error("Milestone due date must be valid.");
		}

		const milestoneData: TMilestone = {
			...payload,
			_id: payload._id ?? randomBytes(12).toString("hex"),
			projectId: payload.projectId,
			name: payload.name,
			description: payload.description,
			dueDate: dueDate.toISOString(),
			status: payload.status,
			assignedTo: payload.assignedTo,
			createdBy: payload.createdBy,
			createdAt: payload.createdAt ?? now,
			updatedAt: now,
		};

		const savedMilestone = await updateDataList<TMilestone, TMilestone>(
			milestoneFileName,
			(milestones) => {
				const existingIndex = milestones.findIndex(
					(milestone) => milestone._id === milestoneData._id,
				);
				if (existingIndex === -1) {
					milestones.push(milestoneData);
					return milestoneData;
				}

				const updatedMilestone = {
					...milestoneData,
					createdAt: milestones[existingIndex].createdAt,
				};
				milestones[existingIndex] = updatedMilestone;
				return updatedMilestone;
			},
		);

		return { status: "success", data: savedMilestone };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function removeMilestone(id: string): Promise<JSONObject> {
	try {
		await updateDataList<TMilestone, void>(milestoneFileName, (milestones) => {
			const milestoneIndex = milestones.findIndex(
				(milestone) => milestone._id === id,
			);
			if (milestoneIndex !== -1) milestones.splice(milestoneIndex, 1);
		});

		return { status: "success" };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}
