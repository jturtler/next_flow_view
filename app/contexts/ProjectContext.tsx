"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as dbService from "@/lib/dbService";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";


interface ProjectContextProps {
	projectDetails: JSONObject | null;
	saveTask: (task: JSONObject) => Promise<void>;
	removeTask: (id: string) => Promise<void>;
	saveMeeting: (meeting: JSONObject) => Promise<void>;
	removeMeeting: (id: string) => Promise<void>;
	saveMilestone: (milestone: JSONObject) => Promise<void>;
	removeMilestone: (id: string) => Promise<void>;
	error: string | null;
	processStatus: string;
}

const ProjectContext = createContext<ProjectContextProps>({
	projectDetails: null,
	saveTask: async() => { },
	removeTask: async() => { },
	saveMeeting: async() => { },
	removeMeeting: async() => { },
	saveMilestone: async() => { },
	removeMilestone: async() => { },
	error: null,
	processStatus: ""
});

export const useProject = (): ProjectContextProps => {
	const context = useContext(ProjectContext);

	if (!context) {
	  throw new Error('useProject must be used within an ProjectProvider');
	}
	return context;
};

export const ProjectProvider = ({ projectId, children }: { projectId: string, children: ReactNode }) => {
	const [projectDetails, setProjectDetails] = useState<JSONObject | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	
	const fetchProgramDetails = async (programId: string) => {
		setProcessStatus(Constant.FETCH_DATA_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchProjectById(programId);
        if (response.status != "success") {
            setError(response.message);
			setProcessStatus(Constant.FETCH_DATA_FAILURE);
        }
        else {
            setProjectDetails(response.data);
			setProcessStatus(Constant.FETCH_DATA_SUCCESS);
        }
	};

    useEffect(() => {
        fetchProgramDetails(projectId);
    }, []);

	const saveTask = async(task: JSONObject) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);
		
		let newTask = convertTaskDatesToUTC(task);

		let response: JSONObject = await dbService.saveTask(newTask);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new task of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			if( temp.tasks == undefined ) temp.tasks = [];

			const savedTask = response.data;
			var found = Utils.findItemFromList(temp.tasks, savedTask._id, "_id");
			if( found ) {
				Utils.findAndReplaceItemFromList(temp.tasks, savedTask._id, "_id", savedTask);
			}
			else {
				temp.tasks.push( savedTask );
			}
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	const removeTask = async(id: string) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);

		let response: JSONObject = await dbService.removeTask(id);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new task of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			Utils.removeFromArray( temp.tasks!, id, "_id");
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	
	const saveMeeting = async(meeting: JSONObject) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);
		
		let newMeeting = Utils.cloneJSONObject(meeting);
		newMeeting.date = Utils.convertToUTCDateObj(newMeeting.date);

		let response: JSONObject = await dbService.saveMetting(newMeeting);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new meeting of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			if( temp.meetings == undefined ) temp.meetings = [];

			const savedMeeting = response.data;
			var found = Utils.findItemFromList(temp.meetings, savedMeeting._id, "_id");
			if( found ) {
				Utils.findAndReplaceItemFromList(temp.meetings, savedMeeting._id, "_id", savedMeeting);
			}
			else {
				temp.meetings.push( savedMeeting );
			}
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	const removeMeeting = async(id: string) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);

		let response: JSONObject = await dbService.removeMetting(id);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new meeting of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			Utils.removeFromArray( temp.meetings!, id, "_id");
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	
	const saveMilestone = async(milestone: JSONObject) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);
		
		let newMilestone = Utils.cloneJSONObject(milestone);
		newMilestone.dueDate = Utils.convertToUTCDateObj(newMilestone.dueDate);

		let response: JSONObject = await dbService.saveMilestone(newMilestone);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new milestone of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			if( temp.milestones == undefined ) temp.milestones = [];

			const savedMilestone = response.data;
			var found = Utils.findItemFromList(temp.milestones, savedMilestone._id, "_id");
			if( found ) {
				Utils.findAndReplaceItemFromList(temp.milestones, savedMilestone._id, "_id", savedMilestone);
			}
			else {
				temp.milestones.push( savedMilestone );
			}
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	const removeMilestone = async(id: string) => {
		setProcessStatus(Constant.SAVE_DATA_REQUEST);
		setError(null);

		let response: JSONObject = await dbService.removeMilestone(id);
        if (response.status !== "success") {
            setError(response.message);
			setProcessStatus(Constant.SAVE_DATA_FAILURE);
        }
        else {
            // Need to update the new milestone of project details data
			const temp = Utils.cloneJSONObject(projectDetails!);
			Utils.removeFromArray( temp.milestones!, id, "_id");
			
			setProjectDetails(temp);
			setProcessStatus(Constant.SAVE_DATA_SUCCESS);
        }
	}

	const convertTaskDatesToUTC = (task: JSONObject) => {
		let newTask = Utils.cloneJSONObject(task);
        newTask.startDate = Utils.convertToUTCDateObj(newTask.startDate);
        newTask.endDate = Utils.convertToUTCDateObj(newTask.endDate);

		return newTask;
	}

	return (
		<ProjectContext.Provider value={{ projectDetails, processStatus, error, saveTask, removeTask, saveMeeting, removeMeeting, saveMilestone, removeMilestone }}>
			{children}
		</ProjectContext.Provider>
	);
};
