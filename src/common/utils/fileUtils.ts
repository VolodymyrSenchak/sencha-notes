export function downloadObjectAsJson(exportObj: object, exportName: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(exportObj)], { type: "application/json" }));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFile<T>(file: File): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as T);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);

    reader.readAsText(file);
  });
}
