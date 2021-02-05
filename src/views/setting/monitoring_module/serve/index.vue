<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>CPU</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf">
                    <div class="cell">属性</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">值</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="cell">模型</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.cpu_info">{{ server.cpu_info.model }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">核心数</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.cpu_info">{{ server.cpu_info.num_text }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">CPU频率</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.cpu_info">{{ server.cpu_info.mhz }}%</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">CPU缓存</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.cpu_info">{{ server.cpu_info.cache }}%</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">Bgomips</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.cpu_info">{{ server.cpu_info.bogomips }}%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>内存</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf">
                    <div class="cell">属性</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">内存</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">真实</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="cell">总内存</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.memory_info">{{ server.memory_info.mem_total }}MB</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.memory_info">{{ server.memory_info.mem_total }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">已用内存</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.memory_info">{{ server.memory_info.mem_used}}MB</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.memory_info"
                    >{{ server.memory_info.mem_real_used }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">空闲内存</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.memory_info">{{ server.memory_info.mem_free }}MB</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.memory_info"
                    >{{ server.memory_info.mem_real_free }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">使用率</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.memory_info"
                      :class="{'text-danger': server.memory_info.usage > 80}"
                    >{{ server.memory_info.mem_usage}}%</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.memory_info"
                    >{{ server.memory_info.mem_real_percent }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">缓存内存</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.memory_info"
                    >{{ server.memory_info.mem_cached }}MB</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.memory_info">--</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>服务器信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td>
                    <div class="cell">服务器名称</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.serve_name }}</div>
                  </td>
                  <td>
                    <div class="cell">操作系统</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.os }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">服务器运行时间</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.uptime }}</div>
                  </td>
                  <td>
                    <div class="cell">项目架构</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.architecture }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>PHP信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td>
                    <div class="cell">PHP版本</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.php_version }}</div>
                  </td>
                  <td>
                    <div class="cell">PHP运行方式</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.php_run_type }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">Zend版本</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.serve_info.zend_version }}</div>
                  </td>
                  <td>
                    <div class="cell">运行时长</div>
                  </td>
                  <td>
                    <div class="cell" v-if="server.serve_info">{{ server.uptime}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <!-- <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>磁盘状态</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf">
                    <div class="cell">盘符路径</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">文件系统</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">盘符类型</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">总大小</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">可用大小</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">已用大小</div>
                  </th>
                  <th class="is-leaf">
                    <div class="cell">已用百分比</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.serve_infoFiles">
                <tr v-for="sysFile in server.serve_infoFiles">
                  <td>
                    <div class="cell">{{ sysFile.dirName }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.sysTypeName }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.typeName }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.total }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.free }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.used }}</div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      :class="{'text-danger': sysFile.usage > 80}"
                    >{{ sysFile.usage }}%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { getServer } from '@/api/setting/monitoring_module/serve'

export default {
  name: 'Server',
  data() {
    return {
      // 加载层信息
      loading: [],
      // 服务器信息
      server: [],
    }
  },
  created() {
    this.getList()
    this.openLoading()
  },
  methods: {
    /** 查询服务器信息 */
    getList() {
      getServer().then((response) => {
        this.server = response.data
        this.loading.close()
      })
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命读取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },
  },
}
</script>

<style lang="scss">
.card-box {
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: 10px;
}
</style>