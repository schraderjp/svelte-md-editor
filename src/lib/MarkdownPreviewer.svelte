<script>
  import { marked } from 'marked';
  import '../md-styles.css';
  export let html;
</script>

<div class="viewer-wrapper">
  {@html marked.parse(html)}
</div>

<style>
  div.viewer-wrapper {
    height: 100%;
    width: 100%;
    font-family: 'Source Sans Pro', sans-serif;
  }
</style>
