import { Plugin, PluginKey } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";

export const menuPluginKey = new PluginKey("menuPlugin");

export function createMenuPlugin(markType: MarkType) {
  return new Plugin({
    key: menuPluginKey,

    props: {
      // Add a button in the toolbar to toggle bold
      handleDOMEvents: {
        click: (view) => {
          const { state, dispatch } = view;
          const { from, to } = state.selection;

          // Toggle the bold mark
          if (toggleMark(markType)(state, dispatch)) {
            return true;
          }
          return false;
        },
      },
    },
  });
}
