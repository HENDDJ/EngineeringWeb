<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/safetyEquipment" :columns="$store.state.classInfo.properties" :queryFormColumns="queryFormColumns"
                    :editBtnVis=editVis
                    :addBtnVis = addBVis
                    :delBtnVis=delVis></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'SafetyEquipment',
        data() {
            return {
                formColumns :{},
                editVis:true,
                addBVis:true,
                delVis:true,
                selVis:true,
                roleCode:'',
                queryFormColumns:[
                    {
                        name:'equipmentType',
                        visible:true,
                        des:'设备种类',
                        type:'string'
                    }
                ]

            }
        },
        methods: {
            handleSelectOptions() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'proId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
                let  items = [
                    ['lastInspection', 'CheckResult']
                ].forEach(item => {
                        this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                    }
                )
                tansfer(this.formColumns);
            },
            //权限控制（列表数据）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    var userId = JSON.parse(sessionStorage.getItem('userInfo')).proId;
                    this.queryFormColumns.push( {
                        name:'proId',
                        value:userId
                    })

                }else{
                    this.queryFormColumns.push( {
                        name:'proId',
                        visible:this.selVis,
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
        created () {
            this.formColumns =this.$store.state.classInfo.properties;
            this.handleSelectOptions();
            this.controlAuthority();
            console.log(this.queryFormColumns)
        }
    };
</script>

<style scoped>

</style>
