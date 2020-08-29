<template>
  <div id="book-detail">
    <div style="margin-bottom: 30px;">
      <a-button
          type="primary"
          icon="appstore"
          size="large"
          @click="$router.push('/downloaded-books')"
      >Downloaded Books</a-button>
    </div>
    <div>
      <div id="left"></div>
      <div id="right">
        <img :src="data && data.imgUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BookDetail',
    data: function () {
      return {
        data: null
      }
    },
    mounted () {
      this.data = this.$route.params.data
      console.log(this.data)
    }
  }
</script>

<style scoped>
  #book-detail {
    padding: 30px;
  }
</style>
