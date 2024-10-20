<script lang="ts">
  import { cn } from "$lib/utils";
  import { page } from "$app/stores";
  import SuggestionBot from "$lib/features/suggestion-bot/presentation/suggestionBot.svelte";

  function isActive(url: string) {
    return $page.url.pathname == url;
  }
</script>

<header
  class="flex items-end justify-between border-b border-solid border-stone-300 bg-stone-50 p-3 shadow-sm"
>
  <h1 class="text-2xl">Fair Write</h1>
  <div>icon things</div>
</header>
<div class="flex flex-1 bg-stone-100">
  <nav
    class="bordre-r flex w-64 flex-col justify-between gap-2 border-r border-solid border-stone-300"
  >
    <!-- wrapper -->
    <div class="flex flex-col gap-2 px-3">
      <!-- write and scan -->
      <span
        class="flex h-14 items-center justify-start border-b border-dashed border-stone-400"
      >
        <h3 class=" text-xl font-semibold text-stone-400">Features</h3>
      </span>

      <a
        href="/dashboard/write"
        class={cn(
          "rounded-lg border border-transparent p-2 text-xl ",
          " hover:bg-stone-200 ",
          $page.url.pathname == "/dashboard/write" &&
            "border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50",
        )}
      >
        Write
      </a>
      <a
        href="/dashboard/scan"
        class={cn(
          "rounded-lg border border-transparent  p-2 text-xl",
          " hover:bg-stone-200 ",
          $page.url.pathname == "/dashboard/scan" &&
            "border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50 ",
        )}>Scan</a
      >
    </div>

    <!-- info -->
    <a href="/dashboard/info" class="border-t border-stone-300 p-2 text-xl"
      >Info</a
    >
  </nav>
  <main class="flex flex-1 bg-stone-200">
    <slot></slot>
    <SuggestionBot></SuggestionBot>
  </main>
</div>
