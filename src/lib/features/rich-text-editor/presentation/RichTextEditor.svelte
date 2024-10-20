<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  let editor: Editor;
  let element: HTMLDivElement;

  let htmlContent = "";

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Write something …" }),
      ],
      onUpdate: ({ editor }) => {
        htmlContent = editor.getHTML();
      },
      editorProps: {
        attributes: {
          class: "focus:outline-none m-5",
        },
      },
      content: "test",
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<section class="flex flex-1 flex-col items-center bg-stone-200">
  {#if editor}
    <div
      class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
    >
      <h2 class="text-xl font-semibold">Write</h2>
      <span>
        <button
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
          class:active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </button>
        <button
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()}
          class:active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </button>
        <button
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()}
          class:active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </button>
        <button
          on:click={() => editor.chain().focus().setParagraph().run()}
          class:active={editor.isActive("paragraph")}
        >
          P
        </button>
      </span>

      <button>Export As</button>
    </div>
  {/if}

  <div
    class="prose prose-lg w-[700px] flex-1 bg-stone-50"
    bind:this={element}
  />
</section>

<style>
  button.active {
    background: black;
    color: white;
  }
</style>
