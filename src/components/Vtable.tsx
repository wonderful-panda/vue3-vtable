/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RenderCell, VtableColumn } from "../type";
import { defineComponent, ref } from "vue";
import { optional, required, withDefault } from "./prop";
import { emits as baseEmits } from "./Vlist";
import { vtableBaseOf } from "./VtableBase";

function factory<T, Cols extends string>() {
  const emits = baseEmits<T>();
  return defineComponent({
    name: "Vtable",
    props: {
      rowHeight: required(Number),
      headerHeight: optional(Number),
      columns: required<readonly VtableColumn<Cols>[]>(Array),
      items: required<readonly T[]>(Array),
      rowStyleCycle: withDefault(1),
      splitterWidth: withDefault(3),
      getRowClass: optional<(item: T, index: number) => string>(Function),
      splitterClass: withDefault(String, "vtable-splitter"),
      draggingSplitterClass: withDefault(String, "vtable-dragging-splitter"),
      hoveredSplitterClass: optional(String),
      getItemKey: required<(item: T) => string | number>(Function),
      state: required<{ readonly widths: Record<Cols, number> }>(Object),
      overscan: withDefault(Number, 8),
      renderCell: required<RenderCell<T, Cols>>(Function),
    },
    emits: {
      "update:state": (value: { readonly widths: Record<Cols, number> }) => true,
      ...({} as typeof emits),
    },
    setup(props, { emit }) {
      const VtableBase = vtableBaseOf<T, Cols>();
      const VtableBaseVm = ref<null | InstanceType<typeof VtableBase>>(null);
      const sliceItems = (begin: number, end: number) => props.items.slice(begin, end);
      const ensureVisible = (index: number) => {
        VtableBaseVm.value?.ensureVisible(index);
      };
      const render_ = () => {
        const { items, ...rest } = props;
        return (
          <VtableBase
            ref={VtableBaseVm}
            {...rest}
            itemCount={items.length}
            sliceItems={sliceItems}
            on={{
              "update:state": (value) => emit("update:state", value),
            }}
          />
        );
      };
      return {
        ensureVisible,
        render_,
      };
    },
    render() {
      return this.render_();
    },
  });
}

export const Vtable = factory<unknown, string>();

export function vtableOf<T, Cols extends string>() {
  const w = () => factory<T, Cols>();
  return (Vtable as unknown) as ReturnType<typeof w>;
}
