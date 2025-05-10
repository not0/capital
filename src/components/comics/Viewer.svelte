<script lang="ts">
  import type { Comic } from "@types/comic";
  import { fade, fly } from "svelte/transition";

  export let comic: Comic;
  export let thumbnail: string;
  export let pages: string[];
  export let closeUrl: string | null = null;

  let index = 0;
  let showNavbar = true;
  let isForward = true;

  const startSide = comic.startSide || "left";

  function isSpread() {
    if (index === 0 || (startSide === "left" && index === 1)) {
      return false;
    }
    return window.innerWidth >= 1024;
  }

  function move(step: number) {
    let newIndex = index + step;

    if (newIndex > pages.length) {
      return;
    }

    if (newIndex < 0) {
      newIndex = 0;
    }

    if (isSpread()) {
      if (newIndex > 1) {
        if (startSide === "left" && newIndex % 2 === 1) {
          newIndex = newIndex - 1;
        } else if (startSide === "right" && newIndex % 2 === 0) {
          newIndex = newIndex - 1;
        }
      }
    }

    index = newIndex;
    showNavbar = index === 0 ? true : false;
  }

  function next() {
    isForward = true;
    move(displayItems.length);
  }

  function prev() {
    isForward = false;
    move(-1);
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

  type DisplayItem = {
    type: "intro" | "page";
    value: string;
  };
  let displayItems: DisplayItem[] = [];
  $: displayItems = (() => {
    if (index === 0) {
      return [{ type: "intro", value: "" }];
    } else {
      const step = isSpread() ? 2 : 1;
      const start = index - 1;
      const end = Math.min(start + step, pages.length);
      return pages
        .slice(start, end)
        .reverse()
        .map((page) => ({
          type: "page",
          value: page,
        }));
    }
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
      {#each displayItems as item}
        {#if item.type === "intro"}
          <div class="intro-page">
            <section class="section">
              <div class="container has-text-centered">
                <h1 class="title is-3 is-spaced">{comic.title}</h1>
                <h2 class="subtitle is-6">{comic.description}</h2>
                <figure class="image is-3by2">
                  <img src={thumbnail} />
                </figure>
                <div class="start-hint">
                  <span class="icon arrow">
                    <i class="fas fa-arrow-left"></i>
                  </span>
                  <div class="hint-text">左側クリックで読み始める</div>
                </div>
              </div>
            </section>
          </div>
        {:else if item.type === "page"}
          <img
            class={isSpread() ? "page spread" : "page single"}
            src={`${item.value}`}
            alt={item.value}
          />
        {:else}{/if}
      {/each}
    </div>
  {/key}

  {#if showNavbar}
    <nav class="navbar is-black">
      <div class="navbar-brand">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button" on:click={onClose}>
              <strong>戻る</strong>
            </button>
          </div>
        </div>
      </div>
      <div class="navbar-end">
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

  .start-hint {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 2rem;
    padding: 1rem;
    gap: 1rem;
    animation: pulse 2s infinite;
  }

  .arrow {
    font-size: 2rem;
    color: #666;
    animation: slide 1s infinite;
  }

  .hint-text {
    font-size: 1.2rem;
    color: #666;
    font-weight: 500;
  }

  @keyframes pulse {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }

  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-10px);
    }
    100% {
      transform: translateX(0);
    }
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
