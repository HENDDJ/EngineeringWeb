<template>
    <section>
        <CommonCRUD
            apiRoot="/identity/preWarning"
            :columns="columns"
            :queryFormColumns="queryFormColumns"
            :addBtnVis=false
            :editBtnVis=false
            :lookBtnVis = false>
            <template slot="header-btn0" slot-scope="slotProps">
                <el-button type="success" plain class="self-btn self-look" @click="look(slotProps.selected)" >&nbsp;</el-button>
            </template>
        </CommonCRUD>
        <el-dialog
            v-if="lookDia"
            title="查看"
            :visible.sync="lookDia"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="170px" >
                <el-form-item label="工程名称">
                    <!--<el-select v-model="form.proId" placeholder="请选择" disabled>
                        <el-option  :label="form.projectName" :value="form.ProI">
                        </el-option>
                    </el-select>-->
                    <el-input v-model="form.projectName" disabled></el-input>
                </el-form-item>
                <el-form-item label="工作类型">
                    <el-input v-model="form.majorWorkType" disabled></el-input>
                </el-form-item>
                <el-form-item label="具体描述">
                    <el-input v-model="form.majorDescription" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="form.majorStartTime" type="date" placeholder="选择日期" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="form.majorEndTime" type="date" placeholder="选择日期" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="危害">
                    <el-input v-model="form.majorDamage" disabled></el-input>
                </el-form-item>
                <el-form-item label="预警描述">
                    <el-input v-model="form.warnDescribe" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button type="primary"  @click="submit(form)">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "MajorHazardsWarning",
        data() {
            return {
                form:{
                    proId:'',
                    projectName:'',
                    majorWorkType:'',
                    majorDescription:'',
                    majorStartTime:'',
                    majorEndTime:'',
                    majorDamage:'',
                    warnDescribe:''
                },
                columns:[
                    {
                        name: "projectName",
                        type: 'string',
                        des: "工程名称",
                    },
                    {
                        name: "majorWorkType",
                        type: 'string',
                        des: "作业类型",
                    },
                    {
                        name: "majorDescription",
                        type: 'string',
                        des: "具体描述",
                    },
                    {
                        name: "majorStartTime",
                        type: 'date',
                        des: "开始时间",
                    },
                    {
                        name: "majorEndTime",
                        type: 'date',
                        des: "结束时间",
                    },
                    {
                        name: "majorDamage",
                        type: 'string',
                        des: "危害",
                    },
                    {
                        name: "type",
                        type: 'string',
                        des: "预警类型",
                        transferType: 'lookup',
                        lookupKey: 'WarningType'
                    },
                    {
                        name:'warnDescribe',
                        type:'string',
                        des:'预警描述'
                    }
                ],
                queryFormColumns:[
                    {
                        name: 'type',
                        type: 'string',
                        value: 'MAJOR_HAZARDS',
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
                lookDia:false,
            }
        },
        methods: {
            look(data){
                console.log(data);
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.title = "查看";
                this.lookDia = true;
                this.form = data[0];
            },
            submit(form){
                this.lookDia= false;
                this.form={};
            },
            //关闭确认dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.lookDia = false;
                        done();
                    })
                    .catch(_ => {});
            },
            //工程名称下拉项
            loadProjectOptions() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.queryFormColumns.filter(item => item.type==='select')[0].options = data.map(item =>{return {value: item.id, label: item.name}});
                    }
                )
            },


        },
        components:{
            CommonCRUD
        },
        created () {
           // this.formColumns =this.$store.state.classInfo.properties;
            tansfer(this.columns);//表格字段显示中文
            this.loadProjectOptions();
        }
    }
</script>

<style scoped>
    .footer-position {
        margin-right: 84px;
    }
</style>
