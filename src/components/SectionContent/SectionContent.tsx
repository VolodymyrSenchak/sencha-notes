import { CloseCircleTwoTone } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useState } from "react";
import { useInitEffect } from "../../hooks/useInitEffect";
import { Section, SectionPage, SectionPageContent as SectionPageContentModel } from "../../models";
import { useAppDispatch } from "../../store/hooks";
import { editSection } from "../../store/sectionsReducer";
import { NewPageModal } from "./NewPageModal";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";

export interface ISectionContent {
  section: Section;
}

export const SectionContent: React.FC<ISectionContent> = ({ section }) => {
  const [isAddPageOpened, setAddPageOpened] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<SectionPage>(section.pages[0]);

  const dispatch = useAppDispatch();

  const closeAddPageModal = () => setAddPageOpened(false);
  const openAddPageModal = () => setAddPageOpened(true);

  const addNewPage = (name: string) => {
    const newPage: SectionPage =  { name, content: { text: '' }};
    const newSection: Section = {
      ...section,
      pages: [...section.pages, newPage ]
    };

    dispatch(editSection(newSection));
    setCurrentPage(newPage);
    closeAddPageModal();
  };

  const existingPageNames = section.pages.map((p) => p.name);

  const onPageContentChanged = (content: SectionPageContentModel) => {
    const newPageState: SectionPage = {
      ...currentPage,
      content
    };
    const newSectionState: Section = {
      ...section,
      pages: section.pages.map(p => p.name === newPageState.name ? newPageState : p)
    };

    setCurrentPage(newPageState);
    dispatch(editSection(newSectionState));
  }

  if (section.pages.length < 1) {
    return (
      <section className="section-details">
        <div>There are no pages yet</div>
        <Button onClick={openAddPageModal}>Add new page</Button>
      </section>
    );
  }

  return (
    <>
      <section className="section-details">
        <div className="section-content">
          <div className="section-pages">
            <SectionPages
              selectedPage={currentPage!}
              pages={section.pages}
              onPageSelected={(page) => setCurrentPage(page)}
            />
            <Button
              onClick={openAddPageModal}
              className="width-full margin-bottom-1"
            >
              Add new page
            </Button>
            <Button className="width-full" danger>
              Delete this section
            </Button>
          </div>
          <div className="page-content">
            <SectionPageContent pageContent={currentPage.content} onPageContentChanged={onPageContentChanged} />
          </div>
        </div>
      </section>

      <NewPageModal
        isModalOpened={isAddPageOpened}
        existingPagesNames={existingPageNames}
        cancel={closeAddPageModal}
        submit={addNewPage}
      ></NewPageModal>
    </>
  );
};
