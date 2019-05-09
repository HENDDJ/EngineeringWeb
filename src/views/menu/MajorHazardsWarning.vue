<template>
    <section>
        <CommonCRUD
            :formColumns="formColumns"
            apiRoot="/identity/preWarning"
            :columns="columns"
            :queryFormColumns="queryFormColumns"
            :addBtnVis=false
            :editBtnVis=false>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "MajorHazardsWarning",
        data() {
            return {
                formColumns:{},
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
                    }
                ]
            }
        },
        methods: {
        },
        components:{
            CommonCRUD
        },
        created () {
            this.formColumns =this.$store.state.classInfo.properties;
            tansfer(this.columns);//表格字段显示中文
        }
    }
</script>

<style scoped>

</style>
