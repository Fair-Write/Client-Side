<script lang="ts">
  import { Editor } from "@tiptap/core";

  import type { TToggleMapFunctions } from "../use-case/formatDocument";

  export let editor: Editor;
  export let toggleGroup: TToggleMapFunctions;
</script>

<!-- toggle group if the editor exist then this will render -->
{#if editor}
  <div>
    {#each Array.from(toggleGroup) as [key, value]}
      <button on:click={() => value.chain()} class:active={value.style()}>
        {key}
      </button>
    {/each}
  </div>
{/if}

<style>
  button.active {
    background: black;
    color: white;
  }
</style>
