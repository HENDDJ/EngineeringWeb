<template>
    <section>
        <CommonCRUD  :columns="columns" apiRoot="/identity/emergencyAccident"
                    :formColumns="formColumns" >
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
                formColumns:[],
                columns: [],
                handlers:true,
                Results:true
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
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.columns = []
            this.columns.length = 0
            this.formColumns = this.$store.state.classInfo.properties;
            this.columns = this.$store.state.classInfo.properties;
            var columsItems1 = {slot:true,name:'emergencyAccidentHandle',des:'有无方案',slotName:'Handle'}
            var columsItems2 = {slot:true,name:'emergencyAccidentResult',des:'是否处理完成',slotName:'ResultMsg'}
            this.columns.push(columsItems1,columsItems2)
            this.handleSelectOptions();

        }
    };
</script>

<style scoped>

</style>
