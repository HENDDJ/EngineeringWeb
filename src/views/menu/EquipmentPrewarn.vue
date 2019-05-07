<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/preWarning" :columns="Columns" :addBtnVis="false" :editBtnVis="false">
        </CommonCRUD>
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
                Columns :[
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

                    },
                    {
                        name: "warnDescribe",
                        type: 'string',
                        des: "预警描述",

                    },

                ],
                formColumns:[
                    {
                    name: "type",
                    type: 'string',
                    des: "预警类型",

                },
                    {
                        name: "typeId",
                        type: 'string',
                        des: "预警项目注册代码",

                    },
                    {
                        name: "warnDescribe",
                        type: 'string',
                        des: "预警描述",

                    },
                ]

            }
        },
        methods : {
            getyyyyMMdd () {
                var d = new Date();
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1;
                var curr_year = d.getFullYear();
                String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
                String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
                var yyyyMMdd = curr_year + "-" + curr_month + "-" + curr_date;
                return yyyyMMdd;
            },
            handleSelectOptions() {
                let  items = [
                    ['lastInspection', 'CheckResult']
                ].forEach(item => {
                        this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                    }
                )
                tansfer(this.Columns);
            },
     getDays(day,Inspection){
             var  aDate,  oDate1,  oDate2,  iDays
             aDate  =  this.getyyyyMMdd().split("-")
             oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式
             aDate  =  day.split("-")
             oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
             iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
         console.log(Inspection)
             if((oDate2  -  oDate1)<0) {
                 return 0;
             }
             else {
                 if(iDays < 10){
                     return 1;
             }else if(Inspection=='false'){
                     return 2;
             }
             }
     }
        },
        components :{
            CommonCRUD
        },
        created (){
            this.formColumns = this.$store.state.classInfo.properties;
            this.handleSelectOptions();

        }
    };
</script>

<style scoped>

</style>
