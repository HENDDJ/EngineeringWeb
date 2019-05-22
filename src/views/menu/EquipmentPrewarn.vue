<template>
    <section>
        <CommonCRUD
            apiRoot="/identity/preWarning"
            :columns="columnsNext"
            :queryFormColumns="queryFormColumns"
            :addBtnVis="false"
            :editBtnVis="false"
            :lookBtnVis = false>
            <template slot="header-btn" slot-scope="slotProps">
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
                    <el-input v-model="form.projectName" disabled></el-input>
                </el-form-item>
                <el-form-item label="注册代码">
                    <el-input v-model="form.registrationCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="设备种类">
                    <el-input v-model="form.equipmentType" disabled></el-input>
                </el-form-item>
                <el-form-item label="上次检查时间">
                    <el-date-picker v-model="form.lastInspectionTime" type="date" placeholder="选择日期" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="下次检查时间">
                    <el-date-picker v-model="form.nextInspectionTime" type="date" placeholder="选择日期" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="最新检查结果">
                    <el-input v-model="form.lastInspection" disabled></el-input>
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
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'EquipmentPrewarn',
        data() {
            return {
                queryFormColumns:[
                    {  name:'proId',
                        type: 'string',
                        value:''},
                    {
                        name: 'type',
                        type: 'string',
                        value: 'SPECIAL_EQUIPMENT',
                        visible: false
                    },
                    {
                        name:'warnDescribe',
                        visible:true,
                        des:'描述',
                        type:'string'
                    }
                ],
                form:{},
                roleCode:'',
                columnsNext:{},
                columns :[
                    {
                        name: "projectName",
                        type: 'string',
                        des: "工程名称",
                    },
                    {
                        name: "registrationCode",
                        type: 'string',
                        des: "注册代码",
                    },
                    {
                        name: "equipmentType",
                        type: 'string',
                        des: "设备种类",
                    },
                    {
                        name: "lastInspectionTime",
                        type: 'date',
                        des: "上次检查时间",
                    },
                    {
                        name: "lastInspection",
                        type: 'string',
                        des: "最新检查结果",
                        transferType: 'lookup',
                        lookupKey: 'CheckResult'
                    },
                    {
                        name: "nextInspectionTime",
                        type: 'date',
                        des: "下次检查时间",
                    },
                    {
                        name: "type",
                        type: 'string',
                        des: "预警类型",
                        transferType: 'lookup',
                        lookupKey: 'WarningType'
                    },
                    {
                        name: "warnDescribe",
                        type: 'string',
                        des: "预警描述",
                    },
                ],

                lookDia:false,
            }
        },
        methods : {
            look(data){
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
            //权限控制（列表数据）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    var userId = JSON.parse(sessionStorage.getItem('userInfo')).proId;
                        this.queryFormColumns[0].value = userId
                }else{
                    this.queryFormColumns.push( {
                        name:'proId',
                        visible:true,
                        des:'工程名称',
                        type:'select',
                        options:Array
                    })
                    this.$http('POST', 'identity/projectInfo/list', false).then(
                        data => {
                            this.queryFormColumns.filter( item => item.name === 'proId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                        }
                    )
                }
            },
        },
        components :{
            CommonCRUD
        },
        created (){
            this.controlAuthority();
            this.columnsNext = []
            this.columnsNext = this.columns
        }
    };
</script>

<style scoped>

</style>
