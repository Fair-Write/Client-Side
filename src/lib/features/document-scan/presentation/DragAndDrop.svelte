<script lang="ts">
  // flow
  // drag file to zone
  // on drag check if file is a valid type
  // txt/pdf/document
  // if valid
  // return output string i guess
  import { dropHandler, dragOverHandler } from "../use-case/extractDocument";
  let fileDocument: null | File = null;

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    fileDocument = input.files ? input.files[0] : null;
    console.log(fileDocument?.type);
  }
</script>

<div>
  <form class="drop-container">
    <div
      role="button"
      aria-label="Upload files"
      aria-describedby="upload-instructions"
      tabindex="0"
      on:drop={(e) => dropHandler(e)}
      on:dragover={(e) => dragOverHandler(e)}
    ></div>

    <label for="File_Drop">Drag your File Here</label>
    <input
      on:change={(e) => handleFileChange(e)}
      id="File_Drop"
      accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      type="file"
    />

    <button type="submit">Analyze</button>
  </form>
</div>

<style>
  .drop-container {
    border: solid 5px blue;
    width: 100px;
    height: 100px;
  }
</style>
