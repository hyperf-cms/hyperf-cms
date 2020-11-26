<template>
  <el-form-item label="来源选择">
    <el-select v-model="sourceId" class="input-width" placeholder="请选择来源">
      <el-option v-for="(item, key) in sourceList"
        :key="key"
        :label="item"
        :value="key"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import {getSourceList} from '@/api/search/sourceList.js';
  export default {
    name: 'sourceList',
    data() {
      return {
        sourceList: [],
        sourceId: null,
      }
    },
    props: {
      listQuery: {
        default: [],
      },
    },
    created() {
      this.getSourceList()
      this.listQuery.sourceId = this.sourceId
    },
    watch: {
      sourceId(newValue, oldValue) {
          this.listQuery.sourceId = newValue
      }
    },
    methods: {
      getSourceList() {
       getSourceList().then(response => {
          this.sourceList = response.data;
       })
      }
    }
  }

  

//   watch: {
//     itemId(newValue, oldValue) {
//         this.listQuery.itemId = newValue
//     }
//   },

// }
</script>

