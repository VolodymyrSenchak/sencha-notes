import { useEffect, useState } from "react";
import { SectionPage } from "../../../models";

interface IUseSectionPageContent {
  page: SectionPage;
  onPageChanged: (page: SectionPage) => void;
}

export const useSectionPageContent = ({
  page,
  onPageChanged,
}: IUseSectionPageContent) => {
  const [pageName, setPageName] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [isLoadingPageContent, setIsLoadingPageContent] = useState<boolean>(false);
  const pageId = page?.id;

  // Grap page name and content only when page has been changed or created
  useEffect(() => {
    setIsLoadingPageContent(true);

    setTimeout(() => {
      setPageName(page?.name);
      setPageContent(page?.content.text);
      setIsLoadingPageContent(false);
    }, 100);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  // Updating page is asynccrounous, so it's better to have inner state for pageName
  useEffect(() => {
    if (pageId) {
      onPageChanged({ ...page, name: pageName });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName]);

  // Updating page is asynccrounous, so it's better to have inner state for page content
  useEffect(() => {
    if (pageId) {
      onPageChanged({ ...page, content: { text: pageContent } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageContent]);

  const handlePageDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([pageContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${pageName}.html`;
    document.body.appendChild(element);
    element.click();
  };

  return {
    pageName,
    pageContent,
    isLoadingPageContent,
    setPageName,
    setPageContent,
    handlePageDownload,
  };
};
