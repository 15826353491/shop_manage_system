<template>
  <div >
  <div class="header">
    <el-avatar :size="55">
      <img src="../assets/image/default.png"/>
    </el-avatar>
      <span class="title" style="color:#fff">电商后台管理系统</span>
      <a class="userName" href="javascript:;">{{username}}</a>
      <a class="back" href="javascript:;" @click="back">退出</a>
  </div>

<el-container style="height: 565px">
  <el-aside :width="width" style="box-sizing: content-box;">
    <el-switch v-model="value" active-color="#13ce66" inactive-color="#eee" @change="change">
    </el-switch>
    <el-menu :default-openeds="[pageindex]" :collapse="value" >
      <div @click="changPageIndex('1')">
      <el-submenu index="1"  >
        <template slot="title" ><i class="el-icon-user-solid"></i>用户管理</template>
        <el-menu-item-group>
          <router-link to="/index/userlist"><el-menu-item index="1-1"><i class="el-icon-menu"></i>用户列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      </div>

      <div @click="changPageIndex('2')">
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-postcard"></i>权限管理</template>
        <el-menu-item-group>
          <router-link to="/index/rolelist"><el-menu-item index="2-1"><i class="el-icon-menu"></i>角色列表</el-menu-item></router-link>
          <router-link to="/index/powerlist"><el-menu-item index="2-2"><i class="el-icon-menu"></i>权限列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      </div>

      <div @click="changPageIndex('3')">
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-s-shop"></i>商品管理</template>
        <el-menu-item-group>
          <router-link to="/index/goodslist"><el-menu-item index="3-1"><i class="el-icon-menu"></i>商品列表</el-menu-item></router-link>
          <router-link to="/index/goodsdata"><el-menu-item index="3-2"><i class="el-icon-menu"></i>分类参数</el-menu-item></router-link>
          <router-link to="/index/goodscateory"><el-menu-item index="3-3"><i class="el-icon-menu"></i>分类列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      </div>

      <div @click="changPageIndex('4')">
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-s-order"></i>订单管理</template>
        <el-menu-item-group>
          <router-link to="/index/orderlist"><el-menu-item index="4-1"><i class="el-icon-menu"></i>订单列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      </div>

      <div @click="changPageIndex('5')">
      <el-submenu index="5">
        <template slot="title"><i class="el-icon-s-marketing"></i>数据统计</template>
        <el-menu-item-group>
          <router-link to="/index/datasum"><el-menu-item index="5-1"><i class="el-icon-menu"></i>数据报表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      </div>

    </el-menu>
  </el-aside>


  <el-container>
        <router-view></router-view>
  </el-container>
</el-container>
</div>
</template>

<style >
  *{
    margin:0;
    padding: 0;
  }
  a{
    color: #fff;
    text-decoration: none;
  }
  .header{
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 70px ;
    background-color: #333744;
  }
  .header .el-avatar{
      margin: 5px;
  }
  .el-submenu__title{
    overflow: hidden;
  }
  .el-switch{
      margin: 20px;
  }
  .header .title{
    vertical-align: top;
    font-size: 18px;
    margin-left: 10px;
  }
  .header .back{
      position: absolute;
      right: 20px;
      top:15px;
      display: block;
      width: 50px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px;
      font-size: 15px;
      background-color: #a39fac;
      color: #fff;
      text-decoration: none;
  }
  .header .userName{
        position: absolute;
        right:90px;
        top:15px;
        display: block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 5px;
        font-size: 15px;
        color: #fff;
        text-decoration: none;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
 .el-aside{
    overflow: hidden !important;
    height: 100%;
    background-color:#333744;
  }

  .el-submenu,.el-menu-item-group{
    background-color:#333744 ;
  }
  .el-menu-item,.el-submenu__title{
    color: #ffffff !important;
  }
  .el-menu-item:focus, .el-menu-item:hover {
      outline: 0;
      background-color: #292C36 !important;
  }
  .el-menu {
      border-right: 0 !important;
   }

  .el-submenu__title:hover {
    background-color: #292C36 !important;
  }
  .el-menu-item-group__title{
    display: none;
  }
</style>

<script>
  export default {
    data:function(){
          return {
            width:'160px',
            value: false,
            username:sessionStorage.getItem('username'),
            pageindex:'0'
          }
        },
    methods:{
      // 改变展开
      changPageIndex:function(val){
          this.pageindex = val
      },
      change:function(){
       this.width = this.value ? '60px' : '160px'
      },
      // 退出登录
      back:function(){
      window.sessionStorage.clear()
      // 等待加载
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(193, 182, 202, 0.7)'
        });
        setTimeout(() => {
          loading.close();
          this.$router.push('/')
        }, 1000);
    }
   }
  }
</script>
