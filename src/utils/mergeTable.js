// 投放数据表格合并
export function mergeDeliveryReportTable(data, merge, summaryCol) {
    if (!merge || merge.length === 0) {
        return data;
    }

    // 循环数据列表
    for (let i = 0; i < data.length; i++) {
        let rowData = data[i];

        // 循环需要组合的行
        merge.forEach((mItem) => {
            const mList = {}; // 记录合并行的数据
            const record = {
                'os': '',
                'game_name': '',
                'get_ad_delivery_user': ''
            }; // 记录上一行的数据，用于与下一行判断是否需要重新计算合并

            // 更新每日的数据
            rowData = rowData.map((row, index) => {
                const cellVal = row[mItem]; // 本行需要合并的字段的数据

                if (mList[mItem] && mList[mItem][cellVal]) {
                    // 系统不相等时，后续行不合并
                    if (record.os != row['os']) {
                        mList['os'] = null;
                        mList['game_name'] = null;
                        mList['get_ad_delivery_user'] = null;
                        // mList['dis_num_daily'] = null;
                        // mList['dis_num'] = null;
                    }
                    // 系统相同但是游戏名不同，后续行不合并
                    if (record.game_name != row['game_name']) {
                        mList['get_ad_delivery_user'] = null;
                        // mList['dis_num_daily'] = null;
                        // mList['dis_num'] = null;
                    }
                    // if (record.get_ad_delivery_user != row['get_ad_delivery_user']) {
                    //     mList['dis_num_daily'] = null;
                    //     mList['dis_num'] = null;
                    // }
                }

                // 更新记录
                record.os = row['os'];
                record.game_name = row['game_name'];
                record.get_ad_delivery_user = row['get_ad_delivery_user']

                if (mList[mItem] && mList[mItem][cellVal]) { // 已存在该字段的记录，合并行加一
                    rowData[index - mList[mItem][cellVal]][mItem + '-span'].rowspan++;
                    mList[mItem][cellVal]++;
                    row[mItem + '-span'] = {
                        rowspan: 0,
                        colspan: 0
                    };
                } else { // 还未记录该字段，初始化合并行数据
                    mList[mItem] = {};
                    mList[mItem][cellVal] = 1;
                    row[mItem + '-span'] = {
                        rowspan: 1,
                        colspan: 1
                    };
                }

                return row; // 返回该行数据
            })
        })

        // 设置汇总行合并单元格数据
        for (let j in rowData) {
            let row = rowData[j];
            if (row.summaryFlag) {
                row['game_name-span'] = {
                    rowspan: 1,
                    colspan: summaryCol
                }
                row['get_ad_delivery_user-span'] = {
                    rowspan: 0,
                    colspan: 0
                }
                row['channel-span'] = {
                    rowspan: 0,
                    colspan: 0
                }
            }
        }
    }
    
    return data;
}
