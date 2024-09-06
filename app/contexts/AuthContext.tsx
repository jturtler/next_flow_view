"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as dbService from "@/lib/dbService";

interface AuthContextProps {
	user: JSONObject | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	register: (user: JSONObject) => Promise<void>;
	setUser: (user: JSONObject | null) => void,
	error: string | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	login: async () => { },
	logout: () => { },
	register: async(user: JSONObject) => {},
	setUser: (user: JSONObject | null) => {},
	error: null,
	loading: false
});

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);

	if (!context) {
	  throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);

		const response: JSONObject = await dbService.login({email, password});

		if (response.status != "success")  {
			setError(response.message);
		}
		else {
			setUser(response.data);
		}

		setLoading(false);
	};

	const logout = () => {
		setUser(null);
	}

	const register = async(userData: JSONObject) => {
		setLoading(true);
		setError(null);
		
		const response: JSONObject = await dbService.register(userData);
		if (response.status != "success")  {
			setError(response.message);
		}
		else {
			setUser(response.data);
		}
	}

	return (
		<AuthContext.Provider value={{ user, setUser, loading, error: error, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
};
