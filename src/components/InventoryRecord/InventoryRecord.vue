<template>
  <div>
    <Search @search="handleSearch" @addInventoryRecord="showAddInventoryRecordDialog" />
    <InventoryRecordList :rows="InventoryRecordList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editInventoryRecord="showEditInventoryRecordDialog" @deleteInventoryRecord="handleDeleteInventoryRecord" @pageChange="handlePageChange" />
  
  </div>
</template>

<script>
import Search from './Search';
import InventoryRecordList from './List';


export default {
  name: 'InventoryRecord',
  components: {
    Search,
    InventoryRecordList,
    
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      InventoryRecordList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedInventoryRecord: {},
      menuIds: [],
      menuList: [],
      
      parmas: {
        offset: (this.currentPage - 1) * this.pageSize, // 或者 (页码 - 1) * 每页显示的行数
        limit: 8, // 每页显示的行数
        sort: 'CreateDate', // 排序字段
        order: 'desc', // 排序方式
        search: null, // 搜索关键词
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

      this.$axios.post(this.$httpUrl + '/InventoryRecord/GetPageList', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.InventoryRecordList = data.rows; // 假设data.rows是你的角色列表
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

      const menuFormData = new FormData();
      menuFormData.append("token", this.$store.state.token);
      menuFormData.append("userId", this.$store.state.user.UserId);
      this.$axios.post(this.$httpUrl + '/Menu/GetMenus', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuList = data.rows;
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
      this.parmas.search = searchData.InventoryRecordName;
      this.init();
    },
    showAddInventoryRecordDialog() {
      // 显示新增角色对话框的逻辑
      this.dialogTitle = '新增角色';
      this.selectedInventoryRecord = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditInventoryRecord(InventoryRecordData, menuIds) {
      if (this.dialogTitle === '新增角色') {
        const InventoryRecordDto = {
          InventoryRecordType: InventoryRecordData.InventoryRecordType,
          InventoryRecordName: InventoryRecordData.InventoryRecordName,
          Remark: InventoryRecordData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("InventoryRecord", JSON.stringify(InventoryRecordDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/InventoryRecord/InsertInventoryRecord', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
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
      }
      else if (this.dialogTitle === '编辑角色') {
        const InventoryRecordDto = {
          InventoryRecordId: InventoryRecordData.InventoryRecordId,
          InventoryRecordType: InventoryRecordData.InventoryRecordType,
          InventoryRecordName: InventoryRecordData.InventoryRecordName,
          Remark: InventoryRecordData.Remark
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("InventoryRecord", JSON.stringify(InventoryRecordDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/InventoryRecord/UpdateInventoryRecord', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
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
      }
      // 确认添加或编辑角色的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditInventoryRecordDialog(InventoryRecord) {
      // 显示编辑角色对话框的逻辑
      this.dialogTitle = '编辑角色';
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("InventoryRecordId", InventoryRecord.InventoryRecordId);
      this.$axios.post(this.$httpUrl + '/InventoryRecord/GetMenuByInventoryRecordId', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuIds = this.extractIdsFromMenu(data);
            this.addEditDialogVisible = true;
            this.selectedInventoryRecord = InventoryRecord;

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
    extractIdsFromMenu(menuData) {
      let ids = [];
      menuData.forEach(item => {
        ids.push(parseInt(item.Id)); // 添加当前菜单项的Id
        if (item.Children && item.Children.length > 0) {
          // 如果有子菜单，递归调用
          ids = ids.concat(this.extractIdsFromMenu(item.Children));
        }
      });
      return ids;
    },
    cancelAddEditInventoryRecord() {
      // 取消添加或编辑角色的逻辑
      this.dialogVisible = false;
    },
    handleDeleteInventoryRecord(InventoryRecordData) {
      const InventoryRecordDto = {
        InventoryRecordId: InventoryRecordData.InventoryRecordId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("InventoryRecord", JSON.stringify(InventoryRecordDto));
      this.$axios.post(this.$httpUrl + '/InventoryRecord/DeleteInventoryRecord', UserFormData)
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
  }
}
</script>