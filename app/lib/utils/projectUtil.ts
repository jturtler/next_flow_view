import { JSONObject } from './../definations';
import * as Utils from "@/lib/utils";
import { FaMeetup } from "react-icons/fa";
import { FaTasks } from 'react-icons/fa';
import { TbTargetArrow } from "react-icons/tb";


export const convertProgramDetails = (details: JSONObject, programs?: JSONObject[]): JSONObject[] => {

    let list: JSONObject[] = [];

    // milestones
    if( details.milestones !== undefined) {
        for( var i=0; i<details.milestones.length; i++ ) {
            const milestone = details.milestones[i];
            let programName = (programs !== undefined ) ? Utils.findItemFromList(programs, milestone.projectId, "_id")!.name + " - ": "";

            const item = { 
                _id: milestone._id,
                date: Utils.formatDateTimeObj(milestone.dueDate),
                dateDb: milestone.dueDate,
                name: `${programName} ${milestone.name}`,
                description: milestone.description,
                status: milestone.status,
                bgColor: "rgb(233, 30, 99)",
                textColor: "#fff",
                icon: TbTargetArrow
            }

            list.push(item);
        }
    }
    
    // tasks
    if( details.tasks !== undefined) {
        for( var i=0; i<details.tasks.length; i++ ) {
            const task = details.tasks[i];
            let programName = (programs !== undefined ) ? Utils.findItemFromList(programs, task.projectId, "_id")!.name + " - ": "";

            const item = { 
                _id: task._id,
                date: `${Utils.formatDateTimeObj(task.startDate)} - ${Utils.formatDateTimeObj(task.endDate)}`,
                dateDb: task.startDate,
                name: `${programName} ${task.name}`,
                description: task.description,
                status: task.status,
                bgColor: "rgb(33, 150, 243)",
                textColor: "#fff",
                icon: FaTasks
            }

            list.push(item);
        }
    }

    // meetings
    if( details.meetings !== undefined) {
        for( var i=0; i<details.meetings.length; i++ ) {
            const meeting = details.meetings[i];
            let programName = (programs !== undefined ) ? Utils.findItemFromList(programs, meeting.projectId, "_id")!.name + " - ": "";

            const date: any = Utils.formatDateTimeObj(meeting.date);
            const item = { 
                _id: meeting._id,
                date: date,
                dateDb: meeting.date,
                name: `${programName} ${meeting.name}`,
                description: meeting.description,
                bgColor: "rgb(16, 204, 82)",
                textColor: "#fff",
                icon: FaMeetup
            }

            list.push(item);
        }
    }
    
    return list.sort((a, b) => new Date(a.dateDb).getTime() - new Date(b.dateDb).getTime());

}