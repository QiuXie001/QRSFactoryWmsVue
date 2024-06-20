<template>
  <div>
    <div>
      <!-- 新增按钮 -->
      <el-button type="primary" @click="dialogVisible = true, handleAdd()">新增角色</el-button>

      <!-- 对话框 -->
      <el-dialog :visible.sync="insertDialogVisible" title="新增角色">
        <el-form :model="newRole" ref="newRoleForm">
          <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="newRole[field.prop]"></el-input>
            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="newRole[field.prop]"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" prop="menuIds">
            <div class="rounded-checkbox-group">
              <el-checkbox-group v-model="menuIds">
                <el-checkbox v-for="menu in menuList" :label="menu.MenuId" :key="menu.MenuId"
                  @change="toggleChildren(menu), handleParentChange(menu)">
                  {{ menu.MenuName }}
                  <div class="children" v-if="menu.expanded && menu.Children && menu.Children.length > 0">
                    <el-checkbox v-for="child in menu.Children" :label="child.MenuId" :key="child.MenuId">
                      {{ child.MenuName }}
                    </el-checkbox>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="insertDialogVisible = false, init()">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="editDialogVisible" title="修改角色">
        <el-form :model="newRole" ref="newRoleForm">
          <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="newRole[field.prop]"></el-input>
            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="newRole[field.prop]"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" prop="menuIds">
            <div class="rounded-checkbox-group">
              <el-checkbox-group v-model="menuIds">
                <el-checkbox v-for="menu in menuList" :label="menu.MenuId" :key="menu.MenuId"
                  @change="toggleChildren(menu), handleParentChange(menu)">
                  {{ menu.MenuName }}
                  <div class="children" v-if="menu.expanded && menu.Children && menu.Children.length > 0">
                    <el-checkbox v-for="child in menu.Children" :label="child.MenuId" :key="child.MenuId">
                      {{ child.MenuName }}
                    </el-checkbox>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false, init()">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </el-dialog>

    </div>
    <el-table :data="rows" border style="width: 100% ;margin-top: 10px">
      <el-table-column prop="Tool" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="RoleType" label="角色类型"></el-table-column>
      <el-table-column prop="RoleName" label="角色名称"></el-table-column>
      <el-table-column prop="CreateDate" label="创建日期" :formatter="formatDate"></el-table-column>
      <el-table-column prop="ModifiedDate" label="修改日期" :formatter="formatDate"></el-table-column>
      <el-table-column prop="IsDel" label="是否启用" :formatter="formatIsDel"></el-table-column>
    </el-table>
    <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize" :total="total"
      layout="total, prev, pager, next, jumper" style="margin-top: 10px">
    </el-pagination>
  </div>

