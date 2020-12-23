<template>
  <div class="main_vue">
  <div class="navbar">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content" v-loading="loading" >
          <div id="main" style="width: 600px;height:400px;"></div>
        </div>
    </div>
</template>

<script>

  import echarts from 'echarts'

  export default{
    data(){
      return {
        // 等待加载
         loading:false,
         options:{},
         chartLine:''
      }
    },
    mounted(){
      this.getData()
    },
    methods:{
        // 获取数据统计
         async getData(){
           this.loading = true
           var res = await this.axios.get('/reports/type/1')
           // console.log(res)
           if(res.meta.status == 200){
              this.options = res.data

           // 向已存在对象添加属性值
           Object.defineProperty(this.options,'title',{
             value:{
               text:'用户来源',
             },
             writable:true,  //可以改变添加的属性值
             enumerable:true,  //可以读取添加的属性
             configurable:true   //可以删除添加的属性
           })
           Object.defineProperty(this.options.xAxis[0],'boundaryGap',{
             value:false,
             writable:true,  //可以改变添加的属性值
             enumerable:true,  //可以读取添加的属性
             configurable:true   //可以删除添加的属性
           })

           this.loading = false
           this.showDataPic()
          }else{
            this.$message.error('获取数据失败')
          }
         },
        //展示数据统计折线图
         showDataPic(){
           this.chartLine = echarts.init(document.getElementById('main'));
           this.chartLine.setOption(this.options);
         }
    }
  }
</script>

<style scoped="scoped">
  .main_vue {
    width: 100%;
    background-color: #EAEDF1;
    padding: 15px;
  }

  .navbar {
    width: 100%;
    height: 40px;
  }

  .content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin-top: -10px;
    background-color: #fff;
  }

</style>
