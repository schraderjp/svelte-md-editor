<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import MarkdownPreviewer from './lib/MarkdownPreviewer.svelte';
  import { download } from './lib/utils';
  import './app.css';
  import * as monaco from 'monaco-editor';
  import { editor, model, value } from './lib/stores';
  let editorElement;
  let width;
  let height;
  let theme = localStorage.getItem('md-editor-theme') || 'vs';
  let view = 'split';
  let filename = '';
  let file;
  let filePicker;
  let fileContent;

  function setFile(e) {
    file = e.target.files[0];
    console.log(file);
  }

  function onFileLoad(e) {
    let fr = new FileReader();
    fr.onload = () => {
      fileContent = fr.result;
      $model.setValue(fileContent);
      $value = fileContent;
    };
    fr.readAsText(e.target.files[0]);
  }

  function toggleView() {
    if (view === 'split') {
      return (view = 'editor-only');
    }
    if (view === 'editor-only') {
      //$editor.dispose();
      return (view = 'viewer-only');
    }
    //initializeEditor();
    $editor.layout({ height: height, width: width / 2 });
    return (view = 'split');
  }

  function updateLayout() {
    console.log({ height: height, width: width });

    if (!$editor) return;
    if (view === 'split')
      return $editor.layout({ height: height, width: width / 2 });
    $editor.layout();
  }

  function updateTheme() {
    if (!$editor) return;
    $editor.updateOptions({ theme: theme });
    localStorage.setItem('md-editor-theme', theme);
  }

  function initializeEditor() {
    $model = monaco.editor.createModel($value, 'markdown');
    $editor = monaco.editor.create(editorElement, {
      model: $model,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      padding: {
        top: 10,
        bottom: 5,
      },
      theme: theme,
    });
    $model.onDidChangeContent((e) => {
      $value = $model.getValue();
      localStorage.setItem('md-editor-svelte', $value);
    });
  }

  $: width, updateLayout();
  $: height, updateLayout();
  $: theme, updateTheme();
  //$: view, updateLayout();
  onMount(() => initializeEditor());

  onDestroy(() => {
    if ($editor !== null) $editor.dispose();
  });
</script>

<div class="toolbar">
  <button
    on:click={() => (theme === 'vs' ? (theme = 'vs-dark') : (theme = 'vs'))}
  >
    {#if theme === 'vs'}
      <i class="bi bi-moon-fill" />
    {:else}
      <i class="bi bi-sun-fill" />
    {/if}
  </button>
  <button
    on:click={() => {
      $editor.layout({ height: height, width: width / 2 });
      view = 'split';
    }}><i class="bi bi-layout-split" /></button
  >
  <button on:click={() => (view = 'editor-only')}
    ><i class="bi bi-pencil-square" /></button
  >
  <button on:click={() => (view = 'viewer-only')}
    ><i class="bi bi-eye-fill" /></button
  >
  <div class="save-section">
    <input
      bind:value={filename}
      type="text"
      placeholder="Enter Desired Filename"
    />
    <button on:click={() => download(`${filename}.md`, $value)}
      ><i class="bi bi-save-fill" /></button
    >
  </div>
  <label for="file"><i class="bi bi-upload" /></label>
  <input
    style="opacity: 0; width: 0"
    id="file"
    bind:this={filePicker}
    type="file"
    on:change={onFileLoad}
  />
</div>
<main bind:clientWidth={width} bind:clientHeight={height}>
  <div
    class={`container ${
      view === 'split' || view === 'editor-only' ? '' : 'hidden'
    }`}
    bind:this={editorElement}
  />

  <div
    class={`viewer ${
      view === 'split' || view === 'viewer-only' ? '' : 'hidden'
    }`}
  >
    <MarkdownPreviewer html={$value} />
  </div>
</main>

<style>
  button {
    height: 2rem;
    padding: 0.25rem 0.5rem;
    background: rgb(180, 196, 219);
    margin: 0 0.25rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  input[type='file'] {
    height: 100%;
  }

  input[type='text'] {
    background: #eeeeee;
    margin: 0 0.5rem;
    padding: 0.25rem;
    border-radius: 6px;
    border-color: rgb(39, 45, 49);
  }

  i.bi-upload {
    padding: 0.25rem;
    border-radius: 6px;
    cursor: pointer;
    background: rgb(180, 196, 219);
  }

  main {
    display: flex;
    width: 100vw;
    height: calc(100vh - 2.5rem);
  }

  .toolbar {
    display: flex;
    height: 2.5rem;
    align-items: center;
  }

  .save-section {
    display: flex;
    flex-flow: row;
  }

  .save-section button {
    height: 100%;
  }

  .hidden {
    display: none;
  }

  .container {
    height: 100%;
    width: 100%;
  }

  .viewer {
    height: 100%;
    width: 100%;
    padding-left: 1rem;
  }
</style>
