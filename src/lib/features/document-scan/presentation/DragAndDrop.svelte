<script lang="ts">
  // flow
  // drag file to zone
  // on drag check if file is a valid type
  // txt/pdf/document
  // if valid
  // return output string i guess

  import { dropHandler, dragOverHandler } from "../use-case/extractDocument";
</script>

<div
  class="drop-container"
  role="button"
  aria-label="Upload files"
  aria-describedby="upload-instructions"
  tabindex="0"
  on:drop={(e) => dropHandler(e)}
  on:dragover={(e) => dragOverHandler(e)}
>
  <p>Drag Your Files Here <br /> OR/</p>

  <button>Open File Here</button>
</div>

<style>
  .drop-container {
    border: solid 5px blue;
    width: 100px;
    height: 100px;
  }
</style>
