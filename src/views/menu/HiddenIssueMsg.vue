<template>
    <section>
        <CommonCRUD
            :formColumns="formColumns"
            apiRoot="/identity/hiddenIssue" :look="show"
            :columns="columns" :addBtnVis="false" :editBtnVis="false" :delBtnVis="false" ref="table">
            <template slot="hiddenStatus" slot-scope="scope">
                <el-tag v-if="scope.row.statusName==='完成'"
                        close-transition type="success">完成</el-tag>
                <el-tag v-if="scope.row.statusName==='待处理'"
                        close-transition type="danger">待处理</el-tag>
                <el-tag v-if="scope.row.statusName==='待审核'"
                        close-transition type="warning">待审核</el-tag>
            </template>
        </CommonCRUD>.
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-collapse v-model="activeNames" @change="handleChange"  id="M1">
                <el-collapse-item title="隐患基本信息" name="1">
                    <template slot="title">
                        <i class="header-icon el-icon-tickets"></i> 隐患基本信息
                    </template>
                    <el-form :inline="true" :model="form" :rules="rules" ref="form" class="demo-form-inline" label-width="170px" >
                        <el-form-item v-for="item in formItems0"  :key="item.des" :label="item.des" :prop="item.name" v-if="item.formShow !== 'false'">
                            <el-input v-model="form[item.aliasName]||form[item.name]" v-if="item.type === 'string'" :disabled=disabled></el-input>
                            <el-select v-model="form[item.aliasName]||form[item.name]" v-else-if="item.type === 'select'" filterable :disabled=disabled>
                                <el-option v-for="opItem in item.options" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                            </el-select>
                            <el-date-picker v-if="item.type === 'date'"
                                            v-model="form[item.name]"
                                            type="date"
                                            :disabled="disabled"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                            >
                            </el-date-picker>
                            <el-input v-model="form[item.name]" type="textarea" :rows="2" v-if="item.type === 'textarea'" :disabled=disabled></el-input>
                            <CommonFileUpload v-if="item.type === 'file'" :value="form[item.name]" @getValue="form[item.name] = $event"></CommonFileUpload>
                            <CommonUpload v-if="item.type === 'image'" :value="form[item.name]" @getValue="form[item.name] = $event"></CommonUpload>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="处理方案" name="2">
                    <template slot="title">
                        <i class="header-icon el-icon-tickets"></i> 处理方案
                    </template>
                    <el-form :inline="true"  ref="form"  label-width="170px" class="demo-ruleForm">
                        <el-form-item label="结果描述" >
                            <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solveDes" :disabled=disabled></el-input>
                        </el-form-item>
                        <el-form-item label="图片" >
                            <CommonUpload :value="formColumns.solveImage" @getValue="form.solveImage = $event" :disabled=disabled></CommonUpload>
                        </el-form-item>
                        <el-form-item label="完成日期" >
                            <el-date-picker  v-model="form.solveTime"
                                             type="date"
                                             value-format="yyyy-MM-dd"
                                             placeholder="选择日期"
                                             :disabled=disabled
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="附件" >
                            <CommonFileUpload :value="form.enclosure" @getValue="form.enclosure = $event" :disabled=disabled></CommonFileUpload>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="隐患流程记录" name="3">
                    <template slot="title">
                        <i class="header-icon el-icon-tickets"></i> 隐患流程记录
                    </template>
                    <div style="float: left;margin-left: 150px">
                    <el-steps  direction="vertical" :space="80"  align-center>
                        <template v-for="items in recordsForm">
                            <el-step  v-if="items.actionType === 'UPLOAD'" status='wait' :title="'['+items.createdByName+']在'+items.createdAt.substr(0,10) +'上报了该隐患'":description="'描述:'+items.des"></el-step>
                            <el-step  v-if="items.actionType === 'HANDLE'" status="finish" :title="'['+items.createdByName+']在'+items.createdAt.substr(0,10) +'处理了该隐患'":description="'描述:'+items.des"></el-step>
                            <el-step  v-if="items.actionType === 'UNCHECKED'"  status='error' :title="'['+items.createdByName+']在'+items.createdAt.substr(0,10) +'驳回了该隐患'":description="'驳回原因:'+items.des"></el-step>
                            <el-step  v-if="items.actionType === 'CHECKED'" status='success' :title="'['+items.createdByName+']在'+items.createdAt.substr(0,10) +'完成了该隐患'":description="'描述:'+items.des"></el-step>
                        </template>
                       </el-steps>
                    </div>
                </el-collapse-item>
            </el-collapse>




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
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'HiddenIssueMsg',
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
                title: '查看',
                disabled: true,
                selected: [],
                rules: {},
                queryForm:{issueId:''},
                self: this,
                activeNames: ['1','2','3'],
                formItems0:[],
                recordsForm:Array


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
            handleChange(val) {

            },
            show() {
                this.form = Object.assign({}, this.$refs.table.selected[0]);
                this.showRecords()
                this.dialogVisible = true
            },
            showRecords() {
                this.$nextTick(() => {
                    var query = {issueId: this.form.id}
                    console.log(query)
                    let type = 'Post'
                    let path = '/identity/hiddenRecords/list?sort=createdAt,asc'
                    this.$http(type,path,query, false).then((data)=>{
                        this.recordsForm = data
                        console.log(data)
                    })
                })


            }

        },
        components :{
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
            var columsItems1 = {slot:true,name:'hiddenStatus',des:'状态',slotName:'hiddenStatus'}
            this.columns.push(columsItems1)
            this.formItems0 = temp1
            this.formItems0.filter(item=>item.name === 'status')[0].notShow = null
            this.formItems0.filter(item=>item.name === 'status')[0].formShow = 'true'
            this.handleSelectOptions();
    }
    };
</script>

<style>
    .result_area .el-textarea__inner{
        width: 580px !important;
    }
    .el-step__description.is-wait{
        width: 580px !important;
    }
    .footer-position {
        margin-right: 86px;
    }
    #M1 .el-collapse-item__header{
        font-size: 14px !important;
        margin-left: 37px !important;
    }
</style>

