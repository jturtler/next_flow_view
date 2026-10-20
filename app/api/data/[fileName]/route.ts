import { NextResponse } from "next/server";
import { assertSessionSecret, getSessionUserId } from "@/lib/auth/session";
import { readFileData, updateDataList } from "@/services/fileService";

const dataFiles: Record<string, string> = {
  users: "users.json",
  projects: "projects.json",
  tasks: "tasks.json",
  milestones: "milestones.json",
  meetings: "meetings.json",
};

type RouteContext = {
  params: { fileName: string };
};

const resolveFileName = (fileName: string) => dataFiles[fileName];

const requireSession = () => {
  try {
    assertSessionSecret();
    if (!getSessionUserId()) {
      return NextResponse.json(
        { status: "error", message: "Authentication required" },
        { status: 401 },
      );
    }
    return null;
  } catch (error) {
    console.error("Unable to validate API session", error);
    return NextResponse.json(
      { status: "error", message: "Authentication is not configured" },
      { status: 500 },
    );
  }
};

export async function GET(_request: Request, { params }: RouteContext) {
  const fileName = resolveFileName(params.fileName);
  if (!fileName) {
    return NextResponse.json(
      { status: "error", message: "Unknown data file" },
      { status: 404 },
    );
  }

  const authError = requireSession();
  if (authError) return authError;

  try {
    const data = await readFileData(fileName);
    if (fileName === "users.json") {
      const users = data.map((user) => {
        if (typeof user !== "object" || user === null) return user;
        const { password: _password, ...safeUser } = user as Record<
          string,
          unknown
        >;
        return safeUser;
      });
      return NextResponse.json({ status: "success", data: users });
    }
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error(`Unable to read ${fileName}`, error);
    return NextResponse.json(
      { status: "error", message: "Unable to read data file" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const fileName = resolveFileName(params.fileName);
  if (!fileName) {
    return NextResponse.json(
      { status: "error", message: "Unknown data file" },
      { status: 404 },
    );
  }

  const authError = requireSession();
  if (authError) return authError;

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Request body must be valid JSON" },
      { status: 400 },
    );
  }
  if (!Array.isArray(data)) {
    return NextResponse.json(
      { status: "error", message: "Request body must be a JSON array" },
      { status: 400 },
    );
  }

  try {
    await updateDataList(fileName, (list) => {
      list.length = 0;
      for (const item of data) list.push(item);
    });
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error(`Unable to write ${fileName}`, error);
    return NextResponse.json(
      { status: "error", message: "Unable to write data file" },
      { status: 500 },
    );
  }
}
