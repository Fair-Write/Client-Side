<script lang="ts">
  import { onMount } from "svelte";
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { DOMParser } from "prosemirror-model";
  import { toggleMark } from "prosemirror-commands";
  import { Button } from "$lib/components/ui/button"; // Chadcn Svelte button
  import { schema } from "prosemirror-schema-basic"; // Import basic schema
  import { keymap } from "prosemirror-keymap";
  import { baseKeymap } from "prosemirror-commands";
  import { writable } from "svelte/store";

  let editorContainer: HTMLDivElement | null = null;
  let view: EditorView | undefined;

  // Toggle bold formatting
  const toggleBold = () => {
    const { state, dispatch } = view!;
    const markType = state.schema.marks.strong;
    if (markType) {
      toggleMark(markType)(state, dispatch);
    } else {
      console.error("Bold (strong) mark is undefined");
    }
  };

  // Toggle italic formatting
  const toggleItalic = () => {
    const { state, dispatch } = view!;
    const markType = state.schema.marks.em;
    if (markType) {
      toggleMark(markType)(state, dispatch);
    } else {
      console.error("Italic (em) mark is undefined");
    }
  };

  const content = writable("<p>Hello ProseMirror in Svelte!</p>");

  onMount(() => {
    const state = EditorState.create({
      schema,
      doc: DOMParser.fromSchema(schema).parse(
        document.createRange().createContextualFragment($content),
      ), // Empty document to start
      plugins: [keymap(baseKeymap)],
    });

    view = new EditorView(editorContainer, {
      state,
      dispatchTransaction(transaction) {
        const newState = view!.state.apply(transaction);
        view!.updateState(newState);
      },
    });

    return () => {
      view?.destroy();
    };
  });
</script>

<section class="flex flex-1 flex-col items-center bg-stone-200">
  <!-- Custom toolbar with Chadcn Svelte buttons -->
  <div
    class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
  >
    <h2 class="text-xl font-semibold">Write</h2>
    <Button on:click={toggleBold}>Bold</Button>
    <Button on:click={toggleItalic}>Italic</Button>
  </div>

  <!-- ProseMirror editor container -->
  <div
    bind:this={editorContainer}
    class="prose prose-lg w-[700px] flex-1 bg-border bg-stone-50"
    id="editor"
  ></div>
</section>

<style>
  #editor {
    padding: 30px;
    min-height: 200px;
  }
  /* Remove outline from the div when focused */
  #editor:focus {
    outline: none !important; /* Use !important if necessary */
  }
</style>
