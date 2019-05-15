<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyAccidentHandle" :columns="columns" ref="table">
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="info" plain  class="self-btn self-feedback" @click="showDeal(slotProps.selected)"></el-button>
            </template>
            <template slot="ResultMsg" slot-scope="scope">
                <el-tag v-if="scope.row.accidentResult==='0'"
                        close-transition type="danger">未完成</el-tag>
                <el-tag v-if="scope.row.accidentResult==='1'"
                        close-transition>完成</el-tag>
            </template>
        </CommonCRUD>

        <el-dialog
            v-if="dialogVisibleDeal"
            :title="Dealtitle"
            :visible.sync="dialogVisibleDeal"
            width="50%"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form"  label-width="100px" class="demo-ruleForm">
                <el-form-item >
                    <el-input v-model="form.accidentId" type="hidden"></el-input>
                </el-form-item>
                <el-form-item label="处理完成情况"  id="t1">

                    <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionGrade" style="width: 400px;"></el-input>

                </el-form-item>
                <el-form-item label="处理结果描述" >
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionResult" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="附件" >
                    <CommonUpload :value="form.enclosure" @getValue="form.enclosure = $event"></CommonUpload>

                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
            </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import CommonUpload from '@/components/UpLoad';
    export default {
        name: 'EmergencyAccidentHandle',
        data() {
            return {
                formColumns :{},
                columns: [],
                dialogVisibleDeal:false,
                Dealtitle:'提交处理结果',
                form:{accidentId:'',solutionGrade:'',solutionResult:'',enclosure:''},
                submitLoading: false,
                apiRootDeal: '/identity/emergencyAccidentResult'

            }
        },
        methods: {
            showDeal(val) {
                if (val.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: val.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                if(val[0].accidentResult == 1){
                    this.$message({
                        type: 'warning',
                        message: '处理已完成'
                    });
                    return false;
                }
                this.selectedForm = val[0]
                this.form.accidentId = val[0].accidentId
                this.dialogVisibleDeal = true
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.dialogVisibleDeal = false;
                        done();
                    })
                    .catch(_ => {});
            },
            submit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$nextTick(() => {
                            let type = 'Post';
                            let path = `${this.apiRootDeal}`+'/';
                            this.$http(type, path, Object.assign({}, this.form)).then(() => {
                                this.submitLoading = false;
                                this.dialogVisibleDeal = false;
                                this.$refs.table.refreshTableData();

                                this.form = {};
                            });
                        })
                    } else {
                        this.dialogVisibleDeal = true;
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            timeTransfer() {
                this.columns.forEach(item => {
                    if(item.name == 'createdAt'){
                        item.formatter = (row, cell,val,index) => {
                            var timeF =  row.modifiedAt.substr(0,10)
                            return timeF
                        }
                }
                });
            }
        },
        components: {
            CommonUpload,
            CommonCRUD
        },
        created () {
            this.columns = []
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1
            this.columns = temp
            var columsItems2 = {slot:true,name:'accidentResult',des:'处理结果',slotName:'ResultMsg'}
            this.columns.push(columsItems2)
            this.timeTransfer();
        }
    };
</script>

<style scoped>

</style>
