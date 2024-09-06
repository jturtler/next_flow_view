import { RiBubbleChartFill } from "react-icons/ri";
import LoginForm from "./LoginForm";
import { FaTimeline } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";


export default function LoginPage() {

    return (
        <div className="flex flex-col">
            <div className="justify-center bg-royal-blue bg-opacity-40">
                <div className="relative h-full py-10">

                    <div className="grid grid-cols-1 h-fit sm:grid-cols-3 ml-7">
                        <div className="flex flex-col space-y-1 col-span-1 sm:col-span-2">
                            <div className="flex flex-row space-y-8">
                                <div>
                                    <div className="text-4xl font-bold text-blue-navy mb-2">Project</div>
                                    <div className="text-4xl font-bold text-blue-navy">FlowMaster</div>
                                </div>
                                <div className="m-auto justify-end"><RiBubbleChartFill className="size-20 opacity-40 text-white" /></div>
                            </div>
                            <div className="text-md border-l-4 m-1 border-slate-800 px-3 text-balance">
                                FlowMaster is a comprehensive project management tool designed to streamline workflows. It allows teams to visualize project timelines, track milestones, and manage tasks efficiently.
                            </div>
                        </div>

                        <div className={`bg-white bg-opacity-50 w-full z-10 rounded-tl-full rounded-bl-full flex items-center justify-center mt-5 sm:mt-0`}>
                            <div className={`w-full flex items-center justify-center pl-10 pt-5`}>
                                <LoginForm />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-end justify-end w-full">
                        <RiBubbleChartFill className="text-pale-blue size-32 opacity-65" />
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-4 my-5 mx-3 h-full">
                    <div className="bg-royal-blue bg-opacity-20 p-3 rounded-t-xl flex flex-col items-center justify-center font-bold">
                        <div><FaTimeline className="size-32 text-blue-500" /></div>
                        <div>Visualize project timelines</div>
                    </div>
                    <div className="bg-royal-blue bg-opacity-20 p-3 rounded-t-xl flex flex-col items-center justify-center font-bold">
                        <div className="text-[90px]">🎯</div>
                        <div>Track milestones</div>
                    </div>
                    <div className="bg-royal-blue p-3 rounded-t-xl bg-opacity-20 flex flex-col items-center justify-center font-bold">
                        <div><FaTasks className="size-32 text-green-400" /></div>
                        <div>Manage tasks efficiently</div>
                    </div>
                </div>
            </div>
        </div>)
}