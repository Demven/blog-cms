<template>
  <div class="ArticleBody">
    <ArticleBodyNode
      v-for="(node, index) in nodes"
      :key="node.id"
      :index="index"
      :content="node"
      @update="onContentUpdate"
      @remove="onContentRemove"
      @add-content="onAddContent"
    ></ArticleBodyNode>
  </div>
</template>

<script>
  import ArticleBodyNode from './ArticleBodyNode.vue';

  export default {
    name: 'ArticleBody',
    props: {
      nodes: Array,
      section: Object,
    },
    components: {
      ArticleBodyNode,
    },
    data () {
      return {
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
          ADD_CONTENT: 'add-content',
        },
      };
    },
    methods: {
      onContentUpdate (event) {
        this.$emit(this.EVENT.UPDATE, event);
      },

      onContentRemove (event) {
        this.$emit(this.EVENT.REMOVE, event);
      },

      onAddContent(event) {
        this.$emit(this.EVENT.ADD_CONTENT, event);
      },
    }
  };
</script>

<style lang="scss">
  @import '../../styles/media';

  .ArticleBody {
    display: flex;
    flex-direction: column;
    margin-top: 4em;
  }
</style>
