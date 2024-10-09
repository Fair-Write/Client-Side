<script lang="ts">
  import { onMount } from "svelte";
  // flow
  // drag file to zone *
  // on drag check if file is a valid type
  // txt/pdf/document
  // if valid
  // return output string i guess
  import {
    dropHandler,
    dragOverHandler,
    convertDragToFile,
    convertInputToFile,
  } from "../use-case/extractDocument";

  let fileDocument: null | File = null;
</script>

<div>
  <form class="scan-container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="drop-wrapper"
      on:drop={(e) => {
        e.preventDefault();
        dropHandler(convertDragToFile(e));
      }}
      on:dragover={(e) => dragOverHandler(e)}
    >
      <div>
        <label for="File_Drop">Drag your File Here</label>
        <input
          on:change={(e) => dropHandler(convertInputToFile(e))}
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
