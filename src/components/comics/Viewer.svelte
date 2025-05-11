<script lang="ts">
  import type { Comic } from "@types/comic";
  import { fade, fly } from "svelte/transition";
  const baseUrl = import.meta.env.BASE_URL;

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
    return window.innerWidth > window.innerHeight * 1.5;
  }

  function isIntroPage(index: number) {
    return index === 0;
  }

  function isFinishPage(index: number) {
    return index > pages.length;
  }

  function move(step: number) {
    if (isFinishPage(index) && step > 0) {
      return;
    }

    let newIndex = index + step;

    if (newIndex < 0) {
      newIndex = 0;
    }

    if (isSpread() && !isFinishPage(newIndex)) {
      if (newIndex > 1) {
        if (startSide === "left" && newIndex % 2 === 1) {
          newIndex = newIndex - 1;
        } else if (startSide === "right" && newIndex % 2 === 0) {
          newIndex = newIndex - 1;
        }
      }
    }

    index = newIndex;
  }

  function next() {
    isForward = true;
    move(displayItems.length);
    showNavbar = isIntroPage(index) || isFinishPage(index);
  }

  function prev() {
    isForward = false;
    move(-1);
    showNavbar = isIntroPage(index) || isFinishPage(index);
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
    type: "intro" | "page" | "finish";
    value: string;
  };
  let displayItems: DisplayItem[] = [];
  $: displayItems = (() => {
    if (isIntroPage(index)) {
      return [{ type: "intro", value: "" }];
    } else if (isFinishPage(index)) {
      return [{ type: "finish", value: "" }];
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
          <div
            class="intro-page"
            style={`background: url('${baseUrl}assets/lined_paper.png') repeat; `}
          >
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
        {:else if item.type === "finish"}
          <div
            class="finish-page"
            style={`background: url('${baseUrl}assets/lined_paper.png') repeat; `}
          >
            <section class="section">
              <div class="container has-text-centered">
                <h1 class="title is-3 is-spaced">{comic.title}</h1>
                <div class="buttons is-centered mt-6">
                  <button class="button is-medium" on:click={onClose}>
                    <span>一覧に戻る</span>
                  </button>
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
        {/if}
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

    <div class="seekbar">
      <input
        type="range"
        min="0"
        max={pages.length + 1}
        value={pages.length + 1 - index}
        on:input={(e) => {
          const invertedValue = parseInt(e.currentTarget.value);
          const newIndex = pages.length + 1 - invertedValue;
          const diff = newIndex - index;
          move(diff);
        }}
        step="1"
      />
    </div>
  {/if}

  <div class="click-overlay">
    <button class="zone left" on:click|stopPropagation={next}>
      {#if isIntroPage(index)}
        <div class="zone-content">
          <span class="icon is-large">
            <i class="fas fa-arrow-left fa-2x"></i>
          </span>
          <div class="zone-text">次へ</div>
        </div>
      {/if}
    </button>
    <button
      class="zone center"
      class:is-finish={isFinishPage(index)}
      on:click|stopPropagation={toggleNavbar}
    >
      {#if isIntroPage(index)}
        <div class="zone-content">
          <div class="zone-text">中央タップでメニュー開閉</div>
        </div>
      {/if}
    </button>
    <button
      class="zone right"
      on:click|stopPropagation={index === 0 ? undefined : prev}
    >
      {#if isIntroPage(index)}
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
    pointer-events: none;
  }

  .click-overlay.intro {
    background: rgba(0, 0, 0, 0.03);
  }

  .zone {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: background-color 0.2s ease;
    pointer-events: auto;
  }

  .click-overlay.intro .zone:not(.right):hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .zone-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 15vh;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s ease;
  }

  .zone-content.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.9;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.07);
    }
  }

  .zone.left .zone-content {
    margin-right: auto;
    margin-left: 0.5rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .zone.right .zone-content {
    margin-left: auto;
    margin-right: 0.5rem;
    flex-direction: row-reverse;
  }

  .zone.center {
    position: relative;
  }

  .zone.center .zone-content {
    position: absolute;
    bottom: 5vh;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.7);
    font-size: 0.85em;
    opacity: 0.5;
    transform: translateY(1rem);
    transition: all 0.2s ease-out;
  }

  .zone.center.is-finish {
    pointer-events: none;
  }

  .click-overlay.intro .zone.center:hover .zone-content {
    opacity: 0.7;
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(0);
  }

  .zone-text {
    color: #444;
    font-size: clamp(0.8rem, 3vw, 1rem);
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .zone-content {
      padding: 0.5rem 0.8rem;
      gap: 0.3rem;
    }

    .zone.left .zone-content,
    .zone.right .zone-content {
      margin: 15vh 0.3rem 0;
    }

    .zone.center .zone-content {
      bottom: 3vh;
      font-size: 0.75em;
    }

    .icon.is-large {
      font-size: 1.2rem;
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

  .seekbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 16px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .seekbar input[type="range"] {
    width: 100%;
    margin: 0;
    /* Webkit (Chrome, Safari, Edge など) 用のスタイル */
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    height: 8px;
  }

  /* つまみのスタイル */
  .seekbar input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  /* Firefox用のスタイル */
  .seekbar input[type="range"]::-moz-range-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    height: 8px;
  }

  .seekbar input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  .finish-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 4rem 2rem;
    box-sizing: border-box;
    color: #333;
  }

  .finish-page .container {
    max-width: 400px;
    margin: 0 auto;
  }

  .finish-page .title {
    margin-bottom: 1rem;
  }
</style>
