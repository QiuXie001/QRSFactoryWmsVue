<template>
  <div>
    <Search @search="handleSearch" @addMaterial="showAddMaterialDialog" />
    <MaterialList :rows="MaterialList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editMaterial="showEditMaterialDialog" @deleteMaterial="handleDeleteMaterial" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :Material="selectedMaterial"
      :formFields="formFields" :materialTypeList="materialTypeList" :unitList="unitList" :warehouseList="warehouseList"
      :reservoirAreaList="reservoirAreaList" :storagerackList="storagerackList" @confirmAction="confirmAddEditMaterial"
      @cancel="cancelAddEditMaterial" />
  </div>
</template>

<script>
import Search from './Search';
import MaterialList from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Material',
  components: {
    Search,
    MaterialList,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      MaterialList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedMaterial: {},
      materialTypeList: {},
      unitList: {},
      storagerackList: {},
      reservoirAreaList: {},
      warehouseList: {},
      formFields: [
        {
          prop: 'MaterialNo',
          label: '物料编号',
          type: 'input',
        },
        {
          prop: 'MaterialName',
          label: '物料名称',
          type: 'input',
        },
        {
          prop: 'MaterialType',
          label: '物料类型',
          type: 'select',
        }, {
          prop: 'UnitType',
          label: '单位',
          type: 'select',
        }, {
          prop: 'WarehouseId',
          label: '所属仓库',
          type: 'select',
        }, {
          prop: 'ReservoirAreaId',
          label: '所属库区',
          type: 'select',
        }, {
          prop: 'StoragerackId',
          label: '所属货架',
          type: 'select',
        }, {
          prop: 'ExpiryDate',
          label: '有效期',
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

      this.$axios.post(this.$httpUrl + '/Material/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.MaterialList = data.rows; // 假设data.rows是你的物料列表
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
      const UnitFormData = new FormData();
      UnitFormData.append("token", this.$store.state.token);
      UnitFormData.append("userId", this.$store.state.user.UserId);
      UnitFormData.append("type", "1");
      this.$axios.post(this.$httpUrl + '/Material/GetDictListByType', UnitFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.unitList = data; // 假设data.rows是你的物料列表

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

      const MaterialTypeFormData = new FormData();
      MaterialTypeFormData.append("token", this.$store.state.token);
      MaterialTypeFormData.append("userId", this.$store.state.user.UserId);
      MaterialTypeFormData.append("type", "2");
      this.$axios.post(this.$httpUrl + '/Material/GetDictListByType', MaterialTypeFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.materialTypeList = data; // 假设data.rows是你的物料列表

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
            this.warehouseList = data; // 假设data.rows是你的物料列表

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
            this.reservoirAreaList = data; // 假设data.rows是你的物料列表
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
      const StorageRackFormData = new FormData();
      StorageRackFormData.append("token", this.$store.state.token);
      StorageRackFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/StorageRack/GetStorageRackList', StorageRackFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.storagerackList = data; // 假设data.rows是你的物料列表
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
      this.parmas.search = searchData.MaterialName;
      this.init();
    },
    showAddMaterialDialog() {
      // 显示新增物料对话框的逻辑
      this.dialogTitle = '新增物料';
      this.selectedMaterial = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditMaterial(MaterialData) {
      if (this.dialogTitle === '新增物料') {
        const MaterialDto = {
          MaterialNo: MaterialData.MaterialNo,
          MaterialName: MaterialData.MaterialName,
          MaterialTypeId: MaterialData.MaterialTypeId,
          UnitId: MaterialData.UnitId,
          WarehouseId: MaterialData.WarehouseId,
          StoragerackId: MaterialData.StorageRackId,
          ReservoirAreaId: MaterialData.ReservoirAreaId,
          ExpiryDate: MaterialData.ExpiryDate,
          Remark: MaterialData.Remark,

          Qty: 0,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(MaterialDto));
        this.$axios.post(this.$httpUrl + '/Material/AddOrUpdate', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
              this.init();
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
      else if (this.dialogTitle === '编辑物料') {
        const MaterialDto = {
          MaterialNo: MaterialData.MaterialNo,
          MaterialName: MaterialData.MaterialName,
          MaterialTypeId: MaterialData.MaterialTypeId,
          UnitId: MaterialData.UnitId,
          WarehouseId: MaterialData.WarehouseId,
          StoragerackId: MaterialData.StorageRackId,
          ReservoirAreaId: MaterialData.ReservoirAreaId,
          ExpiryDate: MaterialData.ExpiryDate,
          Remark: MaterialData.Remark,

        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(MaterialDto));
        UserFormData.append("id", MaterialData.MaterialId);
        this.$axios.post(this.$httpUrl + '/Material/AddOrUpdate', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
              this.init();
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
      // 确认添加或编辑物料的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditMaterialDialog(Material) {
      // 显示编辑物料对话框的逻辑
      this.dialogTitle = '编辑物料';
      this.selectedMaterial = Material;
      this.addEditDialogVisible = true;
    },

    cancelAddEditMaterial() {
      // 取消添加或编辑物料的逻辑
      this.dialogVisible = false;
    },
    handleDeleteMaterial(MaterialData) {
      const MaterialDto = {
        MaterialId: MaterialData.MaterialId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("Material", JSON.stringify(MaterialDto));
      this.$axios.post(this.$httpUrl + '/Material/DeleteMaterial', UserFormData)
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