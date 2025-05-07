<script>
  import Viewer from "./Viewer.svelte";

  export let pages = [];

  let open = false;

  function openViewer() {
    open = true;
  }

  function closeViewer() {
    open = false;
  }
</script>

<button class="button" on:click={openViewer}>読む</button>

<Viewer bind:open {pages} onClose={closeViewer} />
