<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/safetyEquipment" :columns="$store.state.classInfo.properties"></CommonCRUD>
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
            }
        },
        components :{
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
