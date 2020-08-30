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
    <div id="book-main">
      <div id="left">
        <a-menu
            mode="inline"
        >
          <a-menu-item
              v-for="(item, i) in data && data.flow"
              :key="i"
              v-if="item"
              @click="openChapter(item.id)"
          >
            <span><a-icon type="book" /><span>{{ item.title || item.id }}</span></span>
          </a-menu-item>
        </a-menu>
      </div>
      <div id="right">
        <img :src="data && data.imgUrl" alt="">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import cheerio from 'cheerio'
  export default {
    name: 'BookDetail',
    data: function () {
      return {
        data: null,
        chapters: [],
        content: '',
        imgObj: {},
        css: ''
      }
    },
    methods: {
      openChapter (chapterId) {
        this.data.getChapterRaw(chapterId, (error, text) => {
          if (!error) {
            this.decodeText(text)
          } else {
            console.log(error)
          }
        })
      },
      decodeText (text) {
        const $ = cheerio.load(text)
        $('body').append(`<style>${this.css}</style>`)
        $('img').each((i, item) => {
          let src = item.attribs.src
          src = src.slice(3, src.length)
          let imgId = this.imgObj[src].id
          this.data.getImage(imgId, (error, data, mimeType) => {
            if (!error) {
              const imgSrc = `data:${mimeType};base64,` + data.toString('base64')
              $(item).attr('src', imgSrc)
              this.content = $.html()
              this.$forceUpdate()
            } else {
              console.log(error)
            }
          })
        })
        this.content = $.html()
      }
    },
    mounted () {
      this.data = this.$route.params.data
      if (this.data) {
        for (let key in this.data.manifest) {
          this.imgObj[this.data.manifest[key].href] = this.data.manifest[key]
        }
        console.log(this.imgObj)
        this.data.getChapterRaw(this.data.flow[1].id, (error, text) => {
          error ? console.log(error) : this.decodeText(text)
        })
        this.data.getFile('css', (error, data, mimeType) => {
          if (!error) {
            this.css = data.toString()
          } else {
            console.log(error)
          }
        })
      } else {
        this.$router.push('/downloaded-books')
      }
    }
  }
</script>

<style scoped>
  #book-detail {
    padding: 30px;
  }

  #book-main {
    display: flex;
  }

  #book-main #left {
    min-width: 300px;
  }

  #book-main #right {
    flex: 1;
    padding: 0 30px 30px;
  }

  #book-main #right img {
    height: 300px;
    float: right;
    margin: 0 0 25px 30px;
  }
</style>
