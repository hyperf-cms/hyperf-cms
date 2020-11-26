<template>
  <el-card class="filter-container" shadow="never">
    <div>
      <i class="el-icon-search"></i>
      <span>筛选搜索</span>
      <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
      <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
    </div>
    <div style="margin-top: 30px">
      <el-form :inline="true" :model="this.listQuery" size="small">
        <slot name="frontExtraForm"></slot>
        <el-form-item label="游戏原名：" v-if="selection.indexOf('game')>-1">
          <el-select v-model="listQuery.game_id" filterable default-first-option placeholder="请选择游戏原名" clearable @change="changeGameId($event)">
            <el-option v-for="item in lists.gameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="selection.indexOf('game')>-1" style="margin: 0;">
          <el-input type="hidden" v-model="listQuery.key_word"></el-input>
        </el-form-item>
        <el-form-item label="游戏推广名：" v-if="selection.indexOf('game')>-1 && !this.gameOnly && listQuery.game_id != null">
          <el-select v-model="listQuery.game_promotion_id" filterable default-first-option placeholder="请选择游戏推广名" clearable @change="changeGamePromotionId($event)">
            <el-option v-for="item in lists.gamePromotionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统：" v-if="system">
          <el-select v-model="listQuery.os" default-first-option placeholder="请选择系统" clearable @change="handleOsChange($event)">
            <el-option label="安卓" :value="0"></el-option>
            <el-option label="IOS" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放人员：" v-if="selection.indexOf('user')>-1">
          <el-select v-model="listQuery.user_id" filterable default-first-option placeholder="请选择投放人员" clearable :multiple="isCpMultiple">
            <el-option v-for="item in lists.userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放组：" v-if="selection.indexOf('user')>-1">
          <el-select v-model="listQuery.user_group_id" filterable default-first-option placeholder="请选择投放组" clearable>
            <el-option v-for="item in lists.userGroupList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级渠道：" v-if="selection.indexOf('cp')>-1">
          <el-select v-model="listQuery.cp_id" filterable default-first-option placeholder="请选择一级渠道" clearable :multiple="isCpMultiple" @change="getPack()">
            <el-option v-for="item in lists.cpList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级渠道：" v-if="selection.indexOf('channel')>-1">
          <el-select v-model="listQuery.channel_id" filterable default-first-option placeholder="请选择二级渠道" clearable @change="getPack()">
            <el-option v-for="item in lists.channelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级渠道：" v-if="this.pack && listQuery.game_id != null && listQuery.game_promotion_id != null">
          <el-select v-model="listQuery.pack_id" filterable default-first-option placeholder="请选择三级渠道" clearable @change="changePackId($event)">
            <el-option v-for="item in lists.packList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测链接：" v-if="this.list && listQuery.game_id != null && listQuery.game_promotion_id != null && listQuery.pack_id != null">
          <el-select v-model="listQuery.list_id" filterable default-first-option placeholder="请选择监测链接" clearable>
            <el-option v-for="item in lists.linkList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测链接ID：" v-if="listId && !listQuery.pack_id">
          <el-input v-model="listQuery.list_id" clearable placeholder="请填写监测链接ID："></el-input>
        </el-form-item>
        <el-form-item label="TrackKey：" v-if="trackKey">
          <el-input v-model="listQuery.track_key" placeholder="请填写需要搜索的track_key"></el-input>
        </el-form-item>
        <el-form-item label="显示百分比：" v-if="percentage">
          <el-select v-model="listQuery.isPercentage" default-first-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过滤ASO：" v-if="aso">
          <el-select v-model="listQuery.isASO" default-first-option>
            <el-option label="全部" value=""></el-option>
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道类型：" v-if="channelType">
          <el-select v-model="listQuery.channel_type" clearable>
            <el-option label="买量" value="cn"></el-option>
            <el-option label="联运" value="ly"></el-option>
          </el-select>
        </el-form-item>
        <slot name="extraForm"></slot>
        <el-form-item :label="timeLabel + '：'" v-if="time">
          <el-date-picker v-model="listQuery.date" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" :clearable="!timeRequired" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
import { getAdQueryLists } from "@/api/common/queryCriteria";
import { formatDate, getDefaultTime } from "@/utils/date";
import { dateSelection } from "@/mixins/dateSelection";
import { setStore, getStore, removeStore } from "@/utils/store";

