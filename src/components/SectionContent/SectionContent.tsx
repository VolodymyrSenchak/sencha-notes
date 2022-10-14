import {
  CloseCircleTwoTone,
  DeleteFilled,
  EditFilled,
  EditTwoTone,
  FrownOutlined,
  PlusCircleFilled,
  PlusCircleTwoTone,
  PlusSquareFilled,
} from "@ant-design/icons";
import { Button, Popconfirm, Typography } from "antd";
import { useEffect, useState } from "react";
import { useInitEffect } from "../../hooks/useInitEffect";
import {
  Section,
  SectionPage,
  SectionPageContent as SectionPageContentModel,
} from "../../models";
import { useAppDispatch } from "../../store/hooks";
import { editSection } from "../../store/sectionsReducer";
import { NewPageModal } from "./NewPageModal";
import { SectionActions } from "./SectionActions";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";

export interface ISectionContent {
  section: Section;
  onDeleteSection: () => void;
}

export const SectionContent: React.FC<ISectionContent> = ({
  section,
  onDeleteSection,
}) => {
  const [isAddPageOpened, setAddPageOpened] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<SectionPage>(section.pages[0]);
  const dispatch = useAppDispatch();

  const { name } = section;

  useEffect(() => {
    if (section.pages.length > 0) {
      setCurrentPage(section.pages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const closeAddPageModal = () => setAddPageOpened(false);
  const openAddPageModal = () => setAddPageOpened(true);

  const addNewPage = (name: string) => {
    const newPage: SectionPage = { name, content: { text: "" } };
    const newSection: Section = {
      ...section,
      pages: [...section.pages, newPage],
    };

    dispatch(editSection(newSection));
    setCurrentPage(newPage);
    closeAddPageModal();
  };

  const onPageContentChanged = (content: SectionPageContentModel) => {
    const newPageState: SectionPage = { ...currentPage, content };

    dispatch(
      editSection({
        ...section,
        pages: section.pages.map((p) =>
          p.name === newPageState.name ? newPageState : p
        ),
      })
    );

    setCurrentPage(newPageState);
  };

  return (
    <>
      {section.pages.length > 0 ? (
        <section className="section-details">
          <div className="section-content">
            <div className="section-pages">
              <div className="section-pages-menu">
                <SectionPages
                  selectedPage={currentPage!}
                  pages={section.pages}
                  onPageSelected={(page) => setCurrentPage(page)}
                />
              </div>

              <SectionActions
                onAddNewPage={openAddPageModal}
                onDeleteThisSection={onDeleteSection}
                onEditThisSection={() => {}}
              ></SectionActions>
            </div>

            <div className="page-content">
              <SectionPageContent
                pageContent={currentPage.content}
                onPageContentChanged={onPageContentChanged}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="section-details">
          <div className="flex-column flex-align-items-center height-full flex-justify-content-center">
            <FrownOutlined
              className="margin-bottom-1"
              style={{ fontSize: "5rem" }}
              size={64}
            />
            <Typography.Title level={4}>
              There are no pages yet
            </Typography.Title>
            <Button size="large" type="primary" onClick={openAddPageModal}>
              Add new page
            </Button>
          </div>
        </section>
      )}

      <NewPageModal
        isModalOpened={isAddPageOpened}
        existingPagesNames={section.pages.map((p) => p.name)}
        cancel={closeAddPageModal}
        submit={addNewPage}
      ></NewPageModal>
    </>
  );
};
