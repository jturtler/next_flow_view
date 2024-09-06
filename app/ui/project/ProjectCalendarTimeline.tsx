import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { getTime } from "date-fns";


export default function ProjectCalendarTimeline({ project, data }: { project: JSONObject, data: JSONObject }) {

    const projectStartDate = new Date(project.startDate);
    const projectEndDate = new Date(project.endDate);
    const projectDuration = projectEndDate.getTime() - projectStartDate.getTime(); // Duration in milliseconds

    const calculatePercentage = (date: Date) => {
        return ((new Date(date).getTime() - projectStartDate.getTime()) / projectDuration) * 100;
    };

    
    const convertData = (): JSONObject[] => {
        let list: JSONObject[] = [];

        // milestones
        if( data.milestones !== undefined) {
            for( var i=0; i<data.milestones.length; i++ ) {
                const milestone = data.milestones[i];
                const item = { 
                    _id: milestone._id,
                    startDate: milestone.dueDate,
                    endDate: milestone.dueDate,
                    name: milestone.name,
                    description: milestone.description,
                    status: milestone.status,
                    bgColor: "rgb(233, 30, 99)"
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
                    startDate: task.startDate,
                    endDate:task.endDate,
                    name: task.name,
                    description: task.description,
                    status: task.status,
                    bgColor: "rgb(33, 150, 243)"
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
                    startDate: metting.date,
                    endDate: metting.date,
                    name: metting.name,
                    description: metting.description,
                    bgColor: "rgb(16, 204, 82)"
                }

                list.push(item);
            }
        }

        return list.sort((a, b) => new Date(a.dateDb).getTime() - new Date(b.dateDb).getTime());;
    }

    const timelineList = convertData();


    return (
        <div>
            {/* Project Timeline */}
            <div className="relative w-full mb-4">
                <div className="flex justify-between text-sm text-gray-700">
                    <span>{Utils.formatDateTimeObj(project.startDate)}</span>
                    <span>Project Timeline</span>
                    <span>{Utils.formatDateTimeObj(project.endDate)}</span>
                </div>
                <div className="h-1 bg-gray-300 my-2"></div>
            </div>

            <div className="space-y-4">
            {timelineList.map((event: JSONObject) => {
                    const startPercent = calculatePercentage(event.startDate);
                    const endPercent = calculatePercentage(event.endDate);
                    let taskDurationPercent = endPercent - startPercent;
                    taskDurationPercent = (taskDurationPercent > 0 ) ? taskDurationPercent : 0.5;

                    return (
                        <div key={event._id} className="relative">
                            <div className="mt-2 text-gray-700 text-sm font-semibold">
                                 {event.name}
                             </div>

                             <div className="grid grid-cols-5 items-center text-sm">
                                <span className="">{Utils.formatDateTimeObj(event.startDate)}</span>

                                 <div
                                    className="relative h-1 col-span-3"
                                    style={{
                                        marginLeft: `${startPercent}%`,
                                        width: `${taskDurationPercent}%`,
                                        backgroundColor: event.bgColor
                                    }}
                                ></div>

                                <span className="flex-1 m-auto text-right ">{Utils.formatDateTimeObj(event.endDate)}</span>
                            </div>
                         </div>
                    );
                })}
                {/* {data.tasks.map((task: JSONObject) => {
                    const startPercent = calculatePercentage(task.startDate);
                    const endPercent = calculatePercentage(task.endDate);
                    const taskDurationPercent = endPercent - startPercent;

                    return (
                        <div key={task._id} className="relative">
                            <div className="mt-2 text-gray-700 text-sm font-semibold">
                                 {task.name}
                             </div>

                             <div className="grid grid-cols-5 items-center text-sm">
                                <span className="">{Utils.formatDateTimeObj(task.startDate)}</span>

                                 <div
                                    className="relative h-1 bg-blue-500 col-span-3"
                                    style={{
                                        marginLeft: `${startPercent}%`,
                                        width: `${taskDurationPercent}%`,
                                    }}
                                ></div>

                                <span className="flex-1 m-auto text-right ">{Utils.formatDateTimeObj(task.endDate)}</span>
                            </div>
                         </div>
                    );
                })} */}
            </div>
        </div>

    )
}