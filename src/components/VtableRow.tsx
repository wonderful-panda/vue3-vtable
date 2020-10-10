import { defineComponent, computed, CSSProperties } from "vue";
import { required } from "./prop";
import { VtableColumn, RenderCell } from "../type";
import { px } from "../util";

export const VtableRow = defineComponent({
  name: "VtableRow",
  props: {
    item: required<unknown>(),
    columns: required<readonly VtableColumn<string>[]>(Array),
    columnWidths: required<Record<string, number>>(),
    index: required(Number),
    height: required(Number),
    renderCell: required<RenderCell<unknown>>(Function),
    renderSplitter: required<(index: number) => JSX.Element | string>(Function),
  },
  setup(props) {
    const rowStyle = computed<CSSProperties>(() => ({
      display: "flex",
      flex: "1 1 auto",
      width: "100%",
      height: px(props.height),
      lineHeight: px(props.height),
      boxSizing: "border-box",
      margin: 0,
    }));
    const cellStyle = (width: number): CSSProperties => ({
      minWidth: px(width),
      width: px(width),
      lineHeight: px(props.height),
      margin: 0,
      boxSizing: "border-box",
      overflow: "hidden",
    });
    return () => {
      const { columns, item, index, columnWidths, renderCell, renderSplitter } = props;
      return (
        <div style={rowStyle.value}>
          {columns.map((c, columnIndex) => (
            <>
              <div
                key={`cell-${c.id}`}
                class={["vtable-cell", c.className]}
                style={cellStyle(columnWidths[c.id] || c.defaultWidth)}
              >
                {renderCell({ index, item, columnId: c.id })}
              </div>
              {renderSplitter(columnIndex)}
            </>
          ))}
        </div>
      );
    };
  },
});
