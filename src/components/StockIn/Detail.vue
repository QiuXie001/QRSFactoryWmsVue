<template>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" @close="cancelDetail">
        <h5>订单号：{{ StockIn.StockInNo }}</h5>
        <el-table :data="detailStockInDetail" border style="width: 100%">
            <el-table-column prop="Tool" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="MaterialNo" label="物料编号"></el-table-column>
            <el-table-column prop="MaterialName" label="物料名称"></el-table-column>
            <el-table-column prop="Status" label="状态"></el-table-column>
            <el-table-column prop="PlanInQty" label="计划入库"></el-table-column>
            <el-table-column prop="ActInQty" label="实际入库"></el-table-column>
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
        StockIn: {
            type: Object,
            default: () => ({})
        },
        StockInDetail: {
            type: Array,
            default: () => []
        },

    },
    data() {
        return {
            dialogVisible: this.visible,
            detailStockInDetail: this.StockInDetail
        }
    },
    watch: {
        visible(newValue) {
            this.dialogVisible = newValue;
        },
        StockIn(newValue) {
            this.StockIn = newValue;
        },
        StockInDetail(newValue) {
            this.detailStockInDetail = newValue;
        }
    },
    methods: {
        init() {
            const DetailFormData = new FormData();
            DetailFormData.append("token", this.$store.state.token);
            DetailFormData.append("userId", this.$store.state.user.UserId);
            DetailFormData.append("pid", this.StockIn.StockInId);
            this.$axios.post(this.$httpUrl + '/StockIn/ListDetail', DetailFormData)
                .then(response => {
                    const data = response.data;
                    if (data) {
                        this.selectedStockInDetail = data.rows;
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
        confirmAdd(StockInDataDetail) {
            const DetailDto = {
                StockInId: StockInDataDetail.StockInId,
                StockInType: StockInDataDetail.StockInType,
                StockInName: StockInDataDetail.StockInName,
                Remark: StockInDataDetail.Remark
            };
            const DetailFormData = new FormData();
            DetailFormData.append("token", this.$store.state.token);
            DetailFormData.append("userId", this.$store.state.user.UserId);
            DetailFormData.append("model", JSON.stringify(DetailDto));
            DetailFormData.append("id", this.StockIn.StockInId);
            this.$axios.post(this.$httpUrl + '/StockIn/AddOrUpdateDetail', DetailFormData)
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