import CodeMirror, { Editor } from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { defineAsyncComponent, defineComponent, onMounted, ref, watch } from "vue";
import { css } from "emotion";

const containerStyle = css`
  display: flex;
  padding: 10px;
  width: 90vw;
  height: 90vh;
  overflow: hidden;
`;

const sourceStyle = css`
  flex-basis: 45%;
  flex-shrink: 0;
  flex-grow: 1;
  padding-right: 10px;
  display: flex;
  overflow: hidden;
  border: 1px solid gray;
  .CodeMirror {
    width: 100%;
    height: 100%;
  }
`;

const componentStyle = css`
  flex-basis: 45%;
  flex-shrink: 0;
  flex-grow: 1;
  padding-left: 10px;
  display: flex;
  overflow: hidden;
`;

const samples = [
  {
    text: "Vtable example",
    source: import("!!raw-loader!./VtableExample"),
    component: defineAsyncComponent(() => import("./VtableExample")),
  },
  {
    text: "VtreeTable example",
    source: import("!!raw-loader!./VtreeTableExample"),
    component: defineAsyncComponent(() => import("./VtreeTableExample")),
  },
];

export default defineComponent({
  setup() {
    const selected = ref(0);
    let editor: Editor | null = null;
    const src = ref("");

    const updateSource = async () => {
      src.value = (await samples[selected.value].source).default;
      if (editor) {
        editor.setValue(src.value);
      }
    };

    watch(selected, updateSource);
    // const src = computed(() => samples[selected.value].source);
    const textarea = ref<null | HTMLTextAreaElement>(null);

    onMounted(() => {
      const el = textarea.value;
      if (!el) {
        return;
      }
      editor = CodeMirror.fromTextArea(el, {
        readOnly: true,
        lineNumbers: true,
        theme: "neat",
        mode: "javascript",
      });
      updateSource();
    });

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
            <div class={sourceStyle}>
              <textarea ref={textarea} />
            </div>
            <div class={componentStyle}>
              <Component />
            </div>
          </div>
        </>
      );
    };
  },
});
