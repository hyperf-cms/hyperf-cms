<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-card shadow="never">
                <i class="el-icon-tickets"></i>
                <span>{{ $route.meta.title }}</span>
                <el-button style="float: right;" icon="el-icon-plus" type="primary" size="mini" @click="handleViewConfig('add', '')">添加配置</el-button>
            </el-card>
        </el-card>
        <div class="table-container">
            <el-table ref="configTable" :data="list" style="width: 100%;" size="mini" v-loading="listLoading">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="名称">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="值">
                    <template slot-scope="scope">{{ scope.row.value }}</template>
                </el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">{{ scope.row.description }}</template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">{{ scope.row.type }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-dropdown size="mini" type="warning" trigger="click">
                            <el-button icon="el-icon-more" type="primary" size="mini" class="button-color-violet">
                                操作菜单<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item divided>
                                    <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleViewConfig('edit', scope.row)">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item divided>
                                    <el-button icon="el-icon-delete" type="danger" size="mini" @click="handleDeleteConfig(scope.row)">删除</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.cur_page" :page-size="listQuery.page_size" :page-sizes="[10,20,30,50,80,100]" :total="total">
            </el-pagination>
        </div>
        <!-- 添加/修改配置 -->
        <el-dialog title="添加配置" :visible.sync="createConfigDialogVisible" width="500px" :close-on-click-modal="false">
            <el-form ref="configForm" :model="configForm" :rules="configRules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="configForm.name" plachod auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="value">
                    <el-input v-model="configForm.value" plachod auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="configForm.type">
                        <el-option v-for="(item, index) in configType" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" v-model="configForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="createConfigDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleAddConfig()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { systemGlobalConfigList,createGlobalConfig,updateGlobalConfig,deleteGlobalConfig } from "@/api/system/globalConfig";

    const defaultListQuery = {
        cur_page: 1,
        page_size: 20,
        role_name: null,
    };

    const defaultType = [{
        value: 1,
        label: '变量'
    }, {
        value: 2,
        label: '常量'
    }];

    export default {
        name: "systemGlobalConfigList",
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
                listLoading: true,
                list: null,
                total: null,
                type: null,
                createConfigDialogVisible: false,
                configType: Object.assign({}, defaultType),
                editKey: {
                    name: name,
                    type: null
                },
                configForm: {
                    name: null,
                    value: null,
                    type: null,
                    description: null
                },
                configRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    value: [
                        { required: true, message: '请输入值', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    description: [
                        { required: false, message: '请输入描述', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                systemGlobalConfigList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
            },
            handleViewConfig(type, data) {
                this.createConfigDialogVisible = true;
                this.type = type;
                if (type === 'edit') {
                    this.configForm.name = data.name;
                    this.configForm.value = data.value;
                    this.configForm.type = this.getConfigType(data.type);
                    this.configForm.description = data.description;
                    this.editKey.name = data.name;
                    this.editKey.type = this.getConfigType(data.type);
                } else {
                    this.configForm.name = null;
                    this.configForm.value = null;
                    this.configForm.type = this.configType[0].value;
                    this.configForm.description = null;
                }
            },
            handleAddConfig() {
                this.$refs['configForm'].validate((valid) => {
                    if (valid) {
                        this.createConfigDialogVisible = false;
                        this.listLoading = true;
                        if (this.type === 'add') {
                            createGlobalConfig({ postData: this.configForm }).then(response => {
                                if (response.errorCode == 200) {
                                    this.getList();
                                    this.listLoading = false
                                }
                            })
                        } else {
                            updateGlobalConfig(this.editKey.name, { postData: this.configForm, editKey: this.editKey }).then(response => {
                                if (response.errorCode == 200) {
                                    this.getList();
                                    this.listLoading = false
                                }
                            })
                        }
                    }
                });
            },
            handleDeleteConfig(row) {
                this.$confirm('是否要进行该删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGlobalConfig(row['name'], { type: this.getConfigType(row.type) }).then(response => {
                        this.getList();
                    });
                })
            },
            getConfigType($type) {
                for (let i in this.configType) {
                    if ($type == this.configType[i]['label']) {
                        return this.configType[i]['value'];
                    }
                }
            },
            handleSizeChange(val) {
                this.listQuery.cur_page = 1;
                this.listQuery.page_size = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.cur_page = val;
                this.getList();
            },
        }
    }
</script>

<style scoped>

</style>
