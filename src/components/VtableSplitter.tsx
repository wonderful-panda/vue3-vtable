import { FunctionalComponent, CSSProperties } from "vue";
import { px } from "../util";

const style = (width: number): CSSProperties => ({
  minWidth: px(width),
  maxWidth: px(width),
  height: "100%",
  boxSizing: "border-box",
  cursor: "col-resize",
});

export const VtableSplitter: FunctionalComponent<{
  index: number;
  width: number;
  handlePointerdown: (index: number, e: PointerEvent) => void;
  handleHoveredIndexChanged: (index: number) => void;
}> = ({ index, width, handlePointerdown, handleHoveredIndexChanged }, ctx) => {
  return (
    <div
      style={style(width)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onPointerdown={(e) => {
        handlePointerdown(index, e);
      }}
      onMouseenter={() => handleHoveredIndexChanged(index)}
      onMouseleave={() => handleHoveredIndexChanged(-1)}
    />
  );
};
