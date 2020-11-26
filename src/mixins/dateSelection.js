export const dateSelection = {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
            text: "今天",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today);
              end.setTime(today + 3600 * 24 * 1000 - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today - 3600 * 24 * 1000);
              end.setTime(today - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
           {
            text: "前天",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today - (3600 * 24 * 1000) * 2);
              end.setTime(today - 3600 * 24 * 1000 - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              end.setTime(today + 3600 * 24 * 1000 - 1000);
              start.setDate(1);
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const end = gettimeEnd()
              const start = gettimeStart()
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              end.setHours(0);
              end.setMinutes(0);
              end.setSeconds(0);
              picker.$emit('pick', [start, end])

              function gettimeStart() {
                const nowdays = new Date()
                let year = nowdays.getFullYear()
                let month = nowdays.getMonth()
                if (month === 0) {
                  month = 12
                  year = year - 1
                }
                if (month < 10) {
                  month = '0' + month
                }
                let firstDayOfPreMonth = year + '-' + month + '-' + '01'
                firstDayOfPreMonth = firstDayOfPreMonth.toString()
                return new Date(firstDayOfPreMonth)
              }

              function gettimeEnd() {
                const nowdays = new Date()
                let year = nowdays.getFullYear()
                let month = nowdays.getMonth()
                if (month === 0) {
                  month = 12
                  year = year - 1
                }
                if (month < 10) {
                  month = '0' + month
                }
                const lastDay = new Date(year, month, 0)
                let lastDayOfPreMonth = year + '-' + month + '-' + lastDay.getDate()
                lastDayOfPreMonth = lastDayOfPreMonth.toString()
                return new Date(lastDayOfPreMonth)
              }
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today - 3600 * 24 * 7 * 1000);
              end.setTime(today + 3600 * 24 * 1000 - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today - 3600 * 24 * 30 * 1000);
              end.setTime(today + 3600 * 24 * 1000 - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const today = new Date(new Date().toLocaleDateString()).getTime();
              const end = new Date();
              const start = new Date();
              start.setTime(today - 3600 * 24 * 90 * 1000);
              end.setTime(today + 3600 * 24 * 1000 - 1000);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    }
  }
}
