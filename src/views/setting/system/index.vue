    <template>
    <div>
        <el-card class="box-card">
            <el-card shadow="never">
              <i class="el-icon-tickets"></i>
              <span>{{ $route.meta.title}}</span>
            </el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <el-table
                      border
                      :data="config"
                      style="width: 100%">
                      <el-table-column
                        label="配置项"
                        width="200">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="配置信息"
                        >
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.config }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="前端信息" name="api">
                   <el-table
                      border
                      :data="api_config"
                      style="width: 100%">
                      <el-table-column
                        label="配置项"
                        width="200">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="配置信息"
                        >
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.config }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                 <el-tab-pane label="项目信息" name="project_info">
                   <el-table
                      border
                      :data="project_info"
                      style="width: 100%">
                      <el-table-column
                        label="配置项"
                        width="200">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="配置信息"
                        >
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.config }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import {getSystemConfig} from '@/api/system'
    export default {
        data() {
            return {
                activeName: 'index',
                config: [],
                api_config: [],
                project_info: [],
            }
        },

        mounted() {
            getSystemConfig().then(response => {
                this.config = response.data.config;
                this.project_info = response.data.project_info;
            });

            this.api_config = [
                {
                    name: '项目名',
                    config: 'Vue-admin-template',
                    icon: 'el-icon-delete-solid'
                },
                {
                    name: '前端框架',
                    config: 'Vue 2.0',
                    icon: 'fa fa-html5'
                },
                {
                    name: '前端UI框架',
                    config: 'Element UI 2.12.0',
                    icon: 'fa fa-css3'
                },
            ];

        },

        components: {}
    }
</script>
<style>

</style>
