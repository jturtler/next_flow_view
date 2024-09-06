import { JSONObject } from "@/lib/definations";
import MilestoneForm from "./MilestoneForm";
import MilestoneList from "./MilestoneList";
import { useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { IoIosAddCircle } from "react-icons/io";
import Modal from "@/ui/basics/Modal";
import { IoClose } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";


export default function MilestonePage({projectId, data}: {projectId: string, data: JSONObject}) {

    const milestoneList = (data.milestones !== undefined ) ? data.milestones : [];
    
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);

    return (
        <div className="bg-white w-full">
            <h2 className="text-2xl font-semibold mb-6 flex space-x-3">
                <div className="border-b-2 border-light-sky-blue pb-2 w-fit pr-5">Milestone List</div>
                <div className="flex flex-1 items-end justify-end cursor-pointer hover:text-blue-500 text-royal-blue" onClick={() => setShowMilestoneForm(true)}><IoIosAddCircle className="size-10" /></div>
            </h2>

            <MilestoneList projectId={projectId} data={milestoneList} />

            {showMilestoneForm && <Modal>
                <div className="bg-white rounded-lg w-3/4">
                    <h2 className="py-3 px-5 text-xl flex bg-blue-navy text-white rounded-t-lg items-center justify-between">
                        <div>Create New Milestone</div>
                        <div className="flex cursor-pointer" onClick={() => setShowMilestoneForm(false)}>
                            <IoIosCloseCircle className="size-6" />
                        </div>
                    </h2>

                        <div className="p-5 rounded-md bg-gray-100">
                            <MilestoneForm projectId={projectId} />
                        </div>
                    </div>
            </Modal>}

        </div>
    )
}