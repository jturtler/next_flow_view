
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";
import { MdDoubleArrow } from "react-icons/md";
import * as Constant from '@/lib/constant';
import { ImPlus } from "react-icons/im";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useState } from "react";


export default function ProjectNavigation() {

    const { subPage, setSubPage } = useMainUi();
    const [showMenus, setShowMenus] = useState(false);

    const renderDetailsOptions = () => {
        return (
            <>

                <div
                    className={`cursor-pointer pr-5 border-b-2 hover:border-light-sky-blue ${subPage === Constant.SUB_PAGE_TIMELINE ? "border-light-sky-blue" : "border-white"}`}
                    onClick={() => setSubPage(Constant.SUB_PAGE_TIMELINE)}>
                    Timeline
                </div>

                <div
                    className={`cursor-pointer pr-5 border-b-2 hover:border-light-sky-blue ${subPage === Constant.SUB_PAGE_CALENDAR ? "border-light-sky-blue" : "border-white"}`}
                    onClick={() => setSubPage(Constant.SUB_PAGE_CALENDAR)}>
                    Calendar
                </div>

                <div
                    className={`cursor-pointer pr-5 border-b-2 hover:border-light-sky-blue flex flex-row space-x-1 items-center ${subPage === Constant.SUB_PAGE_NEW_TASK ? "border-light-sky-blue" : "border-white"}`}
                    onClick={() => setSubPage(Constant.SUB_PAGE_NEW_TASK)}>
                    Tasks
                </div>

                <div
                    className={`cursor-pointer pr-5 border-b-2 hover:border-light-sky-blue flex flex-row space-x-2 items-center ${subPage === Constant.SUB_PAGE_NEW_MEETING ? "border-light-sky-blue" : "border-white"}`}
                    onClick={() => setSubPage(Constant.SUB_PAGE_NEW_MEETING)}>
                    Meetings
                </div>

                <div
                    className={`cursor-pointer pr-5 border-b-2 hover:border-light-sky-blue flex flex-row space-x-2 items-center ${subPage === Constant.SUB_PAGE_NEW_MILESTONE ? "border-light-sky-blue" : "border-white"}`}
                    onClick={() => setSubPage(Constant.SUB_PAGE_NEW_MILESTONE)}>
                    Millestones
                </div>
            </>
        )
    }

    return (
        <>
            <div className="uppercase whitespace-nowrap animate-shake" >
                {AppStore.getProject() !== null && AppStore.getProject()!.name}
            </div>

            {/* For large screen */}
            <div className="flex flex-row space-x-3 justify-between items-center hidden md:flex">
                <MdDoubleArrow />
                {renderDetailsOptions()}
            </div>


            {/* For small screen */}
            {/* Trigger Icon (Up Arrow) */}
            {!showMenus && (
                <MdKeyboardDoubleArrowUp
                    className="md:hidden font-bold cursor-pointer "
                    onClick={() => setShowMenus(true)}
                />
            )}
            
            {/* Close Icon (Down Arrow) */}
            {showMenus && (
                <MdKeyboardDoubleArrowDown
                    className="cursor-pointer"
                    onClick={() => setShowMenus(false)}
                />)}

            <div className="relative">
                {/* Context Menu */}
                {showMenus && ( <div className="absolute left-full top-0 ml-2 bg-blue-50 rounded-b-lg shadow-lg z-10">
                    {/* Render the Menu Options */}
                    <div className="flex flex-col space-y-5 p-3 border border-blue-200">
                        {renderDetailsOptions()}
                    </div>
                </div> )}
            </div>
        </>
    )
}