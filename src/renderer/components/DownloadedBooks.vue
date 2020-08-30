<template>
  <div id="books">
    <div style="margin-bottom: 30px;">
      <a-button
          type="primary"
          size="large"
          @click="$router.push('/')"
      >Back</a-button>
    </div>
    <div>
      <div class="grid">
        <div class="block" v-for="(book, i) in books" :key="i">
          <a-card :loading="isLoading" hoverable @click="openBook(book)">
            <img
                slot="cover"
                :src="book.imgUrl"
            />
            <a-card-meta :title="book.metadata.title">
              <template slot="description">
                <div class="book-creator">
                  Author: {{ book.metadata.creator }}
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const fs = require('fs')
  const EPub = require('epub')
  export default {
    name: 'DownloadedBooks',
    data: function () {
      return {
        books: [],
        isLoading: false
      }
    },
    methods: {
      openBook (data) {
        this.$router.push({
          name: 'book-detail',
          params: {
            data
          }
        })
      }
    },
    mounted () {
      this.isLoading = true
      let files = fs.readdirSync('books')
      files.map((file, index) => {
        let epub = new EPub('books/' + file)
        epub.on('end', () => {
          this.books.push(epub)
          epub.getImage(epub.metadata.cover, (error, data, mimeType) => {
            if (!error) {
              epub.imgUrl = `data:${mimeType};base64,` + data.toString('base64')
              this.$forceUpdate()
            } else {
              console.log(error)
            }
          })
        })
        epub.parse()
      })
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
      console.log(this.books)
    }
  }
</script>

<style scoped>
  .book-creator {
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #books {
    padding: 30px;
  }

  .grid {
    -webkit-column-count: 4;
    -webkit-column-gap: 10px;
    -webkit-column-fill: auto;
    -moz-column-count: 4;
    -moz-column-gap: 10px;
    -moz-column-fill: auto;
    column-count: 5;
    column-gap: 15px;
    column-fill: auto;
  }

  .block {
    word-wrap: break-word;
    margin-bottom: 15px;
    -webkit-column-break-inside: avoid;
    -moz-column-break-inside: avoid;
    column-break-inside: avoid;
  }
</style>
