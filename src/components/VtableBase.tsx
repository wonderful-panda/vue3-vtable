/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { defineComponent, ref, computed, CSSProperties, watch, reactive } from "vue";
import { required, withDefault, optional } from "./prop";
import { VtableColumn, RenderCell } from "../type";
import { px } from "../util";
import { vlistOf, emits as baseEmits } from "./Vlist";
import { VtableSplitter } from "./VtableSplitter";
import { VtableRow } from "./VtableRow";
import throttle from "lodash.throttle";

export function emits<T, Cols extends string>() {
  const w = () => baseEmits<T>();
  return {
    "update:state": (_value: { readonly widths: Record<Cols, number> }) => true,
    ...({} as ReturnType<typeof w>),
  };
}

function factory<T, Cols extends string>() {
  const emits = baseEmits<T>();
  return defineComponent({
    name: "VtableBase",
    props: {
      rowHeight: required(Number),
      headerHeight: optional(Number),
      columns: required<readonly VtableColumn<Cols>[]>(Array),
      itemCount: required(Number),
      sliceItems: required<(begin: number, end: number) => readonly T[]>(Function),
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
      "update:state": (_value: { readonly widths: Record<Cols, number> }) => true,
      ...({} as typeof emits),
    },
    setup(props, { emit }) {
      const Vlist = vlistOf<T>();
      const headerHeight = computed(() => props.headerHeight || props.rowHeight);
      const draggingSplitter = ref(-1);
      const hoveredSplitter = ref(-1);
      const headerCellDivs = ref<HTMLDivElement[]>([]);
      const vlistVm = ref<null | InstanceType<typeof Vlist>>(null);
      const headerStyle = (vScrollbarWidth: number): CSSProperties => ({
        display: "flex",
        position: "relative",
        flex: "1 1 auto",
        width: "100%",
        height: px(headerHeight.value),
        lineHeight: px(headerHeight.value),
        boxSizing: "border-box",
        margin: "0",
        whiteSpace: "nowrap",
        paddingRight: px(vScrollbarWidth),
      });
      const headerCellStyle = (width: number): CSSProperties => ({
        minWidth: px(width),
        width: px(width),
        lineHeight: px(headerHeight.value),
        boxSizing: "border-box",
        margin: "0",
        overflow: "hidden",
      });
      const splitterClass = computed(() => props.splitterClass);
      const draggingSplitterClass = computed(() => props.draggingSplitterClass);
      const hoveredSplitterClass = computed(
        () => props.hoveredSplitterClass || props.splitterClass
      );
      const splitterClasses = reactive<string[]>([]);

      const updateSplitterClass = (index: number) => {
        if (index < 0) {
          return;
        }
        const newValue =
          index === draggingSplitter.value
            ? draggingSplitterClass.value
            : index === hoveredSplitter.value
            ? hoveredSplitterClass.value
            : splitterClass.value;
        if (splitterClasses[index] !== newValue) {
          splitterClasses[index] = newValue;
        }
      };

      const updateSplitterClasses = () => {
        if (splitterClasses.length !== props.columns.length) {
          splitterClasses.length = props.columns.length;
        }
        for (let i = 0; i < splitterClasses.length; ++i) {
          updateSplitterClass(i);
        }
      };

      watch(() => props.columns.length, updateSplitterClasses);
      watch(() => props.splitterClass, updateSplitterClasses);
      watch(() => props.draggingSplitterClass, updateSplitterClasses);
      watch(() => props.hoveredSplitterClass, updateSplitterClasses);
      watch(
        () => hoveredSplitter.value,
        (value, oldValue) => {
          updateSplitterClass(oldValue);
          updateSplitterClass(value);
        }
      );
      watch(
        () => draggingSplitter.value,
        (value, oldValue) => {
          updateSplitterClass(oldValue);
          updateSplitterClass(value);
        }
      );
      updateSplitterClasses();

      const contentWidth = computed(() =>
        props.columns
          .map((c) => (props.state.widths[c.id] || c.defaultWidth) + props.splitterWidth)
          .reduce((sum, c) => sum + c, 0)
      );
      const updateState = (c: VtableColumn<Cols>, width: number) => {
        const widths = { ...props.state.widths, [c.id]: width };
        emit("update:state", { widths });
      };
      const ensureVisible = (index: number) => {
        vlistVm.value?.ensureVisible(index);
      };
      const onSplitterPointerdown = (index: number, e_: PointerEvent) => {
        if (headerCellDivs.value.length === 0) {
          return;
        }
        const target = e_.target as HTMLElement;
        if (!target) {
          return;
        }
        const headerCell = headerCellDivs.value[index];
        const column = props.columns[index];
        const startWidth = headerCell.clientWidth;
        const startX = e_.pageX;
        const minWidth = column.minWidth || 5;
        target.setPointerCapture(e_.pointerId);
        const onPointermove = throttle((e: PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const offset = e.pageX - startX;
          const width = Math.max(startWidth + offset, minWidth);
          updateState(column, width);
        }, 50);
        const onPointerup = (e: PointerEvent) => {
          target.releasePointerCapture(e.pointerId);
          target.removeEventListener("pointerup", onPointerup);
          target.removeEventListener("pointermove", onPointermove);
          draggingSplitter.value = -1;
        };
        target.addEventListener("pointermove", onPointermove);
        target.addEventListener("pointerup", onPointerup);
        draggingSplitter.value = index;
      };
      const onHoveredSplitterChanged = (index: number) => {
        hoveredSplitter.value = index;
      };
      const splitter = (index: number) => (
        <VtableSplitter
          key={`sp-${index}`}
          class={splitterClasses[index]}
          index={index}
          width={props.splitterWidth}
          handlePointerdown={onSplitterPointerdown}
          handleHoveredIndexChanged={onHoveredSplitterChanged}
        />
      );
      const header = (vScrollbarWidth: number) => (
        <div class="vtable-header" style={headerStyle(vScrollbarWidth)}>
          {props.columns.map((c, index) => [
            <div
              key={`cell-${c.id}`}
              ref={(el) => {
                headerCellDivs.value[index] = el as HTMLDivElement;
              }}
              class={["vtable-header-cell", c.className]}
              style={headerCellStyle(props.state.widths[c.id] || c.defaultWidth)}
            >
              {
                // Don't use `c.title || c.id` because "" is a valid title
                c.title === undefined ? c.id : c.title
              }
            </div>,
            splitter(index),
          ])}
        </div>
      );
      const row = (param: { item: T; index: number }) => (
        <VtableRow
          columns={props.columns}
          columnWidths={props.state.widths}
          item={param.item}
          index={param.index}
          height={props.rowHeight}
          renderSplitter={splitter}
          renderCell={props.renderCell as RenderCell<unknown>}
        />
      );

      const render_ = () => (
        <Vlist
          ref={vlistVm}
          style={{ flex: "1 1 auto" }}
          getItemKey={props.getItemKey}
          itemCount={props.itemCount}
          sliceItems={props.sliceItems}
          rowHeight={props.rowHeight}
          overscan={props.overscan}
          rowStyleCycle={props.rowStyleCycle}
          contentWidth={px(contentWidth.value)}
          renderHeader={header}
          renderRow={row}
        />
      );

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

export const VtableBase = factory<unknown, string>();

export function vtableBaseOf<T, Cols extends string = string>() {
  const w = () => factory<T, Cols>();
  return (VtableBase as unknown) as ReturnType<typeof w>;
}
