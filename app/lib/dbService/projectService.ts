"use server";

import mongoose from "mongoose";
import Project from "../schemas/Project.schema";
import { JSONObject } from "../definations";
import connectToDatabase from "./db";
import Metting from "../schemas/Meeting.schema";
import Milestone from "../schemas/Milestone.schema";
import Task from "../schemas/Task.schema";
import * as Utils from "@/lib/utils";

export async function fetchProjectsByUserId(
  userId: string
): Promise<JSONObject> {
  try {
    await connectToDatabase();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const projects: JSONObject[] = await Project.find({ managedBy: userIdObj });

    return { status: "success", data: Utils.cloneJSONObject(projects) };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function fetchProjectById(projectId: string): Promise<JSONObject> {
  try {
    const projectIdObj = new mongoose.Types.ObjectId(projectId);

    await connectToDatabase();
    let meetings = await Metting.find({ projectId: projectIdObj });
    let milestones = await Milestone.find({ projectId: projectIdObj });
    let tasks = await Task.find({ projectId: projectIdObj });

    return ({ status: "success", data: Utils.cloneJSONObject({ meetings, milestones, tasks }) });
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}
