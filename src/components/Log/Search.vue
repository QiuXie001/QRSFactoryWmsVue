<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" ref="searchForm">
          <el-col :span="8">
            <el-form-item prop="LogName">
              <el-input v-model="searchForm.LogName" placeholder="请输入日志名称"></el-input>
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
  
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchForm: {
        LogName: '',
        dateRange: [] // 初始化为空数组
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchForm);
    },
    handleAdd() {
      // 新增日志逻辑
      this.$emit('addLog');
    }
  }
}
</script>

<style scoped>

</style>