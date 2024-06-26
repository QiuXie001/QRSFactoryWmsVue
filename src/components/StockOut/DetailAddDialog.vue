<template>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false" @close="cancelDetail">
        <el-form :model="dialogStockOutDetail" :rules="rules" ref="StockOutDetailForm">
            <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
                <el-input v-if="field.type === 'input'" v-model="dialogStockOutDetail[field.prop]"></el-input>
                <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
                    v-model="dialogStockOutDetail[field.prop]">
                </el-input>
                <el-select v-if="field.type === 'select' && field.label === '物料名称'" v-model="dialogStockOutDetail[field.prop]"
                    placeholder="请选择物料">
                    <el-option v-for="(key, value) in MaterialList" :key="value" :label="key"
                        :value="value"></el-option>
                </el-select>
                <el-input-number v-if="field.type === 'number'" v-model="dialogStockOutDetail[field.prop]" :min="1"
                    :default-value="field.defaultValue"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDetail">取消</el-button>
            <el-button type="primary" @click="confirmAction">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'DetailAddDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        StockOut: {
            type: Object,
            default: () => ({})
        },
        StockOutDetail: {
            type: Object,
            default: () => ({})
        },
        MaterialList: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            dialogVisible: this.visible,
            dialogTitle: this.title,
            dialogStockOut: this.StockOut,
            dialogStockOutDetail: this.StockOutDetail,
            dialogMaterialList: this.MaterialList,
            rules: {
                StockOutName: [
                    { required: true, message: '请输入出库名称', trigger: 'blur' }
                ],
                StockOutType: [
                    { required: true, message: '请输入出库类型', trigger: 'blur' }
                ],
                // 如果备注是可选的，可以不添加规则
                Remark: []
            },
            formFields: [
                {
                    prop: 'MaterialId',
                    label: '物料名称',
                    type: 'select',
                },
                {
                    prop: 'PlanOutQty',
                    label: '计划出库数量',
                    type: 'number',
                },
                {
                    prop: 'ActOutQty',
                    label: '实际出库数量',
                    type: 'number',
                },
                {
                    prop: 'Remark',
                    label: '备注',
                    type: 'textarea',
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
        StockOut(newValue) {
            this.dialogStockOut = newValue;
        },
        StockOutDetail(newValue) {
            this.dialogStockOutDetail = newValue;
        },
        MaterialList(newValue) {
            this.dialogMaterialList = newValue;
        }
    },
    methods: {
        confirmAction() {
            // 确认添加或编辑出库的逻辑
            this.$refs.StockOutDetailForm.validate(valid => {
                if (valid) {
                    this.dialogStockOutDetail = {
                        ...this.dialogStockOutDetail,
                        StockOutId: this.dialogStockOut.StockOutId,
                    };
                    console.log(this.dialogStockOutDetail);
                    this.$emit('confirmAction', this.dialogStockOutDetail);
                    this.cancelDetail();
                } else {
                    // 验证不通过，提示用户
                    this.$message.error('请填写必填项');
                }
            })
        },
        cancelDetail() {
            // 重置表单的逻辑
            this.dialogStockOutDetail = {};
            this.$emit('update:visible', false);
        }
    }
}
</script>
