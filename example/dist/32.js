(self.webpackChunkvue3_vtable=self.webpackChunkvue3_vtable||[]).push([[32],{32:(e,n,l)=>{"use strict";l.r(n),l.d(n,{default:()=>t});const t='import { defineComponent, ref } from "vue";\nimport {\n  VtableColumn,\n  RenderCell,\n  TreeNode,\n  TreeNodeWithState,\n  vtreeTableOf,\n  ExpandableCell,\n} from "vue3-vtable";\nimport { css } from "emotion";\n\ntype Item = { id: string; value: string };\ntype Cols = "name" | "value" | "description";\nconst VtreeTable = vtreeTableOf<Item, Cols>();\n\nconst wrapperClass = css`\n  flex: 1;\n  display: flex;\n  flex-flow: column nowrap;\n  overflow: hidden;\n`;\n\nconst className = css`\n  border: 1px solid #bbb;\n  flex: 1;\n  .vtable-header {\n    border-bottom: 1px solid #bbb;\n  }\n  .vtable-splitter {\n    border-right: 1px solid #bbb;\n  }\n  .vtable-splitter-active {\n    background-color: #bbb;\n  }\n  .vtable-cell,\n  .vtable-header-cell {\n    padding: 0 2px;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n  .vlist-row:hover {\n    background-color: #eee;\n  }\n  .cell-desc {\n    flex: 1;\n  }\n`;\n\nconst columns: VtableColumn<Cols>[] = [\n  {\n    id: "name",\n    minWidth: 80,\n    defaultWidth: 120,\n  },\n  {\n    id: "value",\n    minWidth: 80,\n    defaultWidth: 120,\n    className: "cell-value",\n  },\n  {\n    id: "description",\n    minWidth: 100,\n    defaultWidth: 240,\n    className: "cell-desc",\n  },\n];\n\n/* Create root nodes */\nconst ABCDE = [..."ABCDE"];\nconst createNode = (id: string, level: number): TreeNode<Item> => {\n  if (level < 5) {\n    return {\n      data: { id, value: `value: ${id}` },\n      children: ABCDE.map((i) => createNode(`${id}${i}`, level + 1)),\n    };\n  } else {\n    return { data: { id, value: `value: ${id}` } };\n  }\n};\n\nconst roots = ABCDE.map((c) => createNode(c, 0));\n\nexport default defineComponent({\n  name: "App",\n  setup() {\n    const state = ref({ widths: {} as Record<Cols, number> });\n    const vm = ref<null | InstanceType<typeof VtreeTable>>(null);\n    const cell: RenderCell<TreeNodeWithState<Item>, Cols> = (p) => {\n      const { id, value } = p.item.data;\n      switch (p.columnId) {\n        case "name":\n          return (\n            <ExpandableCell nodeState={p.item} class="cell-name">\n              {id}\n            </ExpandableCell>\n          );\n        case "value":\n          return value;\n        case "description":\n          return `desc: ${id}`;\n        default:\n          return p.columnId;\n      }\n    };\n\n    return () => (\n      <div class={wrapperClass}>\n        <div style={{ margin: "2px" }}>\n          <button style={{ margin: "2px" }} onClick={() => vm.value?.expandAll()}>\n            Expand all\n          </button>\n          <button style={{ margin: "2px" }} onClick={() => vm.value?.collapseAll()}>\n            Collapse all\n          </button>\n        </div>\n        <VtreeTable\n          ref={vm}\n          class={className}\n          columns={columns}\n          getItemKey={(s) => s.id}\n          rootNodes={roots}\n          rowHeight={24}\n          renderCell={cell}\n          state={state.value}\n          hoveredSplitterClass="vtable-splitter-active"\n          draggingSplitterClass="vtable-splitter-active"\n          on={{\n            "update:state": (value) => {\n              state.value = value;\n            },\n          }}\n        />\n      </div>\n    );\n  },\n});\n'}}]);
//# sourceMappingURL=32.js.map