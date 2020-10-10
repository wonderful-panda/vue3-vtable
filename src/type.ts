export type RowEventType<T, E extends Event> = {
  readonly item: T;
  readonly index: number;
  readonly event: E;
};

export type VtableColumn<T extends string = string> = {
  readonly id: T;
  readonly title?: string;
  readonly defaultWidth: number;
  readonly minWidth?: number;
  readonly className?: string;
};

export type RenderCellProps<T, Cols extends string = string> = {
  readonly item: T;
  readonly index: number;
  readonly columnId: Cols;
};

export type RenderCell<T, Cols extends string = string> = (
  param: RenderCellProps<T, Cols>
) => JSX.Element | string;

export type TreeNode<T> = {
  readonly data: T;
  readonly children?: readonly TreeNode<T>[];
};

export type TreeNodeWithState<T> = {
  readonly data: T;
  readonly children?: readonly TreeNode<T>[];
  readonly expanded: boolean;
  readonly level: number;
};
