<template>
    <span>
        <el-tooltip
          :effect="effect"
          :placement="placement"
        >
            <div v-html="toBreak(content)" slot="content"></div>
            <slot name="tipBtn">
                <i class="el-icon-question" :style="{color: btnColor}"></i>
            </slot>
        </el-tooltip>
    </span>
</template>

<script>
export default {
    name: 'Tip',
    props: {
        // 样式主题
        effect: {
            type: String,
            default: 'dark'
        },
        // 提示内容
        content: {
            type: String,
            default: ''
        },
        // 提示位置
        placement: {
            type: String,
            defualt: 'top'
        },
        // 提示按钮颜色
        btnColor: {
            type: String,
            default: '#1989fa'
        }
    },
    methods: {
        toBreak (val) {
          return val.replace(/\n/g, '<br />');
        },
    }
}
</script>
