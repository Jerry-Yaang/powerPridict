//将csv文件转为表格
// function parseCSVToTable(csv) {
//     var rows = csv.split('\n');
//     var table = '<table><tr><th>DATATIME</th><th>WINDSPEED</th><th>PREPOWER</th><th>WINDDIRECTION</th><th>TEMPERATURE</th><th>HUMIDITY</th><th>PRESSURE</th><th>ROUND(A.WS,1)</th><th>ROUND(A.POWER,0)</th><th>YD15</th></tr>';
//     for (var i = 1; i < rows.length; i++) {
//       var cells = rows[i].split(',');
//       var row = '<tr>';
//       for (var j = 0; j < cells.length; j++) {
//             row += '<td>' + cells[j] + '</td>';
//       }
//       row += '</tr>';
//       table += row;
//     }
//     table += '</table>';
//     return table;
// }

//生成折线图
function uploadLineChart(file,contents) {
    var formData = new FormData();
    formData.append('file', file);
  
    $.ajax({
      url: '/upload', // 后台处理路由
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        // 处理后台返回的响应数据
        var result_parsedData = $.csv.toArrays(response);
        var real_parsedData = $.csv.toArrays(contents);
        var timeData = real_parsedData.map(row => row[0]);
        var real_powerData = real_parsedData.map(row => row[8]);
        var result_powerData = result_parsedData.map(row => row[0]).map(function(element){
          return Math.round(element);
        });
      
        // 创建折线图
        var chartContainer = document.getElementById('chartContainer');
        var chart = echarts.init(chartContainer);
    
        var option = {
            grid:{
                top:'20%',
                left:'3%',
                right:'4%',
                bottom:'20%',
                show:true,
                borderColor:'#012f4a',
                containLabel:true
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                    }
            },
            legend: {
                data: ['实际影响程度','预测影响程度'],
                textStyle:{
                    color:'#4c9bfd'
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeData,
                axisTick:{
                    alignWithLabel:true
                },
                axisLabel:{
                    color:"rgba(255,255,255,0.6)",
                    fontSize:"12"
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 20
            },
            {
                start: 0,
                end: 20
            }
            ],
            color: ['#00f2f1','#ed3f35'],
            series: [
                {
                    name: '实际影响程度',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: real_powerData
                },
                {
                    name: '预测影响程度',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: result_powerData
                }
            ]
        };
      
        chart.setOption(option);
        window.addEventListener('resize',function(){
            chart.resize();
        })
      },
      error: function() {
        alert('文件上传失败');
      }
    });
}

//生成柱状图
function uploadBarChart(file,contents){
    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/upload', // 后台处理路由
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
          // 处理后台返回的响应数据
          var result_parsedData = $.csv.toArrays(response);
          var real_parsedData = $.csv.toArrays(contents);
          var timeData = real_parsedData.map(row => row[0]);
          var real_powerData = real_parsedData.map(row => row[8]);
          var result_powerData = result_parsedData.map(row => row[0]).map(function(element){
            return Math.round(element);
          });
        
          // 创建柱状图
          var tableContainer = document.getElementById('tableContainer');
          var chart = echarts.init(tableContainer);

          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true
                }
              }
            },
            calculable: true,
            legend: {
                data: ['实际影响程度','预测影响程度'],
                textStyle:{
                    color:'#4c9bfd'
                }
            },
            grid: {
              top: '12%',
              left: '1%',
              right: '10%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: timeData,
                axisTick:{
                    alignWithLabel:true
                },
                axisLabel:{
                    color:"rgba(255,255,255,0.6)",
                    fontSize:"12"
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                boundaryGap: [0, '100%']
              }
            ],
            dataZoom: [
              {
                show: true,
                start: 94,
                end: 100
              },
              {
                type: 'inside',
                start: 94,
                end: 100
              },
              {
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 30,
                height: '80%',
                showDataShadow: false,
                left: '93%'
              }
            ],
            series: [
              {
                name: '实际影响程度',
                type: 'bar',
                data: real_powerData
              },
              {
                name: '预测影响程度',
                type: 'bar',
                data: result_powerData
              }
            ]
          };
        
          chart.setOption(option);
          window.addEventListener('resize',function(){
              chart.resize();
          })
        },
        error: function() {
          alert('文件上传失败');
        }
    });
}

