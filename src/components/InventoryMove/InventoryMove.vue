<template>
  <div>
    <Search @search="handleSearch" @addInventorymove="showAddInventorymoveDialog" />
    <InventorymoveList :rows="InventorymoveList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editInventorymove="showEditInventorymoveDialog" @deleteInventorymove="handleDeleteInventorymove" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :Inventorymove="selectedInventorymove"
      :formFields="formFields" :menuList="menuList" :menuIds="menuIds" @confirmAction="confirmAddEditInventorymove"
      @cancel="cancelAddEditInventorymove" />
  </div>
</template>

<script>
import Search from './Search';
import InventorymoveList from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Inventorymove',
  components: {
    Search,
    InventorymoveList,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      InventorymoveList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedInventorymove: {},
      menuIds: [],
      menuList: [],
      formFields: [
        {
          prop: 'InventorymoveNo',
          label: '移库单编号',
          type: 'input',
        },
        {
          prop: 'SourceStoragerackId',
          label: '源货架',
          type: 'input',
        },
        {
          prop: 'AimStoragerackId',
          label: '目标货架',
          type: 'input',
        },
        {
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

      this.$axios.post(this.$httpUrl + '/Inventorymove/GetPageList', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.InventorymoveList = data.rows; // 假设data.rows是你的承运商列表
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
      this.parmas.search = searchData.InventorymoveName;
      this.init();
    },
    showAddInventorymoveDialog() {
      // 显示新增承运商对话框的逻辑
      this.dialogTitle = '新增承运商';
      this.selectedInventorymove = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditInventorymove(InventorymoveData, menuIds) {
      if (this.dialogTitle === '新增承运商') {
        const InventorymoveDto = {
          InventorymoveId : InventorymoveData.InventorymoveId,
          InventorymoveName: InventorymoveData.InventorymoveName,
          InventorymoveLevel: InventorymoveData.InventorymoveLevel,
          InventorymovePerson: InventorymoveData.InventorymovePerson,
          
          Remark: InventorymoveData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Inventorymove", JSON.stringify(InventorymoveDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/Inventorymove/InsertInventorymove', UserFormData)
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
      else if (this.dialogTitle === '编辑承运商') {
        const InventorymoveDto = {
          InventorymoveId : InventorymoveData.InventorymoveId,
          InventorymoveName: InventorymoveData.InventorymoveName,
          InventorymoveLevel: InventorymoveData.InventorymoveLevel,
          InventorymovePerson: InventorymoveData.InventorymovePerson,
          Remark: InventorymoveData.Remark
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Inventorymove", JSON.stringify(InventorymoveDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/Inventorymove/UpdateInventorymove', UserFormData)
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
      // 确认添加或编辑承运商的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditInventorymoveDialog(Inventorymove) {
      // 显示编辑承运商对话框的逻辑
      this.dialogTitle = '编辑承运商';
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("InventorymoveId", Inventorymove.InventorymoveId);
      this.$axios.post(this.$httpUrl + '/Inventorymove/GetMenuByInventorymoveId', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuIds = this.extractIdsFromMenu(data);
            this.addEditDialogVisible = true;
            this.selectedInventorymove = Inventorymove;

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
    cancelAddEditInventorymove() {
      // 取消添加或编辑承运商的逻辑
      this.dialogVisible = false;
    },
    handleDeleteInventorymove(InventorymoveData) {
      const InventorymoveDto = {
        InventorymoveId: InventorymoveData.InventorymoveId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("Inventorymove", JSON.stringify(InventorymoveDto));
      this.$axios.post(this.$httpUrl + '/Inventorymove/DeleteInventorymove', UserFormData)
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