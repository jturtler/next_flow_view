"use server";

import { randomBytes } from "node:crypto";
import { JSONObject } from "../definations";
import { readFileData, updateDataList } from "@/services/fileService";
import { TTask } from "../../../types/model";

const taskFileName = "tasks.json";

export async function fetchTasksByProjectIdList(
	projectIds: string[]
): Promise<JSONObject> {
	try {
		const projectIdSet = new Set(projectIds);
		const tasks = await readFileData<TTask>(taskFileName);
		return {
			status: "success",
			data: tasks.filter((task) => projectIdSet.has(task.projectId)),
		};
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function saveTask(payload: JSONObject): Promise<JSONObject> {
	try {
		const now = new Date().toISOString();
		const startDate = new Date(payload.startDate);
		const endDate = new Date(payload.endDate);
		if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
			throw new Error("Task start and end dates must be valid.");
		}

		const taskData: TTask = {
			...payload,
			_id: payload._id ?? randomBytes(12).toString("hex"),
			projectId: payload.projectId,
			name: payload.name,
			description: payload.description,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			status: payload.status,
			assignedTo: payload.assignedTo,
			createdBy: payload.createdBy,
			createdAt: payload.createdAt ?? now,
			updatedAt: now,
		};

		const savedTask = await updateDataList<TTask, TTask>(taskFileName, (tasks) => {
			const existingIndex = tasks.findIndex((task) => task._id === taskData._id);
			if (existingIndex === -1) {
				tasks.push(taskData);
				return taskData;
			}

			const updatedTask = {
				...taskData,
				createdAt: tasks[existingIndex].createdAt,
			};
			tasks[existingIndex] = updatedTask;
			return updatedTask;
		});

		return { status: "success", data: savedTask };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function removeTask(id: string): Promise<JSONObject> {
	try {
		await updateDataList<TTask, void>(taskFileName, (tasks) => {
			const taskIndex = tasks.findIndex((task) => task._id === id);
			if (taskIndex !== -1) tasks.splice(taskIndex, 1);
		});

		return { status: "success" };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}