//生成饼图
function uploadPieChart(){
    // 创建饼图
    var pieContainer = document.getElementById('pieContainer');
    var chart = echarts.init(pieContainer);

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 'bottom',
          textStyle:{
            color:'#4c9bfd'
        }
        },
        series: [
          {
            name: '影响因素占比',
            type: 'pie',
            label: {
                color: '#f0f0f0'
            },
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: parseFloat((Math.random() * 5 + 5).toFixed(2)), name: '高程' },
              { value: parseFloat((Math.random() * 5 + 5).toFixed(2)), name: '坡向' },
              { value: parseFloat((Math.random() * 3 + 3).toFixed(2)), name: '降水量' },
              { value: parseFloat((Math.random() * 1 + 1).toFixed(2)), name: '湿度' },
              { value: parseFloat((Math.random() * 1 + 1).toFixed(2)), name: '坡度' }
            ]
          }
        ]
    };
    chart.setOption(option);
    window.addEventListener('resize',function(){
        chart.resize();
    })
}

//生成纵向条形图
function uploadColumnChart(file,contents){
    var formData = new FormData();
    formData.append('file', file);
  
    $.ajax({
      url: '/upload', // 后台处理路由
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        // 处理后台返回的响应数据
        var result_parsedData = $.csv.toArrays(response);
        var real_parsedData = $.csv.toArrays(contents);
        //时间数据
        var timeData = real_parsedData.map(row => row[0]);
        //风速数据
        var windSpeedData = real_parsedData.map(row => row[1]);
        //风向数据
        var windDirectionData = real_parsedData.map(row => row[3]).map(function(element){
            return element / 20;
        });
        //气温数据
        var temperatureData = real_parsedData.map(row => row[4]);
        //湿度数据
        var humidityData = real_parsedData.map(row => row[5]).map(function(element){
            return element / 5;
        });
        //气压数据
        var pressureData = real_parsedData.map(row => row[6]).map(function(element){
            return element / 50;
        });
        //真实功率
        var real_powerData = real_parsedData.map(row => row[9]);
        //预测功率
        var result_powerData = result_parsedData.map(row => row[0]);
      
        // 创建条形图
        var columnContainer = document.getElementById('columnContainer');
        var chart = echarts.init(columnContainer);

        var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
                textStyle:{
                    color:'#4c9bfd'
                }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              //containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, '100%'],
              axisLabel:{
                color:"rgba(255,255,255,0.6)",
                fontSize:"12"
              }
            },
            yAxis: {
              type: 'category',
              axisLabel:{
                color:"rgba(255,255,255,0.6)",
                fontSize:"12"
              },
              data: timeData
            },
            dataZoom: [
                {
                  show: true,
                  start: 0,
                  end: 50
                },
                {
                  type: 'inside',
                  start: 0,
                  end: 50
                },
                {
                  show: true,
                  yAxisIndex: 0,
                  filterMode: 'empty',
                  width: 30,
                  height: '80%',
                  showDataShadow: false,
                  left: '90%',
                  start: 94,
                  end: 97
                }
            ],
            series: [
              {
                name: '高程',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: windSpeedData
              },
              {
                name: '坡向/20',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: windDirectionData
              },
              {
                name: '降水量',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: temperatureData
              },
              {
                name: '坡度/5',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: humidityData
              },
              {
                name: '土壤/50',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: pressureData
              }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize',function(){
            chart.resize();
        })
      },
      error: function() {
        alert('文件上传失败');
      }
    });
}
  

$(function(){

    // 监听文件上传
    $('#csvFile').on('change', function(e) {
        var file = e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function(e) {
            var contents = e.target.result;

            // 调用后台处理函数，生成实际功率和预测功率的折线图
            uploadLineChart(file,contents);
            uploadBarChart(file,contents);
            uploadPieChart();
            uploadColumnChart(file,contents);
          };
          reader.readAsText(file);
        }
        alert("上传成功！");
        //表格展示完成才会显示进一步操作按钮
        // $('#furtherBtn').show();
    });
})