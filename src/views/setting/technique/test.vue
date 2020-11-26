<template>
  <div class="demo">
    <el-transfer
      v-model="value"
      filterable
      :data="data"
      :filter-method="filterMethod"
      :target-order="'push'"
      :titles="['左边数据', '右边数据']"
      :props="{ key: 'id', label: 'label' }"
      :left-default-checked="hasCheckedWHLeftData"
      @left-check-change="handleWHLeftChange"
      :right-default-checked="hasCheckedWHRightData"
      @right-check-change="handleWHRightChange"
    ></el-transfer>
  </div>
</template>
<script>
import Sortable from "sortablejs";
const generateData = () => {
  const data = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      id: i,
      label: `备选项 ${i}`,
    });
  }
  return data;
};
export default {
  name: "DragSortMultiSelect",
  data() {
    return {
      filterMethod(query, item) {
        let regStr = query.replace(/\*/g, ".*");
        let reg = new RegExp(regStr);
        return reg.test(item.label);
      },
      data: generateData(),
      value: [4, 2, 1],
      shiftKey: false,
      firstWHLeftLocation: -1, //数据左边起始值
      lastWHLeftLocation: -1, //数据左边终止值
      hasCheckedWHLeftData: [], //数据左边选中的数据
      firstWHRightLocation: -1, //数据右边起始值
      lastWHRightLocation: -1, //数据右边终止值
      hasCheckedWHRightData: [], //数据右边选中的数据
    };
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 16 && e.shiftKey) {
        this.shiftKey = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      this.shiftKey = false;
    });
    let el = document
      .querySelector(".el-transfer")
      .querySelectorAll(".el-checkbox-group")[1];
      console.log(el);
    new Sortable(el, {
      forceFallback: false,
      onUpdate: (event) => {
        let box = this.$el
          .querySelector(".el-transfer")
          .querySelectorAll(".el-checkbox-group")[1];
        let nums = this.$el
          .querySelector(".el-transfer")
          .querySelectorAll(".el-checkbox-group")[1].childNodes.length;
        console.log(nums, event.newIndex);
        if (event.newIndex >= nums) {
          return;
        }
        let newIndex = event.newIndex;
        let oldIndex = event.oldIndex;
        let $label = box.children[newIndex];
        let $oldLabel = box.children[oldIndex];
        box.removeChild($label);
        if (newIndex < oldIndex) {
          box.insertBefore($label, $oldLabel);
        } else {
          box.insertBefore($label, $oldLabel.nextSibling);
        }
        let item = this.value.splice(oldIndex, 1);
        this.value.splice(newIndex, 0, item[0]);
      },
    });
  },
  methods: {
    // 数据左侧列表元素被用户选中 / 取消选中时触发
    handleWHLeftChange(key, key1) {
      var _this = this;
      console.log(_this.hasCheckedWHLeftData);
      _this.hasCheckedWHLeftData = _this.commonChangeFuc(
        key,
        key1,
        _this.hasCheckedWHLeftData,
        _this.firstWHLeftLocation,
        _this.lastWHLeftLocation,
        _this.data,
        "id"
      );
      console.log(_this.hasCheckedWHLeftData);
    },
    // 数据右侧列表元素被用户选中 / 取消选中时触发
    handleWHRightChange(key, key1) {
      var _this = this;
      console.log(_this.hasCheckedWHRightData);
      _this.hasCheckedWHRightData = _this.commonChangeFuc(
        key,
        key1,
        _this.hasCheckedWHRightData,
        _this.firstWHRightLocation,
        _this.lastWHRightLocation,
        _this.value,
        false
      );
      console.log(_this.hasCheckedWHRightData);
    },
    // 公共按住shift 多选
    commonChangeFuc(
      key,
      key1,
      hasCheckedData,
      firstLocation,
      lastLocation,
      arrList,
      value
    ) {
      var _this = this;
      var cFlag = false; //取消勾选
      // debugger
      for (var i = 0; i < key.length; i++) {
        if (key[i] == key1[0]) {
          cFlag = true; //选中
        }
      }
      if (cFlag) {
        if (key.length == 1) {
          firstLocation = 0;
          hasCheckedData.push(key[0]);
        } else if (key.length > 1) {
          let arr = [];
          // 当前有选中数据 并且 按住shift
          if (_this.shiftKey) {
            // if (isRight) {
            for (let i = 0; i < arrList.length; i++) {
              let item = value ? arrList[i][value] : arrList[i];
              if (item == key[key.length - 2]) {
                firstLocation = i;
              }
              if (item == key1[0]) {
                lastLocation = i;
              }
            }
            if (firstLocation != -1 && lastLocation != -1) {
              if (firstLocation < lastLocation) {
                for (var k = 0; k < arrList.length; k++) {
                  let item = value ? arrList[k][value] : arrList[k];

                  if (k >= firstLocation && k <= lastLocation) {
                    hasCheckedData.push(item);
                  }
                }
              } else if (firstLocation > lastLocation) {
                for (var k = 0; k < arrList.length; k++) {
                  if (k >= lastLocation && k <= firstLocation) {
                    hasCheckedData.push(item);
                  }
                }
              }
            }
          } else {
            //不再按shift
            hasCheckedData.push(key1[0]);
          }
        }
      } else {
        //取消选中的
        hasCheckedData = [];
        for (var i = 0; i < key.length; i++) {
          if (key[i] != key1[0]) {
            hasCheckedData.push(key[i]);
          }
        }
      }
      // 去重
      hasCheckedData = new Set(hasCheckedData);
      hasCheckedData = Array.from(hasCheckedData);
      return hasCheckedData;
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
/deep/ .el-transfer__buttons {
  /deep/ button {
    display: block;
    margin: 0;

    &:first-child {
      margin-bottom: 12px;
    }
  }
}

.demo {
  text-align: left;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  width: 300px;
  height: 300px;
  background-color: #42b983;
  overflow: scroll;
}

li {
  display: block;
  margin: 20px 10px;
  border: 1px solid #444;
}

a {
  color: #42b983;
}
</style>
