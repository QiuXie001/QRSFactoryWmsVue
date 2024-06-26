<template>
  <div>
    <Search @search="handleSearch" @addStorageRack="showAddStorageRackDialog" />
    <StorageRackList :rows="storageRackList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editStorageRack="showEditStorageRackDialog" @deleteStorageRack="handleDeleteStorageRack" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :storageRack="selectedStorageRack"
      :formFields="formFields" :reservoirAreaList="reservoirAreaList" :warehouseList="warehouseList"  @confirmAction="confirmAddEditStorageRack"
      @cancel="cancelAddEditStorageRack" />
  </div>
</template>

<script>
import Search from './Search';
import StorageRackList from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'StorageRack',
  components: {
    Search,
    StorageRackList,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      storageRackList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedStorageRack: {},
      reservoirAreaList:{},
      warehouseList: {},
      formFields: [
        {
          prop: 'StorageRackNo',
          label: '货架编号',
          type: 'input',
        },
        {
          prop: 'StorageRackName',
          label: '货架名称',
          type: 'input',
        },
        {
          prop: 'WarehouseId',
          label: '所属仓库',
          type: 'select',
        },
        {
          prop: 'ReservoirAreaId',
          label: '所属库区',
          type: 'select',
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

      this.$axios.post(this.$httpUrl + '/StorageRack/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.storageRackList = data.rows; // 假设data.rows是你的货架列表
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
      const WarehouseFormData = new FormData();
      WarehouseFormData.append("token", this.$store.state.token);
      WarehouseFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/Warehouse/GetWarehouseList', WarehouseFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.warehouseList = data; // 假设data.rows是你的货架列表
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
        const ReservoirAreaFormData = new FormData();
      ReservoirAreaFormData.append("token", this.$store.state.token);
      ReservoirAreaFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/StorageRack/GetReservoirareaList', ReservoirAreaFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.reservoirAreaList = data; // 假设data.rows是你的货架列表
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
      this.parmas.search = searchData.StorageRackName;
      this.init();
    },
    showAddStorageRackDialog() {
      // 显示新增货架对话框的逻辑
      this.dialogTitle = '新增货架';
      this.selectedStorageRack = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditStorageRack(StorageRackData) {
      if (this.dialogTitle === '新增货架') {
        const StorageRackDto = {
          StorageRackNo: StorageRackData.StorageRackNo,
          StorageRackName: StorageRackData.StorageRackName,
          WarehouseId: StorageRackData.WarehouseId,
          ReservoirAreaId: StorageRackData.ReservoirAreaId,
          Remark: StorageRackData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(StorageRackDto));
        this.$axios.post(this.$httpUrl + '/StorageRack/AddOrUpdate', UserFormData)
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
      else if (this.dialogTitle === '编辑货架') {
        const StorageRackDto = {
          StorageRackId: StorageRackData.StorageRackId,
          StorageRackNo: StorageRackData.StorageRackNo,
          StorageRackName: StorageRackData.StorageRackName,
          WarehouseId: StorageRackData.WarehouseId,
          ReservoirAreaId: StorageRackData.ReservoirAreaId,
          Remark: StorageRackData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(StorageRackDto));
        UserFormData.append("Id", StorageRackData.StorageRackId);

        this.$axios.post(this.$httpUrl + '/StorageRack/AddOrUpdate', UserFormData)
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
      // 确认添加或编辑货架的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditStorageRackDialog(StorageRack) {
      // 显示编辑货架对话框的逻辑
      this.dialogTitle = '编辑货架';
      this.addEditDialogVisible = true;
      this.selectedStorageRack = StorageRack;
    },
    
    cancelAddEditStorageRack() {
      // 取消添加或编辑货架的逻辑
      this.dialogVisible = false;
    },
    handleDeleteStorageRack(StorageRackData) {
      const StorageRackDto = {
        StorageRackId: StorageRackData.StorageRackId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("StorageRack", JSON.stringify(StorageRackDto));
      this.$axios.post(this.$httpUrl + '/StorageRack/Delete', UserFormData)
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