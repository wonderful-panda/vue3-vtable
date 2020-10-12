import { computed, defineComponent, ref } from "vue";
import { css } from "emotion";
import VtreeTableExample from "./VtreeTableExample";
import VtreeTableExampleSrc from "./VtreeTableExample?source";

const containerStyle = css`
  display: flex;
  padding: 2px;
  border: 1px solid black;
  width: 90vw;
  height: 80vh;
  overflow: hidden;
`;

const innerStyle = css`
  flex-basis: 0%;
  flex-shrink: 0;
  flex-grow: 1;
  padding: 2px;
  display: flex;
  overflow: hidden;
`;

const samples = [
  {
    text: "Vtable example",
    source: "NOT READY",
    component: VtreeTableExample,
  },
  {
    text: "VtreeTable example",
    source: VtreeTableExampleSrc,
    component: VtreeTableExample,
  },
];

export default defineComponent({
  setup() {
    const selected = ref(0);
    const src = computed(() => samples[selected.value].source);

    return () => {
      const Component = samples[selected.value].component;
      return (
        <>
          <select v-model={selected.value}>
            {samples.map((s, i) => (
              <option key={i} value={i}>
                {s.text}
              </option>
            ))}
          </select>
          <div class={containerStyle}>
            <textarea class={innerStyle}>{src.value}</textarea>
            <div class={innerStyle}>
              <Component />
            </div>
          </div>
        </>
      );
    };
  },
});
