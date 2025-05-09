<script>
  import { fade, fly } from "svelte/transition";

  export let comic = null;
  export let pages = [];
  export let baseUrl = "";
  export let closeUrl = null;

  let index = 0;
  let showNavbar = true;
  let isForward = true;

  function isSpread() {
    return window.innerWidth >= 1024;
  }

  function next() {
    const step = isSpread() ? 2 : 1;
    if (index + step < pages.length) {
      index += step;
      showNavbar = false;
      isForward = true;
    }
  }

  function prev() {
    const step = isSpread() ? 2 : 1;
    if (index - step >= 0) {
      index -= step;
      showNavbar = false;
      isForward = false;
    }
  }

  function toggleNavbar() {
    showNavbar = !showNavbar;
  }

  function onClose() {
    if (closeUrl) {
      window.location.href = closeUrl;
    } else {
      window.history.back();
    }
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

<div class="viewer-container">
  {#key index}
    <div
      class="page-frame"
      in:fly={{ x: isForward ? -300 : 300 }}
      out:fly={{ x: isForward ? 300 : -300 }}
    >
      {#if index === 0}
        <div class="intro-page">
          <section class="section">
            <div class="container has-text-centered">
              <h1 class="title is-3 is-spaced">{comic.title}</h1>
              <h2 class="subtitle is-6">{comic.description}</h2>
            </div>
          </section>
        </div>
      {:else}
        {#each displayPages as page}
          <img
            class={isSpread() ? "page spread" : "page single"}
            src={`${page}`}
            alt={page}
          />
        {/each}
      {/if}
    </div>
  {/key}

  {#if showNavbar}
    <nav class="navbar is-black">
      <div class="navbar-brand">
        <button class="navbar-item" on:click={onClose}>閉じる</button>
        <a class="navbar-item" href={`${baseUrl}comics`}>漫画</a>
        <span class="navbar-item">{index + 1} / {pages.length}</span>
      </div>
    </nav>
  {/if}

  <div class="click-overlay">
    <div class="zone" on:click|stopPropagation={next}></div>
    <div class="zone" on:click|stopPropagation={toggleNavbar}></div>
    <div class="zone" on:click|stopPropagation={prev}></div>
  </div>
</div>

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

  .page-frame {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .intro-page {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    box-sizing: border-box;
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

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
</style>
