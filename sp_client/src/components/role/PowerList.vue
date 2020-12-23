<template>
  <div class="power">
  <div class="powerList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content"  >
          <!-- 权限信息表格 -->
          <el-table :data="powerList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="id" label="#" width="60px"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level==0" >一级</el-tag>
              <el-tag v-else-if="scope.row.level=='1'" type="success">二级</el-tag>
              <el-tag v-else type="danger" >三级</el-tag>
           </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script>
  export default{
    data:function(){
      return {
        // 等待加载
         loading:false,
         powerList:[]
      }
    },
    mounted:function(){
        this.getPowerList()
    },
    methods:{
        getPowerList:async function(){
          this.loading = true
          var res = await this.axios.get('/rights/list')
          // console.log(res)
          if(res.meta.status == 200){
             this.loading = false
             this.powerList = res.data
          }else
              this.$message.error('权限列表获取失败')
        }
    }
  }
</script>

<style scoped="scoped">
  .power {
    width: 100%;
    background-color: #EAEDF1;
    padding: 15px;
  }

  .powerList {
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
  .el-table{
    margin: 20px auto;
    height: 400px;
    overflow: scroll;
  }

</style>
