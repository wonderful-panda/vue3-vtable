import { defineComponent, CSSProperties, ref, computed, onMounted, onActivated } from "vue";
import { withDefault, required } from "./prop";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";

const rootStyle: CSSProperties = {
  visibility: "hidden",
};
const parentStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: "hidden",
  visibility: "hidden",
  zIndex: -1,
};
const expandChildStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  transition: "0s",
  width: "100000px",
  height: "100000px",
};
const shrinkChildStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  transition: "0s",
  width: "200%",
  height: "200%",
};

export const ResizeSensor = defineComponent({
  name: "ResizeSensor",
  props: {
    debounce: withDefault(0),
    throttle: withDefault(50),
    handleResized: required<() => void>(Function),
  },
  setup(props) {
    const expandRef = ref<null | HTMLDivElement>(null);
    const shrinkRef = ref<null | HTMLDivElement>(null);

    const reset = () => {
      const expand = expandRef.value;
      const shrink = shrinkRef.value;
      if (!expand || !shrink) {
        return;
      }
      expand.scrollLeft = 100000;
      expand.scrollTop = 100000;
      shrink.scrollLeft = 100000;
      shrink.scrollTop = 100000;
    };
    const onScroll = computed(() => {
      let func = () => {
        props.handleResized();
        reset();
      };
      if (props.throttle > 0) {
        func = throttle(func, props.throttle);
      }
      if (props.debounce > 0) {
        func = debounce(func, props.debounce);
      }
      return func;
    });
    onMounted(reset);
    onActivated(reset);

    return () => (
      <div class="resize-sensor" style={rootStyle}>
        <div ref={expandRef} style={parentStyle} onScroll={onScroll.value}>
          <div style={expandChildStyle} />
        </div>
        <div ref={shrinkRef} style={parentStyle} onScroll={onScroll.value}>
          <div style={shrinkChildStyle} />
        </div>
      </div>
    );
  },
});
