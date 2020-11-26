<template>
  <div>
    <el-tooltip class="item" effect="dark" content="默认选择的游戏数据库" placement="top-start">
      <el-select
        v-model="game_id"
        placeholder="请选择游戏"
        size="medium"
        style="width: 180px"
        clearable
        filterable
        @change="changeGame()"
        @clear="clearGame()"
      >
        <el-option
          v-for="item in gameList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>
<script>
import { getGameList } from "@/api/common/queryCriteria";
import { setStore, getStore, removeStore } from "@/utils/store";
export default {
  name: "GameSelect",
  data() {
    return {
      gameList: [],
      game_id: null,
      key_word: ""
    };
  },
  created() {
    this.getList();
    if (getStore({ name: "game_id" }) != undefined)
      this.game_id = getStore({ name: "game_id" });
    if (getStore({ name: "key_word" }) != undefined)
      this.key_word = getStore({ name: "key_word" });
  },
  methods: {
    getList() {
      getGameList().then(response => {
        this.gameList = response.data.list;
        if (getStore({ name: "game_id" }) == undefined) {
          for (var i = this.gameList.length - 1; i >= 0; i--) {
             setStore({ name: "game_id", content:  this.gameList[i].value });
             setStore({ name: "key_word", content: this.gameList[i].key_word });
                location.reload();
          }
        }
      });
    },
    changeGame() {
      if (this.game_id != null) {
        setStore({ name: "game_id", content: this.game_id });
        for (let i in this.gameList) {
          if (this.gameList[i].value == this.game_id)
            setStore({ name: "key_word", content: this.gameList[i].key_word });
        }
        this.$message({
          message: "切换游戏成功",
          type: "success"
        });
      }
    },
    clearGame() {
      removeStore({ name: "game_id" });
      removeStore({ name: "key_word" });
    }
  }
};
</script>
<style scoped>
.theme-picker {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
