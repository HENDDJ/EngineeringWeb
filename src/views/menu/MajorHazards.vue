<template>
    <section>
        <CommonCRUD
            ref="table"
            :formColumns="formColumns"
            apiRoot="/identity/majorHazards"
            :columns="columns"
            :queryFormColumns="queryFormColumns"
            :addBtnVis=false
            :editBtnVis=false
            :lookBtnVis = false
            :delBtnVis=false>
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="primary" v-if="addBtnVis" plain @click="add()" >上报</el-button>
                <el-button type="warning" v-if="editBtnVis" plain @click="edit(slotProps.selected)" >编辑</el-button>
                <el-button type="success" plain @click="look(slotProps.selected)" >查看</el-button>
                <el-button type="danger" v-if="delBtnVis" plain @click="del(slotProps.selected)" >删除</el-button>
                <el-button type="primary" v-if="conBtnVis" plain @click="showMajorHazards(slotProps.selected)" >确认</el-button>
            </template>
        </CommonCRUD>
        <!--确认-->
        <el-dialog
            v-if="conDia"
            title="危险源确认"
            :visible.sync="conDia"
            width="60%"
            align="left"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="100px">
                <el-form-item label="工程名称">
                    <el-input v-model="form.projectName" disabled></el-input>
                </el-form-item>
                <el-form-item label="工作类型">
                    <el-input v-model="form.workType" disabled></el-input>
                </el-form-item>
                <el-form-item label="具体描述">
                    <el-input v-model="form.description" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-input v-model="form.startTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-input v-model="form.endTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="危害">
                    <el-input v-model="form.damage" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="confirm(form)">确 认</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
        <!--上报、编辑、查看-->
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="60%"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="100px" >
                <el-form-item label="工程名称">
                    <el-select v-model="form.proId" placeholder="请选择" :disabled="disabled">
                        <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作类型">
                    <el-input v-model="form.workType" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="具体描述">
                    <el-input v-model="form.description" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="具体描述">
                    <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" :disabled="disabled"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" :disabled="disabled"></el-date-picker>
                </el-form-item>
                <el-form-item label="危害">
                    <el-input v-model="form.damage" :disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "MajorHazards",
        data() {
            return {
                formColumns: [],
                queryFormColumns:[
                    {
                        name: 'createdBy',
                        type: 'string',
                        value: '',
                        visible: false
                    },
                    {
                        name: 'proId',
                        des: '工程名称',
                        type: 'select',
                        visible: true,
                        options: []
                    },
                ],
                form:{
                    proId:'',
                    workType:'',
                    description:'',
                    startTime:'',
                    endTime:'',
                    damage:'',
                    state:''
                },
                disabled:false,
                addBtnVis:true,//
                editBtnVis:true,
                delBtnVis:true,
                conBtnVis:false,
                conDia: false,//确认弹出框
                submitLoading: false,//按钮加载
                columns:[],
                roleCode:'',
                projectList:[],
                dialogVisible:false,
            }
        },
        methods: {
            //权限控制（列表数据、按钮）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
              //  console.log(JSON.parse(sessionStorage.getItem('userInfo')));
                if( this.roleCode === 'MAJOR_HAZARDS_DECLARE'){
                    this.queryFormColumns[0].value = JSON.parse(sessionStorage.getItem('userInfo')).id;
                    this.addBtnVis = true;
                    this.editBtnVis = true;
                    this.delBtnVis = true;
                    this.conBtnVis = false;
                }
                if(this.roleCode === 'MAJOR_HAZARDS_CONFIRM'){
                    this.addBtnVis = false;
                    this.editBtnVis = false;
                    this.delBtnVis = false;
                    this.conBtnVis = true;
                }
            },
            add(){
                this.title = "上报";
                this.dialogVisible = true;
                this.disabled = false;
            },
            edit(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.title = "编辑";
                this.dialogVisible = true;
                this.disabled = false;
                this.form = data[0];
            },
            look(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.title = "查看";
                this.dialogVisible = true;
                this.disabled = true;
                this.form = data[0];
            },
            del(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/majorHazards/${data[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //上报
                if(form.id==null){
                    form.state = "TO_BE_CONFIRMED";
                    this.$http('POST',`identity/majorHazards/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    form.state = "TO_BE_CONFIRMED";
                    this.$http('PUT', `identity/majorHazards/${form.id}id`,form).then(() =>{
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.form={};
                    });
                }else{//查看
                    this.submitLoading = false;
                    this.dialogVisible = false;
                    this.form={};
                }
            },

            //工程名称下拉项
            loadProjectOptions() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.projectList = data;
                        this.formColumns.filter( item => item.name === 'proId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                        this.queryFormColumns.filter(item => item.type==='select')[0].options = data.map(item =>{return {value: item.id, label: item.name}});
                    }
                )
            },
            //展示确认内容
            showMajorHazards(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.conDia = true;
                this.title ="确认";
                this.disabled = true;
                this.form = data[0];
            },
            //关闭确认dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
            //确认改变数据状态
            confirm(form){
                form.state = 'CONFIRMED';
                this.$http('PUT', `identity/majorHazards/${form.id}id`,form).then(() =>{
                    this.conDia = false;
                    this.$refs.table.refreshTableData();
                    //this.form = {};
                })
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns =this.$store.state.classInfo.properties;
            this.columns = this.$store.state.classInfo.properties;
            this.loadProjectOptions();
            this.controlAuthority();
            tansfer(this.columns);//表格字段显示中文
        }
    }
</script>

<style scoped>

</style>
