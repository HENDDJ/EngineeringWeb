<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyPrevention" :columns="Columns"  >
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'EmergencyPrevention',
        data() {
            return {
                Columns: [
                    {
                        name: "name",
                        type: 'string',
                        des: "应急名称",
                    },
                    {
                        name: "type",
                        type: 'string',
                        des: "应急针对类别",
                    },
                    {
                        name: "description",
                        type: 'string',
                        des: "描述",
                    },
                    {
                        name: "enclosure",
                        type: 'string',
                        des: "附件",
                    },
                    {
                        name: "submitter",
                        type: 'string',
                        des: "提交人",
                    },
                    {
                        name: "modifiedAt",
                        type: 'datetime',
                        des: "最新提交时间",
                        formatter: (row)=>{
                            var timeF =  row.modifiedAt.substr(0,10)
                            var timeB =  row.modifiedAt.substr(11)
                            return timeF+' '+timeB


                        }
                    },
                ],
                formColumns:{},
                typeOptions: [
                    {value:'重大危险源',label:'重大危险源'},
                    {value:'各类事故',label:'各类事故'},
                    {value:'岗位和地点',label:'岗位和地点'},
                    {value:'薄弱环节',label:'薄弱环节'},
                    {value:'重要工程',label:'重要工程'},
                ],
            }
        },
        methods: {
            handleSelectOptions() {
                this.formColumns.filter(item => item.name === 'type')[0].options = this.typeOptions
            }
        },
        components:{
            CommonCRUD
        },
        created () {
            this.formColumns =this.$store.state.classInfo.properties;
            this.handleSelectOptions();
        }
    };
</script>

<style scoped>

</style>
