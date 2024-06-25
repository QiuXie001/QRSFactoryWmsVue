<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogMenu" :rules="rules" ref="menuForm">
      <el-row v-for="field in formFields" :key="field.prop" type="flex" align="middle">
        <el-col :span="4">{{ field.label }}</el-col>
        <el-col :span="16" :offset="2">
          <el-form-item :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="dialogMenu[field.prop]" :style="getInputStyle(field)">
              <template v-if="field.prefix && title !== '编辑菜单'" slot="prefix">{{ field.prefix }}</template>
              <!-- 图标备注前缀 -->

            </el-input>

            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="dialogMenu[field.prop]"></el-input>
            <el-input-number v-if="field.type === 'number'" v-model="dialogMenu[field.prop]" :min="1"
              :default-value="field.defaultValue"></el-input-number>
            <el-select v-if="field.type === 'select'" v-model="dialogMenu[field.prop]" placeholder="请选择父菜单">
              <el-option label="无" :value='-1'></el-option>
              <el-option v-for="menuItem in parentMenuList" :key="menuItem.MenuId" :label="menuItem.MenuName"
                :value="menuItem.MenuId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="confirmAction">确定</el-button>
    </span>
  </el-dialog>
</template>


<script>
export default {
  name: 'AddEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    menu: {
      type: Object,
      default: () => ({})
    },
    parentMenuList: {
      type: Array,
      default: () => []
    },
  },
  computed: {
  },
  data() {
    return {
      options: [{


      }],
      rules: {
        MenuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        MenuType: [
          { required: true, message: '请输入菜单类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogMenu: Object,
      dialogParentMenuList: this.parentMenuList,
      formFields: [
        {
          prop: 'MenuName',
          label: '菜单名称',
          type: 'input',
        }, {
          prop: 'MenuType',
          label: '菜单类型',
          type: 'input',
        }, {
          prop: 'MenuUrl',
          label: '菜单路径',
          type: 'input',
        }, {
          prop: 'MenuIcon',
          label: '图标',
          type: 'input',
          prefix: 'iconfont icon-',
        }, {
          prop: 'MenuParent',
          label: '父菜单',
          type: 'select',
        }, {
          prop: 'Sort',
          label: '展示顺序',
          type: 'number',
          defaultValue: 1,
        }, {
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
    }
  },
  watch: {
    visible(newValue) {
      this.dialogVisible = newValue;
    },
    title(newValue) {
      this.dialogTitle = newValue;
    },
    menu(newValue) {
      this.dialogMenu = newValue;
    },
    parentMenuList(newValue) {
      this.dialogParentMenuList = newValue;
    },

  },
  created() {
    this.dialogMenu = this.menu;
    this.dialogParentMenuList = this.parentMenuList;
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getInputStyle(field) {
      if (this.title !== '编辑菜单') {
        switch (field.label) {
          case '图标':
            return {
              'padding-left': '100px',
              'width': '210px'
            };
          // case '菜单路径':
          //   return {
          //     'padding-left': '20px',
          //     'width': '290px'
          //   };

          default:
            return '';
        }
      }
    },
    getInputPrefix(fieldName) {
      switch (fieldName) {
        case 'MenuIcon':
          return 'iconfont icon-'; // 假设这是图标字段的前缀
        case '/':
          return ''; 
        default:
          return '';
      }
    },
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (this.title === '新增菜单') {
            this.dialogMenu.MenuUrl = this.getInputPrefix('MenuUrl') + this.dialogMenu.MenuUrl;
            this.dialogMenu.MenuIcon = this.getInputPrefix('MenuIcon') + this.dialogMenu.MenuIcon;
          }
          this.$emit('confirmAction', this.dialogMenu);

          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      this.$emit('update:visible', false);
      this.dialogMenu = {};
    }
  }
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