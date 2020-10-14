(self.webpackChunkvue3_vtable=self.webpackChunkvue3_vtable||[]).push([[349],{349:(n,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>l});const l='import { defineComponent, ref } from "vue";\nimport { VtableColumn, RenderCell, vtableOf } from "vue3-vtable";\nimport { css } from "emotion";\n\ntype Item = { id: string; value: string };\ntype Cols = "name" | "value" | "description";\nconst Vtable = vtableOf<Item, Cols>();\n\nconst wrapperClass = css`\n  flex: 1;\n  display: flex;\n  flex-flow: column nowrap;\n  overflow: hidden;\n`;\n\nconst className = css`\n  border: 1px solid #bbb;\n  flex: 1;\n  .vtable-header {\n    border-bottom: 1px solid #bbb;\n  }\n  .vtable-splitter {\n    border-right: 1px solid #bbb;\n  }\n  .vtable-splitter-active {\n    background-color: #bbb;\n  }\n  .vtable-cell,\n  .vtable-header-cell {\n    padding: 0 2px;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n  .vlist-row:hover {\n    background-color: #eee;\n  }\n  .cell-desc {\n    flex: 1;\n  }\n`;\n\nconst columns: VtableColumn<Cols>[] = [\n  {\n    id: "name",\n    minWidth: 80,\n    defaultWidth: 120,\n  },\n  {\n    id: "value",\n    minWidth: 80,\n    defaultWidth: 120,\n    className: "cell-value",\n  },\n  {\n    id: "description",\n    minWidth: 100,\n    defaultWidth: 240,\n    className: "cell-desc",\n  },\n];\n\n/* Create items */\nconst items = [] as Item[];\nfor (let i = 1; i < 10001; ++i) {\n  items.push({ id: i.toString(), value: `value: ${i}` });\n}\n\nexport default defineComponent({\n  name: "App",\n  setup() {\n    const state = ref({ widths: {} as Record<Cols, number> });\n    const cell: RenderCell<Item, Cols> = (p) => {\n      const { id, value } = p.item;\n      switch (p.columnId) {\n        case "name":\n          return id;\n        case "value":\n          return value;\n        case "description":\n          return `desc: ${id}`;\n        default:\n          return p.columnId;\n      }\n    };\n\n    return () => (\n      <div class={wrapperClass}>\n        <Vtable\n          class={className}\n          columns={columns}\n          getItemKey={(s) => s.id}\n          items={items}\n          rowHeight={24}\n          renderCell={cell}\n          state={state.value}\n          hoveredSplitterClass="vtable-splitter-active"\n          draggingSplitterClass="vtable-splitter-active"\n          on={{\n            "update:state": (value) => {\n              state.value = value;\n            },\n          }}\n        />\n      </div>\n    );\n  },\n});\n'}}]);
//# sourceMappingURL=349.js.map