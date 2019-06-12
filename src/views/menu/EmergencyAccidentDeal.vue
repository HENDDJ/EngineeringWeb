<template>
    <section>
        <CommonCRUD  :columns="columns" apiRoot="/identity/emergencyAccident"
                    :formColumns="formColumns" ref="table"  :addBtnVis=false
                     :editBtnVis=false
                     :lookBtnVis = false
                     :delBtnVis=false :queryFormColumns="queryFormColumns">
            <template slot="Handle" slot-scope="scope">
                <el-tag v-if="scope.row.emergencyAccidentHandle==='0'"
                    close-transition type="danger">未派发</el-tag>
                <el-tag v-if="scope.row.emergencyAccidentHandle==='1'"
                        close-transition>已派发</el-tag>
            </template>
            <template slot="ResultMsg" slot-scope="scope">
                <el-tag v-if="scope.row.emergencyAccidentResult==='0'"
                        close-transition type="danger">未完成</el-tag>
                <el-tag v-if="scope.row.emergencyAccidentResult==='1'"
                        close-transition>完成</el-tag>
            </template>
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="info" plain  class="self-btn-max self-programme" @click="showDeal(slotProps.selected)">&nbsp;</el-button>
            </template>
        </CommonCRUD>

        <el-dialog
            v-if="dialogVisibleDeal"
            :title="Dealtitle"
            :visible.sync="dialogVisibleDeal"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" :rules="rules" label-width="170px" class="demo-ruleForm" id="formStyle">
                <el-form-item style="display: none">
                    <el-input v-model="form.accidentId"></el-input>
                </el-form-item>
                <el-form-item label="处理方案" prop="solution" id="t1">

                    <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solution" style="width: 400px;"></el-input>

                </el-form-item>
                <el-form-item label="预防措施" >
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.precaution" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="附件" >
                    <CommonFileUpload :value="form.enclosure" @getValue="form.enclosure = $event"></CommonFileUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import CommonFileUpload from '@/components/FileUpLoad';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    import CommonUpload from '@/components/UpLoad';
    export default {
        name: 'EmergencyAccidentDeal',
        data() {
            return {
                formColumns:[],
                columns: [],
                handlers:true,
                Results:true,
                dialogVisibleDeal:false,
                Dealtitle:'派发方案',
                form:{accidentId:'',solution:'',precaution:'',enclosure:''},
                selectedForm:{},
                disabled:false,
                submitLoading: false,
                rules: {
                    solution:[{ required: true, message: '请输入处理方案', trigger: 'blur' }]},
                apiRootDeal: '/identity/emergencyAccidentHandle',
                queryFormColumns:[
                    {
                        name:'name',
                        visible:true,
                        des:'事故名称',
                        type:'string'
                    },
                    {
                        name:'litigantName',
                        visible:true,
                        des:'当事人',
                        type:'string'
                    }
                ]
            }

        },
        methods: {
            handleSelectOptions() {
                let  items = [
                    ['litigantSex', 'Sex']
                ].forEach(item => {
                        this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                    }
                )
                tansfer(this.columns);
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisibleDeal = false;
                        done();
                    })
                    .catch(_ => {});
            },
            showDeal(val) {
                if (val.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: val.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                if(val[0].emergencyAccidentHandle == 1){
                        this.$message({
                            type: 'warning',
                            message: '已存在方案'
                        });
                        return false;
                }
                this.selectedForm = val[0]
                this.form.accidentId = val[0].id
                this.dialogVisibleDeal = true
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
        },
        components: {
            CommonUpload,
            CommonCRUD,
            CommonFileUpload
        },
        created() {
            this.columns = []
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1
            this.columns = temp
            var columsItems1 = {slot:true,name:'emergencyAccidentHandle',des:'有无方案',slotName:'Handle'}
            var columsItems2 = {slot:true,name:'emergencyAccidentResult',des:'是否处理完成',slotName:'ResultMsg'}
            this.columns.push(columsItems1,columsItems2)
            this.handleSelectOptions();

        }
    };
</script>

<style scoped>
    #t1 .el-textarea__inner {
        width: 400px !important;
    }


</style>
