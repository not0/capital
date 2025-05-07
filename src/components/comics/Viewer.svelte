<script>
  export let pages = [];
  export let open = false;
  export let onClose = () => {};

  let index = 0;

  function isSpread() {
    return window.innerWidth >= 1024;
  }

  function next() {
    const step = isSpread() ? 2 : 1;
    if (index + step < pages.length) {
      index += step;
    }
  }

  function prev() {
    const step = isSpread() ? 2 : 1;
    if (index - step >= 0) {
      index -= step;
    }
  }

  function close() {
    window.dispatchEvent(new CustomEvent("closeViewer"));
  }

  $: displayPages = (() => {
    const step = isSpread() ? 2 : 1;
    const start = index;
    const end = Math.min(index + step, pages.length);
    return pages.slice(start, end).reverse();
  })();

  function handleResize() {
    // 再計算をトリガーするために index に自分自身を再代入
    index = index;
  }
</script>

<svelte:window on:resize={handleResize} />

{#if open}
  <div class="viewer-container">
    {#each displayPages as page}
      <img
        class={isSpread() ? "page spread" : "page single"}
        src={`${page}`}
        alt={page}
      />
    {/each}

    <div class="click-overlay">
      <div class="zone" on:click={next}></div>
      <div class="zone" on:click={prev}></div>
    </div>

    <button class="close-button" on:click={onClose}>閉じる</button>
  </div>
{/if}

<style>
  .viewer-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    overflow: hidden;
    z-index: 1000;
  }

  .page {
    max-height: 100%;
    object-fit: contain;
  }

  .page.spread {
    max-width: 50%;
  }

  .page.single {
    max-width: 100%;
  }

  .click-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: space-between;
    z-index: 5;
  }

  .zone {
    flex: 1;
    cursor: pointer;
  }

  .close-button {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    padding: 4px 8px;
    border: none;
    cursor: pointer;
  }
</style>
