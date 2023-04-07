export function downloadObjectAsJson(exportObj: object, exportName: string){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function readFile<T>(file: File): Promise<T> {
  return new Promise<T>((res) => {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      res(JSON.parse(event.target.result) as T);
    };

    reader.readAsText(file);
  });
}