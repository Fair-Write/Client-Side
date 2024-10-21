<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // tiptap extentions
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import Underline from "@tiptap/extension-underline";
  import TextAlign from "@tiptap/extension-text-align";
  // shadcn
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  // icons
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

  let editor: Editor;
  let element: HTMLDivElement;

  let htmlContent = "";
  let toggleValue = "";

  function watchToggleValue(toggle: string) {
    switch (toggle) {
      case "H1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "H2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "H3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "p":
        editor.chain().focus().setParagraph().run();
        break;
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "strikethrough":
        editor.chain().focus().toggleStrike().run();
        break;
      case "order":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "bullet":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "left":
        editor.chain().focus().setTextAlign("left").run();
        break;
      case "center":
        editor.chain().focus().setTextAlign("center").run();
        break;
      case "right":
        editor.chain().focus().setTextAlign("right").run();
        break;
      case "justify":
        editor.chain().focus().setTextAlign("justify").run();
        break;
    }
  }

  $: watchToggleValue(toggleValue);

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Write something …" }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
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

      <!-- toggle group fo buttons -->

      <ToggleGroup.Root
        bind:value={toggleValue}
        variant="outline"
        size="sm"
        type="single"
      >
        <!-- headings -->

        <div class="mx-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="H1"
                class={cn(
                  editor.isActive("heading", { level: 1 }) && "bg-secondary",
                )}
                aria-label="Toggle Heading 1"
              >
                <Heading1 class="h-4 w-4" /></ToggleGroup.Item
              >
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Heading 1</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="H2"
                class={cn(
                  editor.isActive("heading", { level: 2 }) && "bg-secondary",
                )}
                aria-label="Toggle Heading 2"
              >
                <Heading2 class="h-4 w-4" /></ToggleGroup.Item
              ></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Heading 2</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="H3"
                class={cn(
                  editor.isActive("heading", { level: 3 }) && "bg-secondary",
                )}
                aria-label="Toggle Heading 3"
              >
                <Heading3 class="h-4 w-4" /></ToggleGroup.Item
              >
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Heading 3</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                class={cn(editor.isActive("paragraph") && "bg-secondary")}
                value="paragraph"
                aria-label="Toggle paragraph"
              >
                <Pilcrow class="h-4 w-4" /></ToggleGroup.Item
              ></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Paragraph</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>

        <!-- stylization  -->
        <div class="mx-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="bold"
                class={cn(editor.isActive("bold") && "bg-secondary")}
                aria-label="Toggle bold"
              >
                <Bold class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Bold</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="italic"
                class={cn(editor.isActive("italic") && "bg-secondary")}
                aria-label="Toggle italic"
              >
                <Italic class="h-4 w-4" />
              </ToggleGroup.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Italic</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="strikethrough"
                class={cn(editor.isActive("strike") && "bg-secondary")}
                aria-label="Toggle strikethrough"
              >
                <Strikethrough class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Strikethrough</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="underline"
                class={cn(editor.isActive("underline") && "bg-secondary")}
                aria-label="Toggle underline"
              >
                <LucideUnderline class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Underline</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>

        <!-- bullet -->

        <div class="mx-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="bullet"
                class={cn(editor.isActive("bulletList") && "bg-secondary")}
                aria-label="Toggle Bullet List"
              >
                <List class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Bullet list</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="order"
                class={cn(editor.isActive("orderedList") && "bg-secondary")}
                aria-label="Toggle Ordered List"
              >
                <ListOrdered class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Ordered List</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>

        <!-- text alignment -->

        <div class="mx-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="left"
                class={cn(
                  editor.isActive({ textAlign: "left" }) && "bg-secondary",
                )}
                aria-label="Toggle Text Align Left"
              >
                <AlignLeft class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Align Left</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="center"
                class={cn(
                  editor.isActive({ textAlign: "center" }) && "bg-secondary",
                )}
                aria-label="Toggle Text Align Center"
              >
                <AlignCenter class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Align Center</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="right"
                class={cn(
                  editor.isActive({ textAlign: "right" }) && "bg-secondary",
                )}
                aria-label="Toggle Text Align Right"
              >
                <AlignRight class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Align Right</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <ToggleGroup.Item
                value="justify"
                class={cn(
                  editor.isActive({ textAlign: "justify" }) && "bg-secondary",
                )}
                aria-label="Toggle Text Align Justified"
              >
                <AlignJustify class="h-4 w-4" />
              </ToggleGroup.Item></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>Align Text Justified</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>

        <div class="mx-2">
          <Button
            on:click={() => {
              editor.chain().focus().undo().run();
            }}
            size="icon"
            disabled={!editor.can().undo()}
            variant="outline"><Undo2 class="h-4 w-4"></Undo2></Button
          >
          <Button
            on:click={() => {
              editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().redo()}
            size="icon"
            variant="outline"><Redo2 class="h-4 w-4"></Redo2></Button
          >
        </div>
      </ToggleGroup.Root>

      <Button variant="outline" color="primary">Export As</Button>
    </div>
    <!-- Horizontal Rules -->
  {/if}

  <div
    class="prose prose-lg w-[700px] flex-1 bg-border bg-stone-50"
    bind:this={element}
  />
</section>
