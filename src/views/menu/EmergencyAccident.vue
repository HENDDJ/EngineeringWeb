<template>
    <section>
        <CommonCRUD  :columns="columns" apiRoot="/identity/emergencyAccident"
                    :formColumns="formColumns"  ref="table" :queryFormColumns="queryFormColumns" :addBtnVis=addVis
                     :editBtnVis=editVis
                     :delBtnVis=delVis>
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
            <template slot="header-btn0" slot-scope="slotProps">
                <el-button type="primary"  class="self-btn self-report" @click="addUp(slotProps.selected)">&nbsp;</el-button>
            </template>
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'EmergencyAccident',
        data() {
            return {
                addVis:false,
                editVis:true,
                delVis:true,
                formColumns:[],
                columns: [],
                handlers:true,
                Results:true,
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
            itemStatus() {
                this.$http('POST', '/identity/emergencyAccident', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'organizationId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
            },
            addUp(val){
                this.$refs.table.add(val)
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
            CommonCRUD
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
            this.controlAuthority();
        }
    };
</script>

<style scoped>

</style>
