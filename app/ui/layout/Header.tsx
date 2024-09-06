"use client"

import { useMainUi } from "@/contexts/MainUiContext";
import * as Constant from '@/lib/constant';
import { useAuth } from "@/contexts/AuthContext";
import { FcTimeline } from "react-icons/fc";
import { CiWavePulse1 } from "react-icons/ci";
import { LuGanttChart } from "react-icons/lu";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import * as AppStore from "@/lib/appStore";
import { IoMdArrowDropright } from "react-icons/io";
import { FaArrowsSpin } from "react-icons/fa6";
import { MdDoubleArrow } from "react-icons/md";
import { ImPlus } from "react-icons/im";
import { FaMeetup } from "react-icons/fa";
import { LuMilestone } from "react-icons/lu";
import { FaTasks } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import ProjectNavigation from "./ProjectNavigation";



export default function Header() {

	const { mainPage, setMainPage, setSubPage } = useMainUi();
	const { user, logout } = useAuth();

	const handleLogout = () => {
		const ok = confirm("are you sure you want to logout ?");
		if (ok) {
			logout();
			setMainPage(Constant.PAGE_LOGIN);
		}
	}

	const showDashboard = () => {
		AppStore.setProject(null);
		setMainPage(Constant.PAGE_DASHBOARD);
		setSubPage(null);
	}          

	return (
		<header className={`flex bg-white px-4 py-3 items-center text-sm z-10 ${user !== null && "border-b border-gray-400"}`}>
			{user !== null && mainPage === Constant.PAGE_DASHBOARD && <div className={`ml-5 flex-1 flex items-start flex-col`}  >
                <div className="text-2xl transition-transform">Welcome, {user!.email.split("@")[0]}</div>
                <div className="text-md italic">Here is your project list and agendar</div>
			</div>}

			{mainPage === Constant.PAGE_USER_TIMELINE && <>
				<div 
					className={`pr-5 uppercase cursor-pointer text-bright-blue hover:text-royal-blue ml-5`}
					onClick={() => showDashboard()
					}><MdDashboard className="size-8"/></div>
			
				<div className="uppercase pr-5 border-b-2 hover:border-light-sky-blue border-light-sky-blue text-lg">Timeline</div>
			</>}

			{mainPage === Constant.PAGE_PROJECT_DETAILS && <>
				<div 
					  className={`pr-5 uppercase cursor-pointer text-bright-blue hover:text-royal-blue ml-5`}
					  onClick={() => showDashboard()
					  }><MdDashboard className="size-8"/></div>
			
				<div className="flex space-x-4 items-center text-lg">
					  <ProjectNavigation />
				</div>
			</>}

			{mainPage === Constant.PAGE_LOGIN && <div className="ml-auto items-center justify-center flex flex-row space-x-1 uppercase">
				<LuGanttChart className="text-torch-red"/>
				<div className="cursor-pointer" onClick={() => setMainPage(Constant.PAGE_USER_REGISTRATION)}>Register</div>
				<RiBarChartHorizontalLine className="text-torch-red" />
			</div>}

			{mainPage === Constant.PAGE_USER_REGISTRATION && <div className="ml-auto items-center justify-center flex flex-row space-x-1 uppercase">
				<LuGanttChart className="text-torch-red"/>
				<div className="cursor-pointer" onClick={() => setMainPage(Constant.PAGE_LOGIN)}>Login</div>
				<RiBarChartHorizontalLine className="text-torch-red" />
			</div>}

			{user !== null && <div className="m-auto items-center justify-end flex flex-1 flex-row space-x-1">
				<FaUserCircle className=" size-8 text-blue-navy" onClick={() => handleLogout()}/>
			</div>}
		</header>
	)
}