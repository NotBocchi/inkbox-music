const DATABASE_NAME = "inkbox-files";
const DATABASE_VERSION = 1;
const AUDIO_STORE = "audio";
const TEXT_STORE = "text";

interface BrowserFileOptions {
  accept: string;
  multiple?: boolean;
  directory?: boolean;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(AUDIO_STORE)) {
        database.createObjectStore(AUDIO_STORE);
      }
      if (!database.objectStoreNames.contains(TEXT_STORE)) {
        database.createObjectStore(TEXT_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putFile(storeName: string, key: string, file: File): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(file, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function getFile(storeName: string, key: string): Promise<File | null> {
  const database = await openDatabase();
  const file = await new Promise<File | null>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(key);
    request.onsuccess = () => resolve((request.result as File | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file;
}

export async function registerBrowserAudioFile(
  file: File,
  identity: string,
): Promise<string> {
  const key = `browser-audio://${identity}`;
  await putFile(AUDIO_STORE, key, file);
  return key;
}

export async function resolveBrowserAudioFile(key: string): Promise<File | null> {
  return getFile(AUDIO_STORE, key);
}

export async function registerBrowserTextFile(file: File): Promise<string> {
  const key = `browser-file://${crypto.randomUUID()}/${file.name}`;
  await putFile(TEXT_STORE, key, file);
  return key;
}

export async function readBrowserTextFile(key: string): Promise<string> {
  const file = await getFile(TEXT_STORE, key);
  if (!file) throw new Error("歌词文件已经不可用，请重新导入。");
  return file.text();
}

export function chooseBrowserFiles({
  accept,
  multiple = false,
  directory = false,
}: BrowserFileOptions): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple || directory;
    if (directory) {
      input.setAttribute("webkitdirectory", "");
      input.setAttribute("directory", "");
    }
    input.addEventListener("change", () => resolve(Array.from(input.files ?? [])));
    input.addEventListener("cancel", () => resolve([]));
    input.click();
  });
}
