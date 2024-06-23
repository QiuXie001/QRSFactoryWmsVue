<template>
  <div>
    <Search @search="handleSearch" @addDict="showAddDictDialog" :currentPage="currentPage" @update-page="updatePage" />
    <List :rows="dictList" :currentPage="currentPage" :pageSize="pageSize" :total="total" @editDict="showEditDictDialog"
      @deleteDict="handleDeleteDict" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :dict="selectedDict"
      :parentDictList="parentDictList" :formFields="formFields" @confirmAction="confirmAddEditDict"
      @cancel="cancelAddEditDict" />
  </div>
</template>

<script>
import Search from './Search';
import List from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Dict',
  components: {
    Search,
    List,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      dictList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedDict: {},
      parentDictList: [],
      formFields: [
   
        {
          prop: 'DictName',
          label: '字典名称',
          type: 'input',
        },
        {
          prop: 'DictType',
          label: '字典类型',
          type: 'input',
        },{
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
      parmas: {
        offset: (this.currentPage - 1) * this.pageSize, // 或者 (页码 - 1) * 每页显示的行数
        limit: 8, // 每页显示的行数
        sort: 'CreateDate', // 排序字段
        order: 'desc', // 排序方式
        search: '', // 搜索关键词
        _: Date.now(), // 时间戳或随机数
        datemin: '2023-01-01', // 日期范围搜索的最小日期
        datemax: null, // 日期范围搜索的最大日期
        keyword: null // 额外的搜索关键词
      },
    }
  },
  methods: {
    init() {
      const UserFormData = new FormData();
      this.parmas.offset = (this.currentPage - 1) * this.pageSize;
      UserFormData.append("bootstrap", JSON.stringify(this.parmas));
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/Dict/GetPageList', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.dictList = data.rows;
            this.total = data.total; // 更新总记录数
            // 其他需要更新的数据...
          } else {
            this.$message({
              type: 'error',
              message: data.Item2
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error
          });
        });
      
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.init(); // 重新获取数据
    },
    handleSearch(searchData) {
      console.log(searchData);
      if (!searchData.dateRange || searchData.dateRange.length !== 2) {
        //
      }
      else {
        const startDate = new Date(searchData.dateRange[0]);
        const endDate = new Date(searchData.dateRange[1]);

        if (isNaN(startDate) || isNaN(endDate)) {
          console.error('提供的日期格式不正确');
          return;
        }
        // 验证日期顺序
        if (startDate > endDate) {
          console.error('开始日期不能晚于结束日期');
          return;
        }
        this.parmas.datemin = startDate.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
        this.parmas.datemax = endDate.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD

      }
      this.parmas.search = searchData.dictName;
      this.init(); // 重新获取数据
    },
    showAddDictDialog() {
      // 显示新增字典对话框的逻辑
     
      this.dialogTitle = '新增字典';
      this.addEditDialogVisible = true;
    },
    confirmAddEditDict(dictData) {
      if (this.dialogTitle === '新增字典') {
        const dictDto = {
          DictType: dictData.DictType,
          DictName: dictData.DictName,
          Remark: dictData.Remark,
          DictParent: dictData.DictParent,
          DictUrl: dictData.DictUrl,
          DictIcon: dictData.DictIcon,
          DictOrder: dictData.DictOrder,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("dict", JSON.stringify(dictDto));
        this.$axios.post(this.$httpUrl + '/Dict/InsertDict', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
              console.log()
              this.init(); // 重新获取数据
            } else {
              this.$message({
                type: 'error',
                message: data.Item2
              });
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error
            });
          });
      }
      else if (this.dialogTitle === '编辑字典') {
        //
      }

      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditDictDialog(dict) {
      // 显示编辑字典对话框的逻辑
      this.dialogTitle = '编辑字典';
      this.selectedDict = dict;
      this.addEditDialogVisible = true;
    },
    cancelAddEditDict() {
      // 取消添加或编辑字典的逻辑
      this.dialogVisible = false;
    },
    handleDeleteDict(dictData) {
      const dictDto = {
        DictId: dictData.DictId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("dict", JSON.stringify(dictDto));
      this.$axios.post(this.$httpUrl + '/Dict/DeleteDict', UserFormData)
        .then(response => {
          const data = response.data;
          if (data.Item1) {
            this.init();
            this.$message({
              type: 'success',
              message: data.Item2
            });
          } else {
            this.$message({
              type: 'error',
              message: data.Item2
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error
          });
        });
    },
    updatePage(newPage) {
      this.currentPage = newPage;
    },

  }
}
</script>