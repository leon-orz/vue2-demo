<template>
  <div class="time-select-wrap">
    <div class="time-mode-block">
      <el-button
        v-for="(item, index) in typeData"
        :key="index"
        :type="dateTimeMode === item.code ? 'primary' : ''"
        @click="handleModeChange(item.code)"
        >{{ item.label }}</el-button
      >
    </div>
    <el-date-picker
      v-model="dateTimeRangeValue"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      @change="handleDateChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'TimeSelect',
  data() {
    return {
      dateTimeMode: 'day',
      dateTimeRangeValue: [
        this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ],
      typeData: [
        { label: '日', code: 'day' },
        { label: '周', code: 'week' },
        { label: '月', code: 'month' },
        { label: '年', code: 'year' },
      ],
    }
  },
  methods: {
    handleDateChange() {
      this.$emit('change', this.dateTimeRangeValue)
    },
    handleModeChange(mode) {
      const end = this.dateTimeRangeValue?.[1] ? this.$moment(this.dateTimeRangeValue[1]) : this.$moment()
      let start = this.$moment(end).clone()

      switch (mode) {
        case 'day':
          start = this.$moment(start).startOf('day')
          break
        case 'week':
          start = this.$moment(start).subtract(6, 'days').startOf('day')
          break
        case 'month':
          start = this.$moment(start).subtract(29, 'days').startOf('day')
          break
        case 'year':
          start = this.$moment(start).subtract(364, 'days').startOf('day')
          break
      }

      this.dateTimeMode = mode
      this.dateTimeRangeValue = [start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss')]
      this.$emit('change', this.dateTimeRangeValue)
    },
  },
}
</script>

<style lang="less" scoped>
.time-select-wrap {
  display: flex;
  align-items: center;
}

.time-mode-block {
  margin: 0 10px;
}
</style>
