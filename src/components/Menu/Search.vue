<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" ref="searchForm">
          <el-col :span="8">
            <el-form-item prop="menuName">
              <el-input v-model="searchForm.menuName" placeholder="菜单名称或类型"></el-input>
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
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    currentPage: Number,
  },
  data() {
    return {
      searchForm: {
        menuName: '',
        dateRange: [] // 初始化为空数组
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('update-page', 1);
      this.$emit('search', this.searchForm);
    },
    handleAdd() {
      this.$emit('addMenu');
    }
  }
}
</script>

<style scoped></style>