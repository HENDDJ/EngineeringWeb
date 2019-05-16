<template>
    <section id="t1">
    <CommonCRUD
        :formColumns="formColumns"
        apiRoot="/identity/hiddenHandle"
        :columns="columns" :addBtnVis="false" :editBtnVis="false" :delBtnVis="false" ref="table">
        <template slot="header-btn" slot-scope="slotProps">
            <el-button type="info" v-if="checkVis" plain  class="self-btn self-examine" @click="check(slotProps.selected)"></el-button>
            <!--<el-button type="info" v-if="checkResVis" plain @click="checkResult(slotProps.selected)">查看审核结果</el-button>-->
        </template>
        <template slot="hiddenStatus" slot-scope="scope">
            <el-tag v-if="scope.row.statusName==='完成'"
                    close-transition type="success">完成</el-tag>
            <el-tag v-if="scope.row.statusName==='待处理'"
                    close-transition type="danger">待处理</el-tag>
            <el-tag v-if="scope.row.statusName==='待审核'"
                    close-transition type="warning">待审核</el-tag>
        </template>
    </CommonCRUD>
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form"  label-width="170px" class="demo-ruleForm">
                <el-form-item >
                    <el-input v-model="form.issueId" type="hidden"></el-input>
                </el-form-item>
                <el-form-item label="理由与评价" >
                    <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.des"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">通过</el-button>
                <el-button type="danger" :loading="submitLoading" @click="refuse('form')">不通过</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog
            v-if="CRdialogVisible"
            :title="CRtitle"
            :visible.sync="CRdialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form"  label-width="170px" class="demo-ruleForm">
                <el-form-item label="理由与评价" >
                    <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="checkRes"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>


        </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'HiddenCheck',
        data() {
            return {
                formColumns:[],
                columns:[],
                dealBtn:true,
                form:{issueId:'',des:'',actionType:'',preNodeId:'',nextNodeId:''},
                dialogVisible:false,
                submitLoading:false,
                title:'审核',
                roleCode:'',
                checkVis:true,
                checkResVis:true,
                CRdialogVisible:false,
                CRtitle:'查看审核结果',
                checkRes:'',
                queryResult:{issueId:''}
            }
        },
        methods:{
            check(val){
                if (val.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: val.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                if( val[0].statusName == '完成' ){
                    this.$message({
                        type: 'warning',
                        message: '审核已通过'
                    });
                    return false;
                }
                if( val[0].statusName == '待处理' ){
                    this.$message({
                        type: 'warning',
                        message: '审核未通过，需重新处理'
                    });
                    return false;
                }
                this.form.issueId = val[0].issueId
                this.dialogVisible = true
            },
            checkResult(val){
                this.$nextTick(() => {
                    this.queryResult.issueId = val[0].issueId
                    let type = 'Post'
                    let path = '/identity/hiddenRecords/list'
                    this.$http(type,path,this.queryResult, false).then((data)=>{
                        this.checkRes = data[0].des

                    })
                })
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
            submit(formname) {
                this.$refs[formname].validate((valid)=>{
                    if(valid){
                        this.submitLoading = false
                        this.$nextTick(() => {
                            let type = 'Post'
                            let path = '/identity/hiddenRecords/'
                            this.form.actionType='CHECKED'
                            this.form.preNodeId='86427b26-b4c3-462c-8ce0-4992098534eb'
                            this.form.nextNodeId='91d3f401-ecad-4a83-9d61-9d22480dc296'
                            this.$http(type,path,this.form).then(()=>{
                                this.submitLoading = false;
                                this.dialogVisible= false;
                                this.$refs.table.refreshTableData();
                                this.form = {};
                            })
                        })
                    }else {
                        this.dialogVisible = true;
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            refuse(formname){
                this.$refs[formname].validate((valid)=>{
                    if(valid){
                        this.submitLoading = false
                        this.$nextTick(() => {
                            let type = 'Post'
                            let path = '/identity/hiddenRecords/'
                            this.form.actionType='UNCHECKED'
                            this.form.preNodeId='86427b26-b4c3-462c-8ce0-4992098534eb'
                            this.form.nextNodeId='3dfa705b-c5ec-4e95-9838-0045022358bb'
                            this.$http(type,path,this.form).then(()=>{
                                this.submitLoading = false;
                                this.dialogVisible= false;
                                this.$refs.table.refreshTableData();
                                this.form = {};
                            })
                        })
                    }else {
                        this.dialogVisible = true;
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //  console.log(JSON.parse(sessionStorage.getItem('userInfo')));
                if( this.roleCode === 'PROJECT_MANAGER'){
                    this.checkVis = false
                    this.checkResVis = true;
                }
                if(this.roleCode === 'JGC_MANAGER'){
                    this.checkVis = true;
                    this.checkResVis = true;
                }
            },
            loadDepartmentOptions() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'projectId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
            }

        },
        components: {
            CommonCRUD
        },
        created () {
            this.columns = []
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1
            this.columns = temp
            var columsItems1 = {slot:true,name:'hiddenStatus',des:'状态',slotName:'hiddenStatus'}
            this.columns.push(columsItems1)
            this.loadDepartmentOptions();
        }
    };
</script>

<style>
    .result_area .el-textarea__inner{
        width: 580px !important;
    }
</style>
