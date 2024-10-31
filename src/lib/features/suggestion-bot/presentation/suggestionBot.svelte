<script lang="ts">

  import {textContent} from '$lib/stores/textFromEditorStore';
</script>

<section class=" w-80 border-l border-stone-300 bg-stone-100">
  <div
    class="flex h-14 w-full items-center justify-between border-b border-solid border-stone-300 bg-stone-50 p-5"
  >
    <h2 class="text-xl font-semibold">AI Companion</h2>
    <p>Settings</p>

  </div>

  <div> {$textContent}</div>
</section>
