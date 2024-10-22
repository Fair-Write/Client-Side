<script lang="ts">
  import { onMount } from "svelte";
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { schema } from "prosemirror-schema-basic";
  import { keymap } from "prosemirror-keymap";
  import { toggleMark } from "prosemirror-commands";
  import Toolbar from "./Toolbar.svelte";

  let editorContainer: HTMLDivElement;
  let view: EditorView;

  onMount(() => {
    const state = EditorState.create({
      schema,
      plugins: [
        keymap({
          "Mod-b": toggleMark(schema.marks.bold), // Command to toggle bold
        }),
      ],
    });

    // Create the editor view
    view = new EditorView(editorContainer, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });

    return () => {
      view.destroy(); // Clean up the editor on component destroy
    };
  });
</script>

<section class="flex flex-1 flex-col items-center bg-stone-200">
  <!-- menubard -->
  <Toolbar
    on:toggleBold={handleToggleBold}
    on:toggleItalic={handleToggleItalic}
  />
  <div
    class="prose prose-lg w-[700px] flex-1 bg-border bg-stone-50"
    bind:this={editorContainer}
  ></div>
</section>
