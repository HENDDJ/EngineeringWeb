<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyAccidentHandle" :columns="columns" ref="table" :queryFormColumns="queryFormColumns"
                    :addBtnVis=addVis
                    :editBtnVis=editVis
                    :delBtnVis=delVis>
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="info" plain  class="self-btn self-feedback" @click="showDeal(slotProps.selected)">&nbsp;</el-button>
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
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form"  :rules="rules" label-width="170px" class="demo-ruleForm">
                <el-form-item style="display: none">
                    <el-input v-model="form.accidentId" ></el-input>
                </el-form-item>
                <el-form-item label="处理完成情况"  id="t1" prop="solutionGrade">
                    <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionGrade" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="处理结果描述" >
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionResult" style="width: 400px;"></el-input>
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
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import CommonUpload from '@/components/UpLoad';
    import CommonFileUpload from '@/components/FileUpLoad';
    export default {
        name: 'EmergencyAccidentHandle',
        data() {
            return {
                addVis:false,
                editVis:true,
                delVis:true,
                formColumns :{},
                columns: [],
                dialogVisibleDeal:false,
                Dealtitle:'提交处理结果',
                form:{accidentId:'',solutionGrade:'',solutionResult:'',enclosure:''},
                submitLoading: false,
                apiRootDeal: '/identity/emergencyAccidentResult',
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
                ],
                rules:{
                    solutionGrade:[{ required: true, message: '请输入处理完成情况', trigger: 'blur' }]
                }

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
                                this.$refs.table.refreshTableData()
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
            },
            //权限控制（列表数据）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    //显示自己上报的内容
                    this.addVis = false,
                        this.editVis = false,
                        this.delVis = false
                }else{

                }
            },
        },
        components: {
            CommonUpload,
            CommonCRUD,
            CommonFileUpload
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
            this.controlAuthority();
        }
    };
</script>

<style scoped>

</style>
