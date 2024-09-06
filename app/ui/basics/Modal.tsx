import { useState } from "react";
import { IoClose } from "react-icons/io5";


export default function Modal( { children }: { children: React.ReactNode } ) {

	return (
		<div 
			className="fixed flex flex-col inset-0 bg-black bg-opacity-25 backgrop-blur-sm justify-center items-center z-50" >
				{ children }
		</div>
	);
};