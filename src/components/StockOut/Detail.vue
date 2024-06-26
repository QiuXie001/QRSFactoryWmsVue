<template>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" @close="cancelDetail">
        <h5>订单号：{{ StockOut.StockOutNo }}</h5>
        <el-table :data="detailStockOutDetail" border style="width: 100%">
            <el-table-column prop="Tool" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="MaterialNo" label="物料编号"></el-table-column>
            <el-table-column prop="MaterialName" label="物料名称"></el-table-column>
            <el-table-column prop="Status" label="状态"></el-table-column>
            <el-table-column prop="PlanOutQty" label="计划出库"></el-table-column>
            <el-table-column prop="ActOutQty" label="实际出库"></el-table-column>
            <el-table-column prop="Remark" label="备注"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleAdd">新增</el-button>
            <el-button @click="cancelDetail">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>

export default {
    name: 'Detail', 
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        StockOut: {
            type: Object,
            default: () => ({})
        },
        StockOutDetail: {
            type: Array,
            default: () => []
        },

    },
    data() {
        return {
            dialogVisible: this.visible,
            detailStockOutDetail: this.StockOutDetail
        }
    },
    watch: {
        visible(newValue) {
            this.dialogVisible = newValue;
        },
        StockOut(newValue) {
            this.StockOut = newValue;
        },
        StockOutDetail(newValue) {
            this.detailStockOutDetail = newValue;
        }
    },
    methods: {
        init() {
            const DetailFormData = new FormData();
            DetailFormData.append("token", this.$store.state.token);
            DetailFormData.append("userId", this.$store.state.user.UserId);
            DetailFormData.append("pid", this.StockOut.StockOutId);
            this.$axios.post(this.$httpUrl + '/StockOut/ListDetail', DetailFormData)
                .then(response => {
                    const data = response.data;
                    if (data) {
                        this.selectedStockOutDetail = data.rows;
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
        handleAdd() {
            this.$emit('update:addVisible', true);
        },
        confirmAdd(StockOutDataDetail) {
            const DetailDto = {
                StockOutId: StockOutDataDetail.StockOutId,
                StockOutType: StockOutDataDetail.StockOutType,
                StockOutName: StockOutDataDetail.StockOutName,
                Remark: StockOutDataDetail.Remark
            };
            const DetailFormData = new FormData();
            DetailFormData.append("token", this.$store.state.token);
            DetailFormData.append("userId", this.$store.state.user.UserId);
            DetailFormData.append("model", JSON.stringify(DetailDto));
            DetailFormData.append("id", this.StockOut.StockOutId);
            this.$axios.post(this.$httpUrl + '/StockOut/AddOrUpdateDetail', DetailFormData)
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
        },
        handleDelete() {

        },
        cancelDetail() {
            this.$emit('update:visible', false);
        }
    }
}
</script>