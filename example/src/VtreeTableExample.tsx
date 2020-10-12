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

type Cols = "index" | "name" | "value" | "description";
const VtreeTable = vtreeTableOf<string, Cols>();

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
    border-left: 1px solid #bbb;
  }
  .vtable-splitter-active {
    background-color: #bbb;
  }
  .vtable-cell,
  .vtable-header-cell {
    padding: 0 2px;
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
    id: "index",
    title: "#",
    minWidth: 20,
    defaultWidth: 60,
  },
  {
    id: "name",
    minWidth: 100,
    defaultWidth: 200,
  },
  {
    id: "value",
    minWidth: 100,
    defaultWidth: 200,
    className: "cell-value",
  },
  {
    id: "description",
    minWidth: 100,
    defaultWidth: 400,
    className: "cell-desc",
  },
];

const createNode = (text: string, level: number): TreeNode<string> => {
  if (level < 5) {
    return {
      data: text,
      children: [1, 2, 3, 4, 5].map((i) => createNode(`${text}-${i}`, level + 1)),
    };
  } else {
    return { data: text };
  }
};

const roots = [1, 2, 3, 4, 5].map((i) => createNode(i.toString(), 0));

export default defineComponent({
  name: "App",
  setup() {
    const state = ref({ widths: {} as Record<Cols, number> });
    const vtreeRef = ref<null | InstanceType<typeof VtreeTable>>(null);
    const cell: RenderCell<TreeNodeWithState<string>, Cols> = (param) => {
      switch (param.columnId) {
        case "index":
          return (param.index + 1).toString();
        case "name":
          return (
            <ExpandableCell nodeState={param.item} class="cell-name">
              {param.item.data}
            </ExpandableCell>
          );
        case "value":
          return `value:${param.item.data}`;
        case "description":
          return `desc:${param.item.data}`;
        default:
          return param.columnId;
      }
    };

    const expandAll = () => {
      vtreeRef.value?.expandAll();
    };
    const collapseAll = () => {
      vtreeRef.value?.collapseAll();
    };

    return () => (
      <div class={wrapperClass}>
        <div style={{ margin: "2px" }}>
          <button style={{ margin: "2px" }} onClick={expandAll}>
            Expand all
          </button>
          <button style={{ margin: "2px" }} onClick={collapseAll}>
            Collapse all
          </button>
        </div>
        <VtreeTable
          ref={vtreeRef}
          class={className}
          headerHeight={24}
          columns={columns}
          getItemKey={(s) => s}
          rootNodes={roots}
          rowHeight={24}
          renderCell={cell}
          state={state.value}
          hoveredSplitterClass="vtable-splitter-active"
          draggingSplitterClass="vtable-splitter-active"
          on={{
            rowclick: (params) => {
              alert("rowclick " + params.index);
            },
            "update:state": (value) => {
              state.value = value;
            },
          }}
        />
      </div>
    );
  },
});
