import Vue from 'vue';
import Vuex from 'vuex';
import tagsView from './tagsView';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        tagsView
    },
    state: {
        menuList: [],
        classInfo: {},
        //跳入扬尘界面默认工程
        projectId: '278c0a09-e990-448a-931f-62b1d252e4c6',
        projectName: '',
        routerKey: '',
        routerIndex: '',
        isCollapse: false
    },
    mutations: {
        getMenu(state, data) {
            state.menuList = data;
        },
        getClassInfo(state, data) {
            state.classInfo = data;
        },
        getProjectId(state, data) {
            state.projectId = data;
        },
        getProjectName(state, data) {
            state.projectName = data;
        },
        getRouterKey(state, data) {
            state.routerKey = data;
        },
        getRouterIndex(state, data) {
            state.routerIndex = data;
        },
        getIsCollapse(state, data) {
            state.isCollapse = data;
        }
    }
});
