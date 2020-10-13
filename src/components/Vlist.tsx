/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  defineComponent,
  reactive,
  CSSProperties,
  ref,
  computed,
  onActivated,
  onMounted,
} from "vue";
import { required, withDefault, optional } from "./prop";
import { px, useAnimationFrame } from "../util";
import { ResizeSensor } from "./ResizeSensor";
import { RowEventType } from "../type";

type ScrollDirection = "forward" | "backward";

const containerStyle: CSSProperties = {
  display: "flex",
  flexFlow: "column nowrap",
  overflow: "hidden",
};

const scrollableStyle: CSSProperties = {
  overflow: "auto",
  position: "relative",
  flex: "1 1 0px",
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  border: 0,
};

export function emits<T = unknown>() {
  return {
    scroll: (_payload: { scrollLeft: number; scrollTop: number }) => true,
    rowclick: (_payload: RowEventType<T, MouseEvent>) => true,
    rowdblclick: (_payload: RowEventType<T, MouseEvent>) => true,
    rowcontextmenu: (_payload: RowEventType<T, MouseEvent>) => true,
    rowdragenter: (_payload: RowEventType<T, DragEvent>) => true,
    rowdragleave: (_payload: RowEventType<T, DragEvent>) => true,
    rowdragstart: (_payload: RowEventType<T, DragEvent>) => true,
    rowdragend: (_payload: RowEventType<T, DragEvent>) => true,
    rowdragover: (_payload: RowEventType<T, DragEvent>) => true,
    rowdrop: (_payload: RowEventType<T, DragEvent>) => true,
  } as const;
}

export type EventNames = keyof ReturnType<typeof emits>;
export const eventNames = Object.keys(emits()) as readonly EventNames[];

