"use client";

import React, { useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import { FaMeetup } from "react-icons/fa";
import { FaTasks } from 'react-icons/fa';
import { TbTargetArrow } from "react-icons/tb";


const ProjectTimeline = ({ data }:{data: JSONObject}) => {

    const convertData = (): JSONObject[] => {
        let list: JSONObject[] = [];

        // milestones
        if( data.milestones !== undefined) {
            for( var i=0; i<data.milestones.length; i++ ) {
                const milestone = data.milestones[i];
                const item = { 
                    _id: milestone._id,
                    date: Utils.formatDateTimeObj(milestone.dueDate),
                    dateDb: milestone.dueDate,
                    name: milestone.name,
                    description: milestone.description,
                    status: milestone.status,
                    bgColor: "rgb(233, 30, 99)",
                    textColor: "#fff",
                    icon: <TbTargetArrow />
                }

                list.push(item);
            }
        }
        
        // tasks
        if( data.tasks !== undefined) {
            for( var i=0; i<data.tasks.length; i++ ) {
                const task = data.tasks[i];
                const item = { 
                    _id: task._id,
                    date: `${Utils.formatDateTimeObj(task.startDate)} - ${Utils.formatDateTimeObj(task.endDate)}`,
                    dateDb: task.startDate,
                    name: task.name,
                    description: task.description,
                    status: task.status,
                    bgColor: "rgb(33, 150, 243)",
                    textColor: "#fff",
                    icon: <FaTasks />
                }

                list.push(item);
            }
        }

        // meetings
        if( data.meetings !== undefined) {
            for( var i=0; i<data.meetings.length; i++ ) {
                const metting = data.meetings[i];
                const date: any = Utils.formatDateTimeObj(metting.date);
                const item = { 
                    _id: metting._id,
                    date: date,
                    dateDb: metting.date,
                    name: metting.name,
                    description: metting.description,
                    bgColor: "rgb(16, 204, 82)",
                    textColor: "#fff",
                    icon: <FaMeetup />
                }

                list.push(item);
            }
        }

        return list.sort((a, b) => new Date(a.dateDb).getTime() - new Date(b.dateDb).getTime());;
    }

    useEffect(() => {
        // Add class after component mounts
        if( document.querySelector('.vertical-timeline') !== null 
            &&  document.querySelector('.vertical-timeline')!.classList != null)
                document.querySelector('.vertical-timeline')!.classList.remove('vertical-timeline--animate');
    }, []);

    const timelineList = convertData();

    return (
        <>
            
            <h2 className="text-2xl font-semibold mb-6 flex justify-center border-b-2 border-light-sky-blue pb-2 w-fit pr-5">Timeline</h2>
            <VerticalTimeline className=''>
                {timelineList.map((item: JSONObject, index: number) => (
                    <VerticalTimelineElement
                        contentStyle={{ border: '2px solid #bfdbfe', backgroundColor: "#bfdbfe  ", color: '#fff', boxShadow: "0 3px 0 #fff" }}
                        contentArrowStyle={{ borderRight: '7px solid  #bfdbfe' }}
                        key={item._id}
                        date={item.date}
                        icon={item.icon}
                        iconStyle={{ background: item.bgColor, color: item.textColor }}
                    >
                        <h3 className="vertical-timeline-element-title line-space text-black flex flex-row">
                            {item.status && <span className="px-2 py-1 rounded-md mr-4 whitespace-nowrap items-center flex" style={{backgroundColor: Utils.getStatusColor(item.status)}}>{Utils.getStatusName(item.status)}</span>}
                            <span className="font-bold">{item.name}</span>
                        </h3>
                        <div className="text-sm mt-3 text-black">{item.description}</div>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </>
    );
};

export default ProjectTimeline;
