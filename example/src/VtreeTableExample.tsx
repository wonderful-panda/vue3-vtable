import { defineComponent, ref } from "vue";
import {
  VtableColumn,
  RenderCell,
  TreeNode,
  TreeNodeWithState,
  vtreeTableOf,
  ExpandableCell,
} from "vue3-vtable";
import { css } from "emotion";

type Item = { id: string; value: string };
type Cols = "name" | "value" | "description";
const VtreeTable = vtreeTableOf<Item, Cols>();

const wrapperClass = css`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`;

const className = css`
  border: 1px solid #bbb;
  flex: 1;
  .vtable-header {
    border-bottom: 1px solid #bbb;
  }
  .vtable-splitter {
    border-right: 1px solid #bbb;
  }
  .vtable-splitter-active {
    background-color: #bbb;
  }
  .vtable-cell,
  .vtable-header-cell {
    padding: 0 2px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .vlist-row:hover {
    background-color: #eee;
  }
  .cell-desc {
    flex: 1;
  }
`;

const columns: VtableColumn<Cols>[] = [
  {
    id: "name",
    minWidth: 80,
    defaultWidth: 120,
  },
  {
    id: "value",
    minWidth: 80,
    defaultWidth: 120,
    className: "cell-value",
  },
  {
    id: "description",
    minWidth: 100,
    defaultWidth: 240,
    className: "cell-desc",
  },
];

/* Create root nodes */
const ABCDE = [..."ABCDE"];
const createNode = (id: string, level: number): TreeNode<Item> => {
  if (level < 5) {
    return {
      data: { id, value: `value: ${id}` },
      children: ABCDE.map((i) => createNode(`${id}${i}`, level + 1)),
    };
  } else {
    return { data: { id, value: `value: ${id}` } };
  }
};

const roots = ABCDE.map((c) => createNode(c, 0));

export default defineComponent({
  name: "App",
  setup() {
    const state = ref({ widths: {} as Record<Cols, number> });
    const vm = ref<null | InstanceType<typeof VtreeTable>>(null);
    const cell: RenderCell<TreeNodeWithState<Item>, Cols> = (p) => {
      const { id, value } = p.item.data;
      switch (p.columnId) {
        case "name":
          return (
            <ExpandableCell nodeState={p.item} class="cell-name">
              {id}
            </ExpandableCell>
          );
        case "value":
          return value;
        case "description":
          return `desc: ${id}`;
        default:
          return p.columnId;
      }
    };

    return () => (
      <div class={wrapperClass}>
        <div style={{ margin: "2px" }}>
          <button style={{ margin: "2px" }} onClick={() => vm.value?.expandAll()}>
            Expand all
          </button>
          <button style={{ margin: "2px" }} onClick={() => vm.value?.collapseAll()}>
            Collapse all
          </button>
        </div>
        <VtreeTable
          ref={vm}
          class={className}
          columns={columns}
          getItemKey={(s) => s.id}
          rootNodes={roots}
          rowHeight={24}
          renderCell={cell}
          state={state.value}
          hoveredSplitterClass="vtable-splitter-active"
          draggingSplitterClass="vtable-splitter-active"
          on={{
            "update:state": (value) => {
              state.value = value;
            },
          }}
        />
      </div>
    );
  },
});
