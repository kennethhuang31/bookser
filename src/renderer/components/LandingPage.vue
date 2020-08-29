<template>
  <div id="wrapper">
    <div class="spinner" v-if="isSpinning">
      <a-spin size="large" />
    </div>
    <div v-if="!isSpinning">
      <div class="top">
        <div class="search">
          <a-input-search
              size="large"
              v-model="keyword"
              placeholder="Which book do you want to search ?"
              @keydown.esc="keyword = ''"
              enter-button
              @search="onSearch"
          />
        </div>
        <div class="bookBtn">
          <a-button
              type="primary"
              icon="appstore"
              size="large"
              @click="$router.push('/downloaded-books')"
          >Downloaded Books</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="tableColumns" :data-source="tableData" rowKey="id">
          <img slot="bookPic" slot-scope="bookPic" style="width: 100px;" :src="bookPic" />
          <div slot="description" slot-scope="description">
            {{ description && description.trim() }}
          </div>
          <div slot="downloadInfos" slot-scope="downloadInfos, rowData" class="btnlist">
            <a-button
                v-for="downloadInfo in downloadInfos"
                :key="downloadInfo.name"
                type="primary"
                icon="download"
                style="margin: 0.2rem;"
                @click="onDownload(downloadInfo.url, downloadInfo.name, rowData.title)"
            >
              {{ downloadInfo.name }}
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  const { ipcRenderer } = require('electron')
  const tableColumns = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID'
    },
    {
      key: 'bookPic',
      dataIndex: 'bookPic',
      title: 'Book Picture',
      slots: { title: 'bookPic' },
      scopedSlots: { customRender: 'bookPic' }
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Book Name',
      width: 300
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
      slots: { title: 'description' },
      scopedSlots: { customRender: 'description' }
    },
    {
      key: 'downloadInfos',
      dataIndex: 'downloadInfos',
      title: 'Download Information',
      slots: { title: 'downloadInfos' },
      scopedSlots: { customRender: 'downloadInfos' },
      width: 320
    }
  ]
  export default {
    name: 'landing-page',
    data: function () {
      return {
        tableColumns,
        tableData: [],
        keyword: 'javascript',
        searchList: [],
        totalElements: null,
        totalPages: null,
        isSpinning: false
      }
    },
    methods: {
      onSearch: async function (value) {
        this.isSpinning = true
        let result = await this.$http.get('https://www.shiyisoushu.com/api/search/v3?q=' + this.keyword)
        this.searchList = result.data.data.content
        console.log(result)
        console.log(this.searchList)
        this.tableData = this.searchList
        this.isSpinning = false
      },
      onDownload: function (url, suffix, title) {
        const name = title + '.' + suffix
        console.log(url)
        console.log(title + '.' + suffix)
        let result = ipcRenderer.sendSync('downloadRequest', [name, url])
        if (result === 'downloaded') {
          this.$notification.success({
            message: 'Downloaded successfully',
            description: name
          })
        }
      }
    }
  }
</script>

<style>
  #wrapper {
    padding: 30px;
  }

  .search {
    margin-bottom: 30px;
  }

  .btnlist {
    display: flex;
    justify-content: center;
  }

  .spinner {
    text-align: center;
    margin-top: 40vh;
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .top .search {
    width: 80%;
  }
</style>
