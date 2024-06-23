<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" ref="searchForm">
          <el-col :span="8">
            <el-form-item prop="InventorymoveName">
              <el-input v-model="searchForm.InventorymoveName" placeholder="请输入承运商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item prop="dateRange">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="2" :offset="0">
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="4">
        <el-button type="primary" @click="handleAdd()">新增承运商</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchForm: {
        InventorymoveName: '',
        dateRange: [] // 初始化为空数组
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchForm);
    },
    handleAdd() {
      // 新增承运商逻辑
      this.$emit('addInventorymove');
    }
  }
}
</script>

<style scoped>

</style>