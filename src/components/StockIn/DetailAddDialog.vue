<template>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false" @close="cancelDetail">
        <el-form :model="dialogStockInDetail" :rules="rules" ref="StockInDetailForm">
            <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
                <el-input v-if="field.type === 'input'" v-model="dialogStockInDetail[field.prop]"></el-input>
                <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
                    v-model="dialogStockInDetail[field.prop]">
                </el-input>
                <el-select v-if="field.type === 'select' && field.label === '物料名称'" v-model="dialogStockInDetail[field.prop]"
                    placeholder="请选择物料">
                    <el-option v-for="(key, value) in MaterialList" :key="value" :label="key"
                        :value="value"></el-option>
                </el-select>
                <el-input-number v-if="field.type === 'number'" v-model="dialogStockInDetail[field.prop]" :min="1"
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
        StockIn: {
            type: Object,
            default: () => ({})
        },
        StockInDetail: {
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
            dialogStockIn: this.StockIn,
            dialogStockInDetail: this.StockInDetail,
            dialogMaterialList: this.MaterialList,
            rules: {
                StockInName: [
                    { required: true, message: '请输入入库名称', trigger: 'blur' }
                ],
                StockInType: [
                    { required: true, message: '请输入入库类型', trigger: 'blur' }
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
                    prop: 'PlanInQty',
                    label: '计划入库数量',
                    type: 'number',
                },
                {
                    prop: 'ActInQty',
                    label: '实际入库数量',
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
        StockIn(newValue) {
            this.dialogStockIn = newValue;
        },
        StockInDetail(newValue) {
            this.dialogStockInDetail = newValue;
        },
        MaterialList(newValue) {
            this.dialogMaterialList = newValue;
        }
    },
    methods: {
        confirmAction() {
            // 确认添加或编辑入库的逻辑
            this.$refs.StockInDetailForm.validate(valid => {
                if (valid) {
                    this.dialogStockInDetail = {
                        ...this.dialogStockInDetail,
                        StockInId: this.dialogStockIn.StockInId,
                    };
                    console.log(this.dialogStockInDetail);
                    this.$emit('confirmAction', this.dialogStockInDetail);
                    this.cancelDetail();
                } else {
                    // 验证不通过，提示用户
                    this.$message.error('请填写必填项');
                }
            })
        },
        cancelDetail() {
            // 重置表单的逻辑
            this.dialogStockInDetail = {};
            this.$emit('update:visible', false);
        }
    }
}
</script>
