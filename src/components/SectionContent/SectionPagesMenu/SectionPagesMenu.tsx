import { Button, Menu, MenuProps, Popover } from "antd";
import { SectionPage } from "../../../models";
import ReactDragListView from "react-drag-listview";
import { orderBy } from "lodash";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { getDragProps } from "./dragPageProps";

export interface ISectionPages {
  selectedPage: SectionPage;
  pages: SectionPage[];
  onPageSelected: (page: SectionPage) => void;
  onPagesOrderChanged: (pages: SectionPage[]) => void;
  onPageDelete: (pageId: string) => void;
}

export const SectionPagesMenu: React.FC<ISectionPages> = ({
  selectedPage,
  pages,
  onPageSelected,
  onPagesOrderChanged,
  onPageDelete,
}) => {
  const [popoverSelectedKey, setPopoverSelectedKey] = useState<string>();
  const dragProps = getDragProps<SectionPage>(pages, onPagesOrderChanged);

  const onMenuItemClick: MenuProps["onClick"] = (e) => {
    onPageSelected(pages.find((p) => p.id === e.key)!);
  };

  const handleContextOpenClose = (newOpen: boolean) => {
    if (!newOpen) setPopoverSelectedKey(undefined);
  };

  const onContextMenuOpen = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setPopoverSelectedKey(key);
  };

  const onPageDeleteClicked = (pageId: string) => {
    handleContextOpenClose(false);
    onPageDelete(pageId);
  };

  return (
    <ReactDragListView {...dragProps}>
      <Menu
        mode="vertical"
        onClick={onMenuItemClick}
        selectedKeys={selectedPage ? [selectedPage.id] : []}
      >
        {orderBy(pages, (p) => p.index).map((page) => (
          <Menu.Item
            key={page!.id}
            onContextMenu={(e) => onContextMenuOpen(e, page!.id as string)}
          >
            <Popover
              content={
                <div className="flex-column context-menu-popover">
                  <Button
                    disabled={pages.length < 2}
                    icon={<DeleteOutlined />}
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageDeleteClicked(page!.id as string);
                    }}
                  >
                    Remove Page
                  </Button>
                </div>
              }
              trigger="click"
              open={popoverSelectedKey === page!.id}
              onOpenChange={handleContextOpenClose}
            >
              {page.name || "Untitled"}
            </Popover>
          </Menu.Item>
        ))}
      </Menu>
    </ReactDragListView>
  );
};
