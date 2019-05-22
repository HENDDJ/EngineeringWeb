<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyAccident" :columns="columns"
                    :queryFormColumns="queryFormColumns"
                    :editBtnVis=false
                    :addBtnVis = false
                    :delBtnVis=false
                    :look="look" ref="table">
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
        </CommonCRUD>

        <el-dialog
            v-if="dialogVisible"
            title="查看"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="170px" id="M1">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="事故信息" name="1">
                        <el-form-item label="事故名称" >
                            <el-input type="text"  v-model="form.name" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="事故发生部门" >
                            <el-input type="text"  v-model="form.department" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="事故发生时间" >
                            <el-input type="text"  v-model="form.occurrenceTime" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="负责人" >
                            <el-input type="text"  v-model="form.chargePerson" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="当事人姓名" >
                            <el-input type="text"  v-model="form.litigantName" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="当事人性别" name="litigantSex">
                            <el-radio-group v-model="form.litigantSex"  filterable :disabled=inputDisabled>
                                <el-radio label="male">男</el-radio>
                                <el-radio label="female" >女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="当事人出生年月" >
                            <el-input type="text"  v-model="form.litigantBirth" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="当事人开始工作时间" >
                            <el-input type="text"  v-model="form.litigantWorkTime" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="当事人岗位" >
                            <el-input type="text"  v-model="form.litigantPost" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="受伤部位及情况" >
                            <el-input type="text"  v-model="form.injuredPart" :disabled=inputDisabled></el-input>
                        </el-form-item>
                        <el-form-item label="附件" >
                            <CommonFileUpload  :value="form.enclosure" :disabled=inputDisabled @getValue="form.enclosure = $event"></CommonFileUpload>
                        </el-form-item>
                        <el-form-item label="事故简述" >
                            <Tinymce v-model="form.accidentPassing" :disabled=inputDisabled></Tinymce>
                        </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="处理方案" name="2">
                        <template v-if="form.emergencyAccidentHandle === '1'">
                            <el-form-item label="处理方式" >
                                <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solution" :disabled=inputDisabled></el-input>
                            </el-form-item>
                            <el-form-item label="预防措施" >
                                <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.precaution" :disabled=inputDisabled></el-input>
                            </el-form-item>
                            <el-form-item label="附件" >
                                <CommonFileUpload  :value="form.handleEnclosure" :disabled=inputDisabled @getValue="form.handleEnclosure = $event"></CommonFileUpload>
                            </el-form-item>
                        </template>
                        <template v-if="form.emergencyAccidentHandle === '0'">
                            <el-form-item label="状态" >
                            <el-tag type="info" size="medium">暂无处理方案</el-tag>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                    <el-collapse-item title="处理结果" name="3">
                        <template v-if="form.emergencyAccidentResult === '1'">
                            <el-form-item label="处理完成情况" >
                                <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionGrade" :disabled=inputDisabled></el-input>
                            </el-form-item>
                            <el-form-item label="处理结果描述" >
                                <el-input type="textarea" class="result_area" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.solutionResult" :disabled=inputDisabled></el-input>
                            </el-form-item>
                            <el-form-item label="附件" >
                                <CommonFileUpload  :value="form.resultEnclosure" :disabled=inputDisabled @getValue="form.resultEnclosure = $event"></CommonFileUpload>
                            </el-form-item>
                        </template>
                        <template v-if="form.emergencyAccidentResult === '0'">
                            <el-form-item label="状态" >
                                <el-tag type="info" size="medium">暂无处理结果</el-tag>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import CommonFileUpload from '@/components/FileUpLoad';
    import CommonUpload from '@/components/UpLoad';
    import Tinymce from '@/components/Tinymce';
    export default {
        name: 'EmergencyAccidentResult',
        data() {
            return {
                formColumns :[],
                columns: [],
                inputDisabled:true,
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
                form:{},
                dialogVisible:false,
                activeNames: ['1']
            }
        },
        methods: {
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
            look() {
                if (this.$refs.table.selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: this.$refs.table.selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                this.form = Object.assign({}, this.$refs.table.selected[0]);
                this.dialogVisible = true
            },
           handleClose (done) {
             this.$confirm('确认关闭？').then(_ => {
                this.form = {};
                this.$refs['form'].resetFields();
                this.disabled = false;
                this.dialogVisible = false;
                done();
            })
            .catch(_ => {});
    },

        },
        components :{
            CommonCRUD,
            CommonFileUpload,
            CommonUpload,
            Tinymce
        },
        created () {
            this.columns = []
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1
            this.columns = temp
            var columsItems1 = {slot:true,name:'emergencyAccidentHandle',des:'有无方案',slotName:'Handle'}
            var columsItems2 = {slot:true,name:'emergencyAccidentResult',des:'是否处理完成',slotName:'ResultMsg'}
            this.columns.push(columsItems1,columsItems2)
            this.timeTransfer();
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
