import { UploadOutlined } from "@ant-design/icons";
import { Alert, Button, message, Upload } from "antd";
import { isEmpty } from "lodash";
import { useState } from "react";
import {
  downloadObjectAsJson,
  readFile,
} from "../../../common/utils/fileUtils";
import { Section } from "../../../models";
import { sectionsService } from "../../../services/sectionsService";

interface IImportExport {}

export const ImportExport: React.FC<IImportExport> = () => {
  const [sectionsToImport, setSectionsToImport] = useState<Section[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const onExportSectionsClicked = async () => {
    const allSections = await sectionsService.getSections();
    downloadObjectAsJson(allSections, "sections");
  };

  const props = {
    beforeUpload: async (file: File) => {
      const sections = await readFile<any>(file);

      const basicalyValidFile = validateFile(sections);

      if (basicalyValidFile) {
        setSectionsToImport(sections);
      } else {
        messageApi.error("Looks like file has invalid data.");
      }

      return false;
    },
    fileList: [],
  };

  const validateFile = (data: any) => {
    if (!Array.isArray(data)) return false;

    for (const item of data as Section[]) {
      if (isEmpty(item.name)) return false;
      if (!Array.isArray(item.pages)) return false;
    }

    return true;
  };

  const importSections = () => {};

  return (
    <div>
      {contextHolder}
      <Alert
        message="For now syncing is not available. But now You can sync sections data with files."
        type="info"
      />

      <div className="flex margin-top-1 flex-gap-1">
        <div className="flex-1">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Import Sections</Button>
          </Upload>
        </div>

        <div className="flex-1">
          <Button onClick={onExportSectionsClicked}>Export Sections</Button>
        </div>
      </div>

      {sectionsToImport.map((section) => (
        <div>{section.name}</div>
      ))}

      <div className="flex-justify-content-end margin-top-2">
        <Button
          disabled={!sectionsToImport}
          type="primary"
          onClick={importSections}
        >
          Save Sections
        </Button>
      </div>
    </div>
  );
};
