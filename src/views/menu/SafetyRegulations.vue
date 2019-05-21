<template>
    <section>
        <CommonCRUD :queryFormColumns="queryColumns" :columns="columns" apiRoot="/identity/safetyRegulations"
                    :formColumns="formColumns" >
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';

    export default {
        name: 'SafetyRegulations',
        data() {
            return {
                formColumns: [],
                columns:[],
                queryColumns:[
                    {
                        des: '名称',
                        name: 'name',
                        visible:true,
                        type: 'string'
                    }
                ],
            }
        },
        methods:{
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
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns = this.$store.state.classInfo.properties;
            this.columns = this.$store.state.classInfo.properties;
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
