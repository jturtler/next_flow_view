'use server';

import { randomBytes } from "node:crypto";
import { JSONObject } from "../definations";
import * as Encrypt from "./encryptPassword";
import {
	assertSessionSecret,
	clearSession,
	createSession,
} from "@/lib/auth/session";
import { readFileData, updateDataList } from "@/services/fileService";
import { TUser } from "../../../types/model";

const userFileName = "users.json";

const withoutPassword = ({ password: _password, ...user }: TUser): Partial<TUser> =>
	user;

export async function login({email, password}: JSONObject): Promise<JSONObject> {

	try {
		assertSessionSecret();

		if (!email || !password) {
			return { status: "error", message: "Email and password are required." };
		}

		const users = await readFileData<TUser>(userFileName);
		const foundUser = users.find(
			(user) => user.email.toLowerCase() === email.toLowerCase(),
		);
		if (!foundUser || !(await Encrypt.comparePassword(password, foundUser.password))) {
			return { status: "error", message: "Invalid email or password." };
		}

		const usersById = new Map(users.map((user) => [user._id, user]));
		const teamMembers = (foundUser.teamMembers ?? [])
			.map((id) => usersById.get(id))
			.filter((user): user is TUser => user !== undefined)
			.map(withoutPassword);
		const safeUser = {
			...withoutPassword(foundUser),
			teamMembers,
		};
		await createSession(String(foundUser._id));

		return { status: "success", data: safeUser };
	} catch (error: any) {
		return ({status: "error", message: error.message});
	}
}

export async function register(userData: JSONObject): Promise<JSONObject> {
	
	try {
		assertSessionSecret();
		if (
			typeof userData.email !== "string" ||
			!userData.email.trim() ||
			typeof userData.password !== "string" ||
			!userData.password ||
			typeof userData.role !== "string" ||
			!userData.role
		) {
			return { status: "error", message: "Email, password, and role are required." };
		}

		const email = userData.email.trim();
		const now = new Date().toISOString();
		const newUser: TUser = {
			_id: randomBytes(12).toString("hex"),
			email,
			password: await Encrypt.hashPassword(userData.password),
			role: userData.role,
			teamMembers: [],
			createdAt: now,
			updatedAt: now,
		};

		await updateDataList<TUser, TUser>(userFileName, (users) => {
			if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
				throw new Error("An account with this email already exists.");
			}
			users.push(newUser);
			return newUser;
		});

		await createSession(String(newUser._id));
		return { status: "success", data: withoutPassword(newUser) };

	} catch (error: any) {
		return ({status: "error", message: error.message});
	}
}

export async function logout(): Promise<void> {
	await clearSession();
}
