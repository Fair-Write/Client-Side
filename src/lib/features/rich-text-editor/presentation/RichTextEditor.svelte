<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import type { TDocument, TElementTarget } from "../entities/document";
  import formatDocument from "../use-case/richTexEditor";
  import toggleGroupMap, {
    type TToggleMapFunctions,
  } from "../use-case/formatDocument";
  import RichTextEditorToggleGroup from "./RichTextEditorToggleGroup.svelte";

  export let content: TDocument = "hello world";
  let element: TElementTarget;
  let editor: Editor;
  let toggleGroup: TToggleMapFunctions;

  onMount(() => {
    editor = formatDocument(editor, content, element);
    toggleGroup = toggleGroupMap(editor);
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<RichTextEditorToggleGroup {editor} {toggleGroup}></RichTextEditorToggleGroup>

<div bind:this={element} />
