<script lang="ts">
  import {
    dragOverHandler,
    dropHandler,
    inputHandler,
  } from "../use-case/dragAndDropEvents";

  let fileDocument: null | File = null;
</script>

<div>
  <form class="scan-container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="drop-wrapper"
      on:drop={async (e) => await dropHandler(e)}
      on:dragover={async (e) => await dragOverHandler(e)}
    >
      <div>
        <label for="File_Drop">Drag your File Here</label>
        <input
          on:change={async (e) => await inputHandler(e)}
          id="File_Drop"
          accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          type="file"
        />
      </div>
    </div>

    <button type="submit">Analyze</button>
  </form>
</div>

<style>
  .scan-container {
    border: solid 5px blue;
    width: 500px;
    height: 500px;
  }

  .drop-wrapper {
    width: 200px;
    height: 200px;
    background-color: rgb(184, 167, 167);
  }
</style>
