import { defineComponent, ref } from "vue";
import { VtableColumn, RenderCell, vtableOf } from "vue3-vtable";
import { css } from "emotion";

type Item = { id: string; value: string };
type Cols = "name" | "value" | "description";
const Vtable = vtableOf<Item, Cols>();

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

/* Create items */
const items = [] as Item[];
for (let i = 1; i < 10001; ++i) {
  items.push({ id: i.toString(), value: `value: ${i}` });
}

export default defineComponent({
  name: "App",
  setup() {
    const state = ref({ widths: {} as Record<Cols, number> });
    const cell: RenderCell<Item, Cols> = (p) => {
      const { id, value } = p.item;
      switch (p.columnId) {
        case "name":
          return id;
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
        <Vtable
          class={className}
          columns={columns}
          getItemKey={(s) => s.id}
          items={items}
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
