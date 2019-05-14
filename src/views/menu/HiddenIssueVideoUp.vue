<template>
    <section>
        <CommonCRUD
            :formColumns="formColumns"
            apiRoot="/identity/hiddenIssue"
            :columns="columns" :addBtnVis="false"  ref="table">
            <template slot="header-btn0" slot-scope="slotProps">
                <el-button type="primary" v-if="uploadBtn"  @click="add(slotProps.selected)" >上报</el-button>
            </template>
            <template slot="hiddenStatus" slot-scope="scope">
                <el-tag v-if="scope.row.statusName==='完成'"
                        close-transition type="success">完成</el-tag>
                <el-tag v-if="scope.row.statusName==='待处理'"
                        close-transition type="danger">待处理</el-tag>
                <el-tag v-if="scope.row.statusName==='待审核'"
                        close-transition type="warning">待审核</el-tag>
            </template>
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="info" v-if="dealBtn" plain @click="deal(slotProps.selected)">处理</el-button>
            </template>
        </CommonCRUD>
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="60%"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form" :rules="rules" ref="form" class="demo-form-inline" label-width="100px" >
                <el-form-item v-for="item in formColumns"  :key="item.des" :label="item.des" :prop="item.name" v-if="item.formShow !== 'false'">
                    <el-input v-model="form[item.name]" v-if="item.type === 'string'" :disabled="item.disabled || disabled"></el-input>
                    <el-select v-model="form[item.name]" v-else-if="item.type === 'select'" filterable :disabled="item.disabled || disabled">
                        <el-option v-for="opItem in item.options" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                    </el-select>
                    <el-radio-group v-if="item.type === 'radio'" v-model="form[item.name]" :disabled="item.disabled || disabled" style="width: 178px" >
                        <el-radio v-for="opItem in item.options" :label="opItem.value" :key="opItem.value"> {{opItem.label}}</el-radio>
                    </el-radio-group>
                    <el-date-picker v-if="item.type === 'date'"
                                    v-model="form[item.name]"
                                    type="date"
                                    :disabled="item.disabled || disabled"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                    >
                    </el-date-picker>
                    <el-date-picker v-if="item.type === 'datetime'"
                                    v-model="queryForm[item.name]"
                                    type="datetime"
                                    :disabled="item.disabled || disabled"
                                    value-format="yyyy-MM-ddTHH:mm:ss"
                                    placeholder="选择日期"
                    >
                    </el-date-picker>
                    <el-input v-model="form[item.name]" type="textarea" :rows="2" v-if="item.type === 'textarea'" :disabled="item.disabled || disabled"></el-input>
                    <!--预留富文本编辑-->
                    <Tinymce v-if="item.type === 'rich-editor'" v-model="form[item.name]"></Tinymce>
                    <CommonUpload v-if="item.type === 'file'" :value="form[item.name]" @getValue="form[item.name] = $event"></CommonUpload>
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
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'HiddenIssueVideoUp',
        data() {
            return {
                formColumns:[],
                columns:[],
                roleCode:'',
                uploadBtn:true,
                dealBtn:true,
                dialogVisible: false,
                form:{},
                submitLoading: false,
                title: '',
                disabled: false,
                selected: [],
                rules: {},
                recordsForm: {issueId:'',preNodeId:'',nextNodeId:'',actionType:'',des:''}
            }

        },
        methods:{
            handleSelectOptions() {
                let  items = [
                    ['issueGrade', 'IssueType']
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
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
            add(val){

                this.dialogVisible = true
            },
            deal(val) {
                if (val.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: val.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
            },
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //  console.log(JSON.parse(sessionStorage.getItem('userInfo')));
                if( this.roleCode === 'MAJOR_HAZARDS_DECLARE'){
                    this.queryFormColumns[0].value = JSON.parse(sessionStorage.getItem('userInfo')).id;
                    this.dealBtn = false
                    this.uploadBtn = true;
                }
                if(this.roleCode === 'MAJOR_HAZARDS_CONFIRM'){
                    this.uploadBtn = false;
                    this.dealBtn = true;
                }
            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$nextTick(() => {
                            let type = 'Post';
                            let path = '/identity/hiddenIssue/';
                            this.form.status = '3dfa705b-c5ec-4e95-9838-0045022358bb'
                            this.$http(type, path, Object.assign({}, this.form)).then((data) => {

                                this.$nextTick(() => {
                                    let type = 'Post'
                                    let path = '/identity/hiddenRecords/'
                                    this.recordsForm.issueId = data.id
                                    this.recordsForm.actionType='UPLOAD'
                                    this.recordsForm.preNodeId=''
                                    this.recordsForm.nextNodeId='86427b26-b4c3-462c-8ce0-4992098534eb'
                                    this.recordsForm.des='隐患上报'
                                    this.$http(type,path,this.recordsForm).then(()=>{
                                        this.recordsForm = {};
                                    })
                                })

                                this.submitLoading = false;
                                this.dialogVisible= false;
                                this.$refs.table.refreshTableData();
                                this.form = {};
                            });
                        })
                    } else {
                        this.dialogVisible = true;
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            loadDepartmentOptions() {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'departmentId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'projectId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
                this.$http('POST', 'identity/principal/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'userId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )

            }
        },
        components :{
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
            this.handleSelectOptions();
            this.controlAuthority();
            this.loadDepartmentOptions();
        }
    };
</script>

<style scoped>

</style>

