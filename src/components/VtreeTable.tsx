/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RenderCell, TreeNode, TreeNodeWithState, VtableColumn } from "../type";
import { px } from "../util";
import {
  CSSProperties,
  defineComponent,
  FunctionalComponent,
  inject,
  InjectionKey,
  computed,
  reactive,
  provide,
  ComputedRef,
} from "vue";
import { optional, required, withDefault } from "./prop";
import { emits as baseEmits } from "./Vlist";
import { vtableBaseOf } from "./VtableBase";

const ExpandButton: FunctionalComponent<{
  expanded: boolean;
  size: number;
}> = ({ expanded, size }) => {
  const transform = `rotate(${expanded ? 90 : 0}deg)`;
  const transition = "0.1s transform ease";
  const style = { transform, transition };
  return (
    <svg class="vtreetable-button" width={size} height={size} style={style}>
      <polygon transform={`translate(${size / 2}, ${size / 2})`} points="-1,-4 3,0 -1,4" />
    </svg>
  );
};

const displayFlex: CSSProperties = { display: "flex" };

type Context = {
  readonly toggleExpand: (data: unknown) => void;
  readonly indentWidth: ComputedRef<number>;
};
const injectionKey: InjectionKey<Context> = Symbol();

export const ExpandableCell = defineComponent({
  name: "ExpandableCell",
  props: {
    nodeState: required<TreeNodeWithState<unknown>>(Object),
  },
  setup(props, { slots }) {
    const injection = inject(injectionKey);
    const onExpandButtonClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      injection?.toggleExpand(props.nodeState.data);
    };
    const expandButtonStyle = computed<CSSProperties>(() => ({
      marginLeft: px(props.nodeState.level * (injection?.indentWidth.value || 12)),
      marginRight: "4px",
      marginTop: "auto",
      marginBottom: "auto",
      textAlign: "center",
      minWidth: "12px",
      cursor: "pointer",
    }));
    return () => (
      <div style={displayFlex}>
        <div style={expandButtonStyle.value} onClick={onExpandButtonClick}>
          {props.nodeState.children && (
            <ExpandButton expanded={props.nodeState.expanded} size={12} />
          )}
        </div>
        {slots.default && slots.default()}
      </div>
    );
  },
});

function factory<T, Cols extends string>() {
  const emits = baseEmits<TreeNodeWithState<T>>();
  const VtableBase = vtableBaseOf<TreeNodeWithState<T>, Cols>();
  return defineComponent({
    name: "VtreeTable",
    props: {
      rowHeight: required(Number),
      headerHeight: optional(Number),
      indentWidth: withDefault(Number, 12),
      columns: required<readonly VtableColumn<Cols>[]>(Array),
      rootNodes: required<readonly TreeNode<T>[]>(Array),
      rowStyleCycle: withDefault(Number, 1),
      splitterWidth: withDefault(Number, 3),
      splitterClass: withDefault(String, "vtable-splitter"),
      draggingSplitterClass: withDefault(String, "vtable-dragging-splitter"),
      hoveredSplitterClass: optional(String),
      getItemKey: required<(item: T) => string | number>(Function),
      getRowClass: optional<(item: TreeNodeWithState<T>, index: number) => string>(Function),
      state: required<{ readonly widths: Record<Cols, number> }>(Object),
      overscan: withDefault(Number, 8),
      renderCell: required<RenderCell<TreeNodeWithState<T>, Cols>>(Function),
    },
    emits: {
      "update:state": (value: { readonly widths: Record<Cols, number> }) => true,
      ...({} as typeof emits),
    },
    setup(props, { emit }) {
      const indentWidth = computed(() => props.indentWidth);
      const data = reactive({ expandedKeys: {} as Record<string, true> });

      const addDescendingVisibleItems = (
        node: TreeNode<T>,
        level: number,
        arr: TreeNodeWithState<T>[]
      ) => {
        const key = props.getItemKey(node.data).toString();
        const expanded = key in data.expandedKeys;
        arr.push({ ...node, expanded, level });
        if (node.children && expanded) {
          for (const child of node.children) {
            addDescendingVisibleItems(child, level + 1, arr);
          }
        }
      };
      const flattenVisibleItems = computed(() => {
        const ret: TreeNodeWithState<T>[] = [];
        for (const root of props.rootNodes) {
          addDescendingVisibleItems(root, 0, ret);
        }
        return ret;
      });
      const sliceItems = (begin: number, end: number) => {
        return flattenVisibleItems.value.slice(begin, end);
      };

      const getItemKeyInternal = (item: TreeNodeWithState<T>) => props.getItemKey(item.data);
      const toggleExpand = (nodeData: T) => {
        const key = props.getItemKey(nodeData).toString();
        const newValue = !(key in data.expandedKeys);
        if (newValue) {
          data.expandedKeys[key] = true;
        } else {
          delete data.expandedKeys[key];
        }
      };

      const expandAllDescendent = (from: TreeNode<T>) => {
        const key = props.getItemKey(from.data).toString();
        data.expandedKeys[key] = true;
        if (from.children) {
          for (const child of from.children) {
            expandAllDescendent(child);
          }
        }
      };
      const expandAll = () => {
        for (const root of props.rootNodes) {
          expandAllDescendent(root);
        }
      };

      const collapseAllDescendent = (from: TreeNode<T>) => {
        const key = props.getItemKey(from.data).toString();
        delete data.expandedKeys[key];
        if (from.children) {
          for (const child of from.children) {
            collapseAllDescendent(child);
          }
        }
      };
      const collapseAll = () => {
        data.expandedKeys = {};
      };

      const on = {
        "update:state": (value: typeof props["state"]) => {
          emit("update:state", value);
        },
        rowclick: () => console.log("rowclick"),
      };

      const render_ = () => {
        const { rootNodes, getItemKey, indentWidth, ...rest } = props;
        return (
          <VtableBase
            itemCount={flattenVisibleItems.value.length}
            sliceItems={sliceItems}
            getItemKey={getItemKeyInternal}
            on={on}
            {...rest}
          />
        );
      };

      provide(injectionKey, {
        toggleExpand,
        indentWidth,
      });

      return {
        toggleExpand,
        expandAll,
        collapseAll,
        render_,
      };
    },
    render() {
      return this.render_();
    },
  });
}

export const VtreeTable = factory<unknown, string>();

export function vtreeTableOf<T, Cols extends string>() {
  const w = () => factory<T, Cols>();
  return (VtreeTable as unknown) as ReturnType<typeof w>;
}
