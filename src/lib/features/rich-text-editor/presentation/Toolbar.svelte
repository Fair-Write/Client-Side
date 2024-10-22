<script lang="ts">
  import {
    Heading1,
    Heading2,
    Heading3,
    Bold,
    Italic,
    LucideUnderline,
    Pilcrow,
    List,
    ListOrdered,
    Undo2,
    Redo2,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
  } from "lucide-svelte";
  import { cn } from "$lib/utils";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function toggleBold() {
    dispatch("toggleBold");
  }

  function toggleItalic() {
    dispatch("toggleItalic");
  }
</script>

<div
  class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
>
  <h2 class="text-xl font-semibold">Write</h2>
  <button class="button" on:click={toggleBold}>Bold</button>
  <button class="button" on:click={toggleItalic}>Italic</button>
  <button>Underline</button>
</div>
