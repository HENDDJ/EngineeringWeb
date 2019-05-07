<template>
    <section>
        <CommonCRUD :formColumns="formColumns" :columns="$store.state.classInfo.properties" apiRoot="/identity/safetyMode"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SafetyMode',
        data(){
            return {
                formColumns :{}
            }
        },
        methods :{
            loadDepartmentOptions() {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'conveningOrg')[0].options = data.map(item => {
                            return {value: item.name, label: item.name}
                        });
                    }
                )
            }
        },
        components :{
            CommonCRUD
        },
        created () {
                this.formColumns = this.$store.state.classInfo.properties;
                this.loadDepartmentOptions();
        }
    };
</script>

<style scoped>

</style>
