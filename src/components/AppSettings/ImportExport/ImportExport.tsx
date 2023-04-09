import { UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, message, Upload } from "antd";
import { isEmpty, isNil } from "lodash";
import { useState } from "react";
import {
  downloadObjectAsJson,
  readFile,
} from "../../../common/utils/fileUtils";
import { Section } from "../../../models";
import { sectionsService } from "../../../services/sectionsService";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../../services/queryKeys";

interface IImportExport {
  importFinished: () => void;
}

interface SectionToImport {
  section: Section;
  import: boolean;
}

export const ImportExport: React.FC<IImportExport> = ({ importFinished }) => {
  const [sectionsToImport, setSectionsToImport] = useState<SectionToImport[]>(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const onExportSectionsClicked = async () => {
    const allSections = await sectionsService.getSections();
    downloadObjectAsJson(allSections, "sections");
  };

  const props = {
    beforeUpload: async (file: File) => {
      const sections = await readFile<Section[]>(file);

      const basicalyValidFile = validateFile(sections);

      if (basicalyValidFile) {
        setSectionsToImport(
          sections.map((section) => ({ section, import: true }))
        );
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

      for (const page of item.pages) {
        if (isNil(page.content)) return false;
      }
    }

    return true;
  };

  const importSections = async () => {
    const newSections = sectionsToImport
      .filter((s) => s.import)
      .map((s) => s.section);

    const existingSections = await sectionsService.getSections();

    for (const newSection of newSections) {
      const existing = existingSections.find(
        (s) => s.name.toLowerCase() === newSection.name.toLowerCase()
      );

      if (!isNil(existing)) {
        await sectionsService.deleteSection(existing.id);
      }

      await sectionsService.addSection(newSection);
    }

    await queryClient.resetQueries(queryKeys.sections)

    importFinished();
  };

  return (
    <div>
      {contextHolder}

      <div className="flex flex-gap-1">
        <div className="flex-1">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Import Sections</Button>
          </Upload>
        </div>

        <div className="flex-1">
          <Button onClick={onExportSectionsClicked}>Export Sections</Button>
        </div>
      </div>

      {!isEmpty(sectionsToImport) && (
        <>
          <h3>Select Sections to import</h3>

          <div className="margin-bottom-1">
            <Alert
              message="If there is already setting with the same name - it will be overriden."
              type="warning"
            ></Alert>
          </div>

          {sectionsToImport.map((option) => (
            <div>
              <Checkbox
                checked={option.import}
                onChange={(e) =>
                  setSectionsToImport(
                    sectionsToImport.map((sectionToImport) =>
                      sectionToImport === option
                        ? {
                            section: sectionToImport.section,
                            import: e.target.checked,
                          }
                        : sectionToImport
                    )
                  )
                }
              >
                {option.section.name}
              </Checkbox>
            </div>
          ))}
        </>
      )}

      <div className="flex-justify-content-end margin-top-2">
        <Button
          disabled={sectionsToImport.every((s) => !s.import)}
          type="primary"
          onClick={importSections}
        >
          Save Sections
        </Button>
      </div>
    </div>
  );
};
