import { Menu, MenuProps } from "antd";
import { SectionPage } from "../../../models";
import ReactDragListView from "react-drag-listview";
import { orderBy } from "lodash";

export interface ISectionPages {
  selectedPage: SectionPage;
  pages: SectionPage[];
  onPageSelected: (page: SectionPage) => void;
  onPagesOrderChanged: (pages: SectionPage[]) => void;
}

export const SectionPages: React.FC<ISectionPages> = ({
  selectedPage,
  pages,
  onPageSelected,
  onPagesOrderChanged
}) => {
  const orderedPages = orderBy(pages, p => p.index);
  const navItems: MenuProps["items"] = orderedPages.map((p) => ({
    label: p.name || "Untitled",
    key: p.id,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    const newSelection = pages.find((p) => p.id === e.key);
    onPageSelected(newSelection!);
  };

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      if (toIndex === -1) return;

      const newOrderedPages = pages.map(page => {
        if (page.index === fromIndex) return { ...page, index: toIndex };
        if (page.index === toIndex) return { ...page, index: fromIndex };
        return { ...page };
      });

      onPagesOrderChanged(newOrderedPages);
    },
    handleSelector: "li",
    nodeSelector: "li"
  };

  return (
    <ReactDragListView {...dragProps}>
      <Menu
        mode="vertical"
        onClick={onClick}
        selectedKeys={selectedPage ? [selectedPage.id] : []}
        items={navItems}
      ></Menu>
    </ReactDragListView>
  );
};