function factory<T>() {
  return defineComponent({
    name: "Vlist",
    props: {
      getItemKey: required<(item: T) => string | number>(Function),
      contentWidth: required(String),
      rowStyleCycle: withDefault(Number, 1),
      rowHeight: required(Number),
      itemCount: required(Number),
      sliceItems: required<(begin: number, end: number) => readonly T[]>(Function),
      overscan: withDefault(Number, 8),
      renderHeader: optional<(vScrollbarWidth: number) => JSX.Element>(Function),
      renderRow: required<(payload: { item: T; index: number }) => JSX.Element>(Function),
    },
    emits: emits<T>(),
    setup(props, { emit }) {
      const data = reactive({
        scrollLeft: 0,
        scrollTop: 0,
        scrollDirection: "forward" as ScrollDirection,
        bodyWidth: 0,
        bodyHeight: 0,
        vScrollbarWidth: 0,
      });

      const firstIndex = computed(() => {
        let value = Math.floor(data.scrollTop / props.rowHeight);
        if (data.scrollDirection === "backward") {
          value = Math.max(0, value - props.overscan);
        }
        if (props.rowStyleCycle > 1) {
          value -= value % props.rowStyleCycle;
        }
        return value;
      });

      const lastIndex = computed(() => {
        const { scrollTop, bodyHeight, scrollDirection } = data;
        let value = Math.ceil((scrollTop + bodyHeight) / props.rowHeight);
        if (scrollDirection === "forward") {
          value += props.overscan || 8;
        }
        return value;
      });

      const headerStyle = computed<CSSProperties>(() => ({
        display: "flex",
        flex: "0 0 auto",
        boxSizing: "border-box",
        minWidth: props.contentWidth,
        position: "relative",
        left: px(data.scrollLeft * -1),
        overflow: "hidden",
      }));

      const contentStyle = computed<CSSProperties>(() => ({
        display: "flex",
        flexFlow: "column nowrap",
        flex: "1 1 auto",
        position: "relative",
        boxSizing: "border-box",
        height: px(props.itemCount * props.rowHeight),
        overflow: "hidden",
        minWidth: props.contentWidth,
      }));

      const rowStyle = computed<CSSProperties>(() => ({
        display: "flex",
        width: "100%",
        height: px(props.rowHeight),
      }));

      const spacerStyle = computed<CSSProperties>(() => ({
        height: px(props.rowHeight * firstIndex.value),
        flex: "0 0 auto",
      }));

      const scrollableDiv = ref<null | HTMLDivElement>(null);
      const contentDiv = ref<null | HTMLDivElement>(null);
      const updateBodySize_ = () => {
        const sc = scrollableDiv.value;
        if (!sc) {
          return;
        }
        const bodyWidth = sc.clientWidth;
        const bodyHeight = sc.clientHeight;
        const vScrollBarWidth = sc.offsetWidth - sc.clientWidth - sc.clientLeft;
        if (
          data.bodyWidth !== bodyWidth ||
          data.bodyHeight !== bodyHeight ||
          data.vScrollbarWidth !== vScrollBarWidth
        ) {
          data.bodyWidth = bodyWidth;
          data.bodyHeight = bodyHeight;
          data.vScrollbarWidth = vScrollBarWidth;
        }
      };
      const updateBodySize = useAnimationFrame(updateBodySize_);

      const ensureVisible = (index: number) => {
        const sc = scrollableDiv.value;
        if (!sc) {
          return;
        }
        const { rowHeight } = props;
        const { bodyHeight } = data;
        let { scrollTop } = data;
        const scrollTopMax = rowHeight * index;
        const scrollTopMin = Math.max(rowHeight * index - bodyHeight + rowHeight, 0);
        if (scrollTopMax < scrollTop) {
          scrollTop = scrollTopMax;
        } else if (scrollTop < scrollTopMin) {
          scrollTop = scrollTopMin;
        } else {
          return;
        }
        sc.scrollTop = scrollTop;
      };

      const reset = () => {
        updateBodySize_();
        if (!scrollableDiv.value) {
          return;
        }
        const { scrollLeft, scrollTop } = scrollableDiv.value;
        data.scrollLeft = scrollLeft;
        data.scrollTop = scrollTop;
      };
      onMounted(reset);
      onActivated(reset);

      const onScroll_ = () => {
        if (!scrollableDiv.value) {
          return;
        }
        const { scrollLeft, scrollTop } = scrollableDiv.value;
        data.scrollLeft = scrollLeft;
        data.scrollTop = scrollTop;
        emit("scroll", { scrollLeft, scrollTop });
      };

      const onScroll = useAnimationFrame(onScroll_);

      const rows = computed(() => {
        const { renderRow, sliceItems, getItemKey } = props;
        const findex = firstIndex.value;
        const items = sliceItems(findex, lastIndex.value);
        return items
          .map((item, index) => ({ item, index: index + findex }))
          .map(({ item, index }) => (
            <div
              class="vlist-row"
              key={getItemKey(item)}
              style={rowStyle.value}
              onClick={(event) => emit("rowclick", { item, index, event })}
              onDblclick={(event) => emit("rowdblclick", { item, index, event })}
              onContextmenu={(event) => emit("rowcontextmenu", { item, index, event })}
              onDragenter={(event) => emit("rowdragenter", { item, index, event })}
              onDragleave={(event) => emit("rowdragleave", { item, index, event })}
              onDragstart={(event) => emit("rowdragstart", { item, index, event })}
              onDragend={(event) => emit("rowdragend", { item, index, event })}
              onDragover={(event) => emit("rowdragover", { item, index, event })}
              onDrop={(event) => emit("rowdrop", { item, index, event })}
            >
              {renderRow({ item, index })}
            </div>
          ));
      });

      const render_ = () => (
        <div class="vlist-container" style={containerStyle}>
          {props.renderHeader && (
            <div class="vlist-header-row" style={headerStyle.value}>
              {props.renderHeader(data.vScrollbarWidth)}
            </div>
          )}
          <div
            class="vlist-scrollable"
            ref={scrollableDiv}
            style={scrollableStyle}
            onScroll={onScroll}
          >
            <ResizeSensor handleResized={updateBodySize} />
            <div class="vlist-content" ref={contentDiv} style={contentStyle.value}>
              <ResizeSensor handleResized={updateBodySize} />
              <div class="vlist-spacer" style={spacerStyle.value} />
              {rows.value}
            </div>
          </div>
        </div>
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

export const Vlist = factory<unknown>();

export function vlistOf<T>() {
  const w = () => factory<T>();
  return Vlist as ReturnType<typeof w>;
}
