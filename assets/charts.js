// assets/charts.js — 个体户 vs 公司八大场景税务对比图表
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // 场景标签
  var labels = ['S1 200万', 'S2 100万', 'S3 60万', 'S4 50万', 'S5 40万', 'S6 30万', 'S7 20万', 'S8 10万'];

  // 数据
  var indivData = [133.63, 66.00, 43.21, 36.03, 28.89, 21.41, 14.75, 7.10];
  var companyData = [123.93, 61.13, 39.31, 32.93, 26.55, 19.83, 13.70, 7.06];
  var diffData = [9.70, 4.87, 3.90, 3.10, 2.34, 1.58, 1.05, 0.04];
  var indivTaxRate = [15.4, 13.2, 10.7, 9.9, 8.6, 7.7, 6.7, 4.0];
  var companyTaxRate = [22.8, 22.6, 22.4, 22.4, 22.4, 21.7, 19.4, 24.0];

  // --- Chart 1: 到手金额对比 (分组柱状图) ---
  var chartBar = echarts.init(document.getElementById('chart-bar'), null, { renderer: 'svg' });
  chartBar.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var s = '<strong>' + params[0].axisValue + '</strong><br/>';
        params.forEach(function(p) {
          s += p.marker + ' ' + p.seriesName + '：<strong>' + p.value.toFixed(2) + '万</strong><br/>';
        });
        // 计算差额
        var indiv = params[0].value;
        var comp = params[1].value;
        var diff = indiv - comp;
        var sign = diff >= 0 ? '+' : '';
        s += '──────────────<br/>📊 差额：' + sign + diff.toFixed(2) + '万（个体户多拿）';
        return s;
      }
    },
    legend: {
      data: ['个体户到手', '公司到手'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: { left: 60, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: muted, fontSize: 11, rotate: 0 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '到手金额（万元）',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11, formatter: '{value}万' },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: '个体户到手',
        type: 'bar',
        data: indivData,
        itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
        barWidth: '30%',
        barGap: '10%'
      },
      {
        name: '公司到手',
        type: 'bar',
        data: companyData,
        itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] },
        barWidth: '30%'
      }
    ]
  });
  window.addEventListener('resize', function() { chartBar.resize(); });

  // --- Chart 2: 综合税负率对比 (折线图) ---
  var chartTax = echarts.init(document.getElementById('chart-tax'), null, { renderer: 'svg' });
  chartTax.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var s = '<strong>' + params[0].axisValue + '</strong><br/>';
        params.forEach(function(p) {
          s += p.marker + ' ' + p.seriesName + '：<strong>' + p.value.toFixed(1) + '%</strong><br/>';
        });
        var diff = (params[1].value - params[0].value).toFixed(1);
        s += '──────────────<br/>📊 税负率差：' + diff + '%（公司更高）';
        return s;
      }
    },
    legend: {
      data: ['个体户税负率', '公司税负率'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '税负率（%）',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11, formatter: '{value}%' },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      min: 0,
      max: 30
    },
    series: [
      {
        name: '个体户税负率',
        type: 'line',
        data: indivTaxRate,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: accent, width: 3 },
        itemStyle: { color: accent },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: accent + '33' },
              { offset: 1, color: accent + '05' }
            ]
          }
        }
      },
      {
        name: '公司税负率',
        type: 'line',
        data: companyTaxRate,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: { color: accent2, width: 3 },
        itemStyle: { color: accent2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: accent2 + '33' },
              { offset: 1, color: accent2 + '05' }
            ]
          }
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartTax.resize(); });

  // --- Chart 3: 差额趋势 (柱状图 + 折线) ---
  var chartDiff = echarts.init(document.getElementById('chart-diff'), null, { renderer: 'svg' });
  chartDiff.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var bar = params[0];
        var line = params[1];
        var s = '<strong>' + bar.axisValue + '</strong><br/>';
        s += bar.marker + ' 个体户多拿：<strong>' + bar.value.toFixed(2) + '万</strong><br/>';
        if (line) {
          s += line.marker + ' 差额占营收比：<strong>' + line.value.toFixed(1) + '%</strong>';
        }
        return s;
      }
    },
    legend: {
      data: ['个体户多拿金额', '差额占营收比'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: { left: 60, right: 60, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '差额（万元）',
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLabel: { color: muted, fontSize: 11, formatter: '{value}万' },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      {
        type: 'value',
        name: '占比（%）',
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLabel: { color: muted, fontSize: 11, formatter: '{value}%' },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        min: 0,
        max: 15
      }
    ],
    series: [
      {
        name: '个体户多拿金额',
        type: 'bar',
        data: diffData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#059669' },
              { offset: 1, color: '#34d399' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '35%',
        label: {
          show: true,
          position: 'top',
          color: muted,
          fontSize: 10,
          formatter: function(p) { return '+' + p.value.toFixed(2) + '万'; }
        }
      },
      {
        name: '差额占营收比',
        type: 'line',
        yAxisIndex: 1,
        data: [4.85, 4.87, 6.50, 6.20, 5.85, 5.27, 5.25, 0.40],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#8b5cf6', width: 2, type: 'dashed' },
        itemStyle: { color: '#8b5cf6' }
      }
    ]
  });
  window.addEventListener('resize', function() { chartDiff.resize(); });
})();