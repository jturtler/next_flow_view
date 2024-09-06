"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useMainUi } from "@/contexts/MainUiContext";
import * as Constant from "@/lib/constant";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard/Dashboard";
import { GiThreeLeaves } from "react-icons/gi";
import ProjectDetailsPage from "./project/ProjectDetailsPage";
import * as AppStore from "@/lib/appStore";
import { RiBubbleChartFill } from "react-icons/ri";
import LoginPage from "./auth/LoginPage";
import { ProjectProvider } from "@/contexts/ProjectContext";
import UserProjectsTimeline from "./dashboard/UserProjectsTimeline";


export default function AppWrapper() {

	const { mainPage, setMainPage } = useMainUi();
	const { user } = useAuth();

	return (
		<main className={`flex-1 overflow-auto ${user !== null && "bg-opacity-20 bg-royal-blue"}`}>
			<div className="absolute flex items-end justify-start w-full bottom-14 z-0" >
				<GiThreeLeaves className="text-pale-blue size-96" />
			</div>


			<div className="absolute flex items-end justify-end w-[calc(100%-20px)]">
				<RiBubbleChartFill className="text-sky-blue size-32 opacity-15" />
			</div>

			<div className="relative h-full flex flex-col">
				<div className="flex-1">
					{mainPage === Constant.PAGE_LOGIN && <LoginPage />}
					{mainPage === Constant.PAGE_USER_REGISTRATION && <RegisterForm />}


					{mainPage === Constant.PAGE_DASHBOARD && <Dashboard />}
					{mainPage === Constant.PAGE_USER_TIMELINE && <UserProjectsTimeline projects={AppStore.getProjectList()!} details={AppStore.getDetailsProjectList()!} /> }


					{mainPage === Constant.PAGE_PROJECT_DETAILS && 
						<ProjectProvider projectId={AppStore.getProject()!._id}>
							<ProjectDetailsPage project={AppStore.getProject()!} />
						</ProjectProvider>}
				</div>
			</div>
		</main>
	)
}