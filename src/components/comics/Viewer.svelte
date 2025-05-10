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

  <div class="click-overlay" class:intro={index === 0}>
    <button class="zone left" on:click|stopPropagation={next}>
      {#if index === 0}
        <div class="zone-content">
          <span class="icon is-large">
            <i class="fas fa-arrow-left fa-2x"></i>
          </span>
          <div class="zone-text">次へ</div>
        </div>
      {/if}
    </button>
    <button class="zone center" on:click|stopPropagation={toggleNavbar}>
      {#if index === 0}
        <div class="zone-content">
          <div class="zone-text">中央タップでメニュー開閉</div>
        </div>
      {/if}
    </button>
    <button
      class="zone right"
      on:click|stopPropagation={index === 0 ? undefined : prev}
    >
      {#if index === 0}
        <div class="zone-content disabled">
          <div class="zone-text">前へ</div>
          <span class="icon is-large">
            <i class="fas fa-arrow-right fa-2x"></i>
          </span>
        </div>
      {/if}
    </button>
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
    flex-direction: column;
    text-align: center;
    padding: 4rem 2rem;
    box-sizing: border-box;
  }

  .intro-page .container {
    max-width: 400px;
    margin: 0 auto;
  }

  .intro-page .title {
    margin-bottom: 1rem;
  }

  .intro-page .image {
    margin-top: 2rem;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .intro-page .image img {
    width: 100%;
    height: auto;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
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

  .click-overlay.intro {
    background: rgba(0, 0, 0, 0.03);
  }

  .zone {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .zone-content.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .click-overlay.intro .zone:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .click-overlay.intro .zone.right:hover {
    background: transparent;
  }

  .zone-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @keyframes pulse {
    0% {
      opacity: 0.9;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.07);
    }
    100% {
      opacity: 0.9;
      transform: scale(1);
    }
  }

  .zone.left .zone-content {
    margin-right: auto;
    margin-left: 0.5rem;
    margin-top: 15vh;
    animation: pulse 2s ease-in-out infinite;
  }

  .zone.right .zone-content {
    margin-left: auto;
    margin-right: 0.5rem;
    margin-top: 15vh;
    flex-direction: row-reverse;
  }

  .zone.center {
    position: relative;
  }

  .zone.center .zone-content {
    position: absolute;
    bottom: 5vh;
    padding: 0.5rem 1rem;
    font-size: 0.85em;
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.7);
    transform: translateY(1rem);
    transition:
      transform 0.2s ease-out,
      opacity 0.2s ease-out;
  }

  .click-overlay.intro .zone.center:hover .zone-content {
    opacity: 0.7;
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(0);
  }

  .zone-text {
    color: #444;
    font-weight: 500;
    white-space: nowrap;
    font-size: clamp(0.8rem, 3vw, 1rem);
  }

  @media (max-width: 640px) {
    .zone-content {
      padding: 0.5rem 0.8rem;
      gap: 0.3rem;
    }
    .icon.is-large {
      font-size: 1.2rem;
    }
    .zone.left .zone-content,
    .zone.right .zone-content {
      margin-left: 0.3rem;
      margin-right: 0.3rem;
    }
    .zone.center .zone-content {
      bottom: 3vh;
      font-size: 0.75em;
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
