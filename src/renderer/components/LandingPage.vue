<template>
  <div id="wrapper">
    <div class="search">
      <a-input-search v-model="keyword" placeholder="input search text" enter-button @search="onSearch" />
    </div>
    <div class="table">
      <a-table :columns="tableColumns" :data-source="tableData" rowKey="id">
        <img slot="bookPic" slot-scope="bookPic" style="width: 200px;" :src="bookPic" />
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
</template>

<script>
  const fs = require('fs')
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
      title: 'Book Name'
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description'
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
        keyword: '',
        searchList: [],
        totalElements: null,
        totalPages: null
      }
    },
    methods: {
      onSearch: async function (value) {
        let result = await this.$http.get('https://www.shiyisoushu.com/api/search/v3?q=' + this.keyword)
        this.searchList = result.data.data.content
        console.log(result)
        console.log(this.searchList)
        this.tableData = this.searchList
      },
      onDownload: function (url, suffix, title) {
        const name = title + '.' + suffix
        console.log(url)
        console.log(title + '.' + suffix)
        this.$http({
          method: 'get',
          url,
          responseType: 'stream'
        })
          .then(function (response) {
            response.data.pipe(fs.createWriteStream(name))
          })
      }
    }
  }
</script>

<style>

</style>
