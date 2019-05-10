<template>
    <section>
        <CommonCRUD
            :formColumns="formColumns"
            apiRoot="/identity/hiddenIssue"
            :columns="columns">
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: 'HiddenIssue',
        data() {
            return {
                formColumns:[],
                columns:[]
            }

        },
        methods:{
            handleSelectOptions() {
                let  items = [
                    ['issueGrade', 'IssueType']
                ].forEach(item => {
                        this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                    }
                )
                tansfer(this.columns);
            },
        },
        components :{
            CommonCRUD
        },
        created () {
            this.formColumns = this.$store.state.classInfo.properties
            this.columns = this.$store.state.classInfo.properties
            this.handleSelectOptions();
        }
    };
</script>

<style scoped>

</style>
