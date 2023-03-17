export interface IDraggable {
  index: number;
}

export const getDragProps = <T extends IDraggable>(
  items: T[],
  orderChanged: (items: T[]) => void
) => ({
  onDragEnd(fromIndex: number, toIndex: number) {
    if (toIndex === -1) return;

    const newOrderedPages = items.map((page) => {
      if (page.index === fromIndex) return { ...page, index: toIndex };
      if (page.index === toIndex) return { ...page, index: fromIndex };
      return { ...page };
    });

    orderChanged(newOrderedPages);
  },
  handleSelector: "li",
  nodeSelector: "li",
});
