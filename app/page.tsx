"use client";

import { MainUiProvider } from "./contexts/MainUiContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./ui/layout/Header";
import AppWrapper from "./ui/AppWrapper";
import Footer from "./ui/layout/Footer";

export default function Home() {
	return (
		<MainUiProvider>
		 	 <AuthProvider>
				<div className="h-screen flex flex-col text-black">
					<Header />
					<AppWrapper />
					<Footer /> 
				</div>
		 	</AuthProvider> 
		 </MainUiProvider>
	);
}