</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      currentPage: 1, // 当前页码
      pageSize: 8, // 每页显示的行数
      total: 0, // 总行数
      insertDialogVisible: false,
      editDialogVisible: false,
      formFields: [
        {
          prop: 'RoleName',
          label: '角色名称',
          type: 'input',
        },
        {
          prop: 'RoleType',
          label: '角色类型',
          type: 'input',
        },
        {
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
      newRole: {
        RoleType: null,
        RoleName: null,
        Remark: null
      },
      menuIds: [],
      menuList: []
    }
  },
  computed: {
    rows() {
      return this.$store.state.things.rows;
    }
  },
  methods: {
    init() {
      this.menuIds = [];
      const params = {
        offset: (this.currentPage - 1) * this.pageSize, // 或者 (页码 - 1) * 每页显示的行数
        limit: 8, // 每页显示的行数
        sort: 'CreateDate', // 排序字段
        order: 'desc', // 排序方式
        search: null, // 搜索关键词
        _: Date.now(), // 时间戳或随机数
        datemin: '2023-01-01', // 日期范围搜索的最小日期
        datemax: null, // 日期范围搜索的最大日期
        keyword: null // 额外的搜索关键词
      };
      const UserFormData = new FormData();
      UserFormData.append("bootstrap", JSON.stringify(params));
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      this.$axios.post(this.$httpUrl + '/Role/GetPageList', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.total = data.total;
            this.$store.commit('setThings', data);
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
    initFormFields() {
      this.formFields = Object.keys(this.$store.state.dto).map(key => {
        return {
          prop: key,
          label: key,
          type: 'input',
        };
      });
    },
    toggleChildren(menu) {
      menu.expanded = !menu.expanded;
    },
    handleParentChange(menu) {

      if (this.menuIds.includes(menu.MenuId)) {
        menu.Children.forEach(child => {
          if (!this.menuIds.includes(child.MenuId)) {
            this.menuIds.push(child.MenuId);
          }
        });
      } else {
        // 如果父菜单被取消选中，关闭子菜单并取消选中子菜单
        menu.expanded = false;
        menu.Children.forEach(child => {
          const index = this.menuIds.indexOf(child.MenuId);
          if (index !== -1) {
            this.menuIds.splice(index, 1);
          }
        });
      }
    },
    formatIsDel(row, column, cellValue) {
      return cellValue === 1 ? "是" : "否";
    },
    formatDate(row, column, cellValue) {
      return new Date(cellValue).toLocaleString();
    },
    handleEdit(index, row) {
      this.newRole = { ...row }; // 填充表单
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
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
      UserFormData.append("roleId", row.RoleId);
      this.$axios.post(this.$httpUrl + '/Role/GetMenuByRoleId', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            console.log();
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
      this.editDialogVisible = true; // 显示对话框
    },
    confirmEdit() {
      // 验证表单
      this.$refs.newRoleForm.validate(async valid => {
        if (valid) {
          // 构建请求参数
          const roleDto = {
            RoleType: this.newRole.RoleType,
            RoleName: this.newRole.RoleName,
            Remark: this.newRole.Remark
          };
          const UserFormData = new FormData();
          UserFormData.append("token", this.$store.state.token);
          UserFormData.append("userId", this.$store.state.user.UserId);
          UserFormData.append("role", JSON.stringify(roleDto));
          UserFormData.append("menuId", this.menuIds.join(','));

          // 调用更新角色的接口
          try {
            const response = await this.$axios.post(this.$httpUrl + '/Role/UpdateRole', UserFormData);
            const data = response.data;
            if (data.Item1) {
              this.$message.success(data.Item2);
              this.dialogVisible = false;
              this.init(); // 重新加载角色列表
            } else {
              this.$message.error(data.Item2);
            }
          } catch (error) {
            this.$message.error(error);
          }
        } else {
          this.$message.error('请填写必要的表单字段');
        }
      });
    },
    handleDelete(index, row) {
      // 实现删除逻辑
      console.log('删除', index, row);
    },
    handleAdd() {

      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      this.$axios.post(this.$httpUrl + '/Menu/GetMenus', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuList = data.rows;
            this.insertDialogVisible = true;
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
    confirmAdd() {
      this.$refs.newRoleForm.validate(valid => {
        if (valid) {
          const roleDto = {
            RoleType: this.newRole.RoleType,
            RoleName: this.newRole.RoleName,
            Remark: this.newRole.Remark
          };
          const newRole = createEmptySysRole(this.$store.state.things);
          this.$store.commit('setDto', newRole);
          const UserFormData = new FormData();
          UserFormData.append("token", this.$store.state.token);
          UserFormData.append("userId", this.$store.state.user.UserId);
          UserFormData.append("role", JSON.stringify(roleDto));
          UserFormData.append("menuId", this.menuIds);
          console.log(roleDto);
          this.$axios.post(this.$httpUrl + '/Role/InsertRole', UserFormData)
            .then(response => {
              const data = response.data;
              if (data.Item1) {
                this.$message({
                  type: 'success',
                  message: data.Item2
                });
                this.dialogVisible = false;
                this.$refs.newRoleForm.resetFields();
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
        } else {
          this.$message.error('请填写必要的表单字段');
          return false;
        }
      });
    }
  },
  created() {
    this.init();
  }
};
function createEmptySysRole(things) {
  const emptyRole = things.rows[0];
  for (const key in things.rows[0]) {
    emptyRole[key] = null;
  }
  return emptyRole;
}
</script>

<style scoped>
.rounded-checkbox-group {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.rounded-checkbox-group .el-checkbox {
  margin-bottom: 10px;
}

.el-checkbox {
  display: flex;
}

.children {
  margin-top: 10px;
}
</style>
