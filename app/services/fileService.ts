import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const dataFiles = new Set([
  "users.json",
  "projects.json",
  "tasks.json",
  "milestones.json",
  "meetings.json",
]);

const getFilePath = (fileName: string) => {
  if (!dataFiles.has(fileName)) {
    throw new Error(`Unsupported data file: ${fileName}`);
  }

  return path.join(process.cwd(), "data", fileName);
};
let writeQueue: Promise<void> = Promise.resolve();

export const readJsonFile = async <T>(fileName: string): Promise<T> => {
  const contents = await readFile(getFilePath(fileName), "utf8");
  return JSON.parse(contents) as T;
};

export const readFileData = async <T>(fileName: string): Promise<T[]> => {
  const parsed = await readJsonFile<unknown>(fileName);
  if (!Array.isArray(parsed)) {
    throw new TypeError(`${fileName} must contain a JSON array`);
  }
  return parsed as T[];
};

export const writeDataList = async <T>(fileName: string, dataList: T[]) => {
  const filePath = getFilePath(fileName);
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(
    temporaryPath,
    `${JSON.stringify(dataList, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, filePath);
};

export const updateDataList = async <T, R = T[]>(
  fileName: string,
  update: (list: T[]) => R,
): Promise<R> => {
  const operation = writeQueue.then(async () => {
    const list: T[] = await readFileData(fileName);
    const result = update(list);
    await writeDataList(fileName, list);
    return result;
  });
  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );
  return operation;
};
