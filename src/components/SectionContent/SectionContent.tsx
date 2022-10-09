import './SectionContent.scss';
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";

export const SectionContent: React.FC = () => {
  return (
    <section className="section-content">
      <div className="section-pages">
        <SectionPages />
      </div>
      <div className="page-content">
        <SectionPageContent />
      </div>
    </section>
  );
};