export default {
  name: "selectionList",
  props: {
    // 默认条件
    defaultListQuery: {
      type: Object,
      default: {}
    },
    // 搜索条件
    listQuery: {
      type: Object,
      default: {}
    },
    // 可查询的选项
    selection: {
      type: Array,
      default: []
    },
    // 是否开启系统查询选项
    system: {
      type: Boolean,
      default: true
    },
    // 是否开启监测链接ID填写筛选选项（仅在未选择三级渠道和监测链接时显示）
    listId: {
      type: Boolean,
      default: false,
    },
    // 是否开启TrackKey查询选项
    trackKey: {
      type: Boolean,
      default: false
    },
    // 是否显示百分比
    percentage: {
      type: Boolean,
      default: false
    },
    // 是否过滤ASO
    aso: {
      type: Boolean,
      default: false
    },
    // 是否开启时间查询选项
    time: {
      type: Boolean,
      default: false
    },
    // 是否设置时间选项为必选
    timeRequired: {
      type: Boolean,
      default: true
    },
    // 时间筛选的label名
    timeLabel: {
      type: String,
      default: "时间搜索"
    },
    // 不需要推广名选择
    gameOnly: {
      type: Boolean,
      default: false
    },
    // 是否开启联运渠道过滤选项
    channelType: {
      type: Boolean,
      default: false
    },
    // 一级渠道是否开启多选
    isCpMultiple: {
      type: Boolean,
      default: false,
    },
    // 投放人员是否开启多选
    isUserMultiple: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [dateSelection],
  data() {
    return {
      lists: [],
      pack: this.selection.indexOf("pack") > -1,
      list: this.selection.indexOf("list") > -1,
    };
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function(val) {
        let route = this.$route.name;
        let data = getStore({ name: 'query_selection' });
        if (data == undefined) data = {};
        this.setStorageValue(route, data);
        return val;
      }
    }
  },
  created() {
    // 从缓存读取指定筛选项
    let route = this.$route.name;
    let data = getStore({ name: 'query_selection' });
    if (data == undefined) data = {};

    let originGamePromotionId = null;
    let originPackId = null;
    let queryData = data[route];
    let expiredAt = queryData == undefined ? 0 : queryData['storageExpiredAt'];
    let now = (new Date()).getTime();
    if (queryData == undefined || now > expiredAt) { // 判断是否没有缓存或缓存是否过期
      if (this.time && this.timeRequired) { // 设置默认时间
        this.addDefaultTimeQuery();
      }

      // 设置默认游戏
      this.addDefaultGame();

      this.setStorageValue(route, data);
    } else {
      for (let i in queryData) {
        if (i == 'storageExpiredAt') continue;
        this.listQuery[i] = queryData[i];
      }
      originGamePromotionId = this.listQuery.game_promotion_id;
      originPackId = this.listQuery.pack_id;
    }

    // 获取搜索列表
    getAdQueryLists({
      cp_id: this.listQuery.cp_id,
      channel_id: this.listQuery.channel_id,
      game_id: this.listQuery.game_id,
      game_promotion_id: this.listQuery.game_promotion_id,
      pack_id: this.listQuery.pack_id,
      key: this.selection
    }).then(response => {
      this.lists = response.data;
      this.changeGameId(this.listQuery.game_id);
      if (this.pack && originGamePromotionId) {
        this.listQuery.game_promotion_id = originGamePromotionId;
      }
      if (this.list && originPackId) {
        this.listQuery.pack_id = originPackId;
      }
    });
  },
  methods: {
    setStorageValue(route, data) { // 把筛选项放到缓存中
      let queryData = {};
      for (let i = 0; i < this.selection.length; i++) {
        switch (this.selection[i]) {
          case 'game':
            queryData.game_id = this.listQuery.game_id;
            queryData.key_word = this.listQuery.key_word;
            if (!this.gameOnly) queryData.game_promotion_id = this.listQuery.game_promotion_id;
            break;
          case 'user':
            queryData.user_id = this.listQuery.user_id;
            queryData.user_group_id = this.listQuery.user_group_id;
            break;
          case 'cp':
            queryData.cp_id = this.listQuery.cp_id;
            break;
          case 'channel':
            queryData.channel_id = this.listQuery.channel_id;
            break;
          case 'pack':
            queryData.pack_id = this.listQuery.pack_id;
            break;
          case 'list':
            queryData.list_id = this.listQuery.list_id;
            break;
        }
      }
      if (this.time) {
        queryData.date = this.listQuery.date;
      }
      if (this.system) {
        queryData.os = this.listQuery.os;
      }

      let date = new Date();
      queryData.storageExpiredAt = date.getTime() + 3600 * 1000;

      data[route] = queryData;

      setStore({ name: 'query_selection', content: data });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, this.defaultListQuery);

      if (this.timeRequired) {
        let dateRange = isNaN(this.listQuery.dateRange) ? 7 : this.listQuery.dateRange;
        this.listQuery.date = getDefaultTime(dateRange);
      }

      this.addDefaultGame();
      this.$emit('clickReset'); // 重置按钮点击事件
      this.getList();
    },
    handleSearchList() {
      if (this.time && this.timeRequired && (this.listQuery.date == null || this.listQuery.date.length != 2)) {
        this.$message({
          'message': '请选择时间',
          'type': 'warning'
        });

        return false;
      }

      this.getList();
    },
    getList() {
      this.$emit('update:listQuery', this.listQuery); // 同步更新父组件的listQuery
      this.$emit('getList'); // 触发查询事件
    },
    addDefaultTimeQuery() {
      // 初始化默认查询时间
      // 默认查询30天内的数据
      let dateNum = isNaN(this.listQuery.dateRange) ? 7 : this.listQuery.dateRange;

      this.listQuery.date = getDefaultTime(dateNum);
    },
    addDefaultGame() {
      if (getStore({ name: 'game_id' }) != undefined) {
        this.listQuery.game_id = getStore({ name: 'game_id' });
        this.listQuery.key_word = getStore({ name: 'key_word' });
      }
    },
    handleOsChange(val) {
      this.listQuery = Object.assign({}, this.listQuery, { os: val });
    },
    changeGameId(event) { // 游戏名修改事件
      // 删除关键词
      this.listQuery.key_word = '';

      for (let i in this.lists.gameList) {
        if (this.lists.gameList[i].value == this.listQuery.game_id) {
          this.listQuery.key_word = this.lists.gameList[i].key_word;
        }
      }

      // 不需要推广名
      if (this.gameOnly) return;

      this.listQuery.game_promotion_id = null; // 清空已选择的游戏推广名

      if (event) {
        getAdQueryLists({
          game_id: this.listQuery.game_id,
          key: ["gamePromotion"]
        }).then(response => {
          this.lists = Object.assign({}, this.lists, {
            gamePromotionList: response.data.gamePromotionList
          });
        });
      } else {
        this.listQuery.game_id = null;
        this.listQuery.game_promotion_id = null;
        this.listQuery.pack_id = null;
        this.listQuery.list_id = null;
      }
    },
    changeGamePromotionId(event) {
      // 游戏推广名修改事件
      if (event) {
        this.getPack();
      } else {
        this.listQuery.game_promotion_id = null;
        this.listQuery.pack_id = null;
        this.listQuery.list_id = null;
      }
    },
    getPack() {
      // 获取三级渠道数据
      if (
        !this.pack ||
        this.listQuery.game_id == null ||
        this.listQuery.game_promotion_id == null
      )
        return;

      // 先清空已选择的三级渠道
      this.listQuery.pack_id = null;
      getAdQueryLists({
        cp_id: this.listQuery.cp_id,
        channel_id: this.listQuery.channel_id,
        game_id: this.listQuery.game_id,
        game_promotion_id: this.listQuery.game_promotion_id,
        key: ["pack"]
      }).then(response => {
        this.lists = Object.assign({}, this.lists, {
          packList: response.data.packList
        });
      });
    },
    changePackId(event) {
      // 修改三级渠道
      if (event) {
        this.getlinkList();
      } else {
        this.listQuery.pack_id = null;
      }
    },
    getlinkList() {
      // 获取监测链接（四级渠道）
      if (
        !this.list ||
        this.listQuery.game_id == null ||
        this.listQuery.game_promotion_id == null ||
        this.listQuery.pack_id == null
      )
        return;

      this.listQuery.list_id = null;
      getAdQueryLists({
        cp_id: this.listQuery.cp_id,
        channel_id: this.listQuery.channel_id,
        game_id: this.listQuery.game_id,
        game_promotion_id: this.listQuery.game_promotion_id,
        pack_id: this.listQuery.pack_id,
        key: ["list"]
      }).then(response => {
        this.lists = Object.assign({}, this.lists, {
          linkList: response.data.linkList
        });
      });
    }
  }
};

</script>
