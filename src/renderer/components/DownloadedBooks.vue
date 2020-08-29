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
      <a-row :gutter="16">
        <a-col :span="8" v-for="(book, i) in books" :key="i" @click="openBook(book)">
          <a-card hoverable style="width: 240px">
            <img
                slot="cover"
                alt="example"
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
        </a-col>
      </a-row>
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
        chapters: [],
        books: []
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
</style>
