<template>
    <section>
        <CommonCRUD :formColumns="formColumns" :columns="columns" apiRoot="/identity/safetyMode">
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SafetyMode',
        data(){
            return {
                columns:[],
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
            },
            handleEnc(){
                this.columns = [];
                this.columns.length = 0;
                let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
                this.columns = temp;
                var columsItems = {slot:true,name:'enclosure',des:'附件',slotName:'handle'};
                this.columns.push(columsItems);
            },
            downLoad(row){
                window.open(row.enclosure.split("&")[0],'_self')
            }
        },
        components :{
            CommonCRUD
        },
        created () {
                this.formColumns = this.$store.state.classInfo.properties;
                this.columns = this.$store.state.classInfo.properties;
                this.loadDepartmentOptions();
                this.handleEnc();
        }
    };
</script>

<style scoped>
    .encStyle{
        color: blue;
        text-decoration: none;
        cursor: pointer;
    }

    .encStyle:hover{
        text-decoration: underline;
        cursor: pointer;
    }

</style>
