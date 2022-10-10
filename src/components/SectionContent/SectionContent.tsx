import { CloseCircleTwoTone } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useState } from "react";
import { useInitEffect } from "../../hooks/useInitEffect";
import { Section, SectionPage } from "../../models";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";

export interface ISectionContent {
  section: Section;
}

export const SectionContent: React.FC<ISectionContent> = ({ section }) => {
  const [selectedPage, setSelectedPage] = useState<SectionPage>(
    section.pages[0]
  );

  const addNewPage = () => {

  };

  if (section.pages.length < 1) {
    return (
      <section className="section-details">
        <div>There are no pages yet</div>
        <Button>Add new page</Button>
      </section>
    );
  }

  return (
    <section className="section-details">
      <div className="section-content">
        <div className="section-pages">
          <SectionPages
            selectedPage={selectedPage!}
            pages={section.pages}
            onPageSelected={(page) => setSelectedPage(page)}
          />
          <Button>Add new page</Button>
          <Button icon={<CloseCircleTwoTone />} type="text"></Button>
        </div>
        <div className="page-content">
          <SectionPageContent />
        </div>
      </div>
    </section>
  );
};
