import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { useEffect } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";


export default function UserProjectsTimeline({projects, details}: {projects?: JSONObject[], details: JSONObject}) {

    const timelineList = Utils.convertProgramDetails(details, projects);

    useEffect(() => {
        // Add class after component mounts
        if( document.querySelector('.vertical-timeline') !== null 
            &&  document.querySelector('.vertical-timeline')!.classList != null)
                document.querySelector('.vertical-timeline')!.classList.remove('vertical-timeline--animate');
    }, []);

    return (
        <div className="relative h-full py-6 px-5 bg-white rounded-lg">
            <VerticalTimeline className=''>
                {timelineList.map((item: JSONObject, index: number) => {
                    const IconComponent = item.icon;

                    return (
                        <VerticalTimelineElement
                            contentStyle={{ border: '2px solid #bfdbfe', backgroundColor: "#bfdbfe  ", color: '#fff', boxShadow: "0 3px 0 #fff" }}
                            contentArrowStyle={{ borderRight: '7px solid  #bfdbfe' }}
                            key={item._id}
                            date={item.date}
                            icon={<IconComponent />}
                            iconStyle={{ background: item.bgColor, color: item.textColor }}
                        >
                            <h3 className="vertical-timeline-element-title line-space text-black flex flex-row">
                                {item.status && <span className="px-2 py-1 rounded-md mr-4 whitespace-nowrap items-center flex" style={{backgroundColor: Utils.getStatusColor(item.status)}}>{Utils.getStatusName(item.status)}</span>}
                                <span className="font-bold">{item.name}</span>
                            </h3>
                            <div className="text-sm mt-3 text-black">{item.description}</div>
                        </VerticalTimelineElement>
                    )
                })}
            </VerticalTimeline>
        </div>
    );
}