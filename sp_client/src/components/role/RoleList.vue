<template>
  <div class="role">
  <div class="roleList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <div class="content">
      <el-button type="primary" @click="showRoleForm">添加角色</el-button>
      <!-- 角色信息表格 -->
      <el-table :data="roleList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="#" width="60px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit"  @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleted(scope.row)">删除</el-button>
          <el-button type="warning" icon="el-icon-star-off"  @click="setPower(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色表单 -->
      <el-dialog title="添加角色" :visible.sync="add" width="50%">
          <!-- 对话框主体区域 -->
          <el-form :model="addRoleForm"  ref="addFormRef" label-width="70px">
              <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="addRoleForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                  <el-input  v-model="addRoleForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
      </el-dialog>

      <!-- 修改角色表单 -->
      <el-dialog title="修改角色" :visible.sync="modify" width="50%">
          <!-- 对话框主体区域 -->
          <el-form :model="modifyRoleForm"  ref="modifyFormRef" label-width="70px">
              <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="modifyRoleForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                  <el-input  v-model="modifyRoleForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="resetRole">确 定</el-button>
          </span>
      </el-dialog>

       <!-- 分配权限表单 -->
       <el-dialog title="分配权限" :visible.sync="set" width="50%">
           <!-- 对话框主体区域 -->
           <el-form  label-width="100px">
              <el-tree
                :data="powerList"
                show-checkbox
                node-key="id"
                ref="treeRef"
                default-expand-all
                :props="defaultProps"
                :default-checked-keys="checkedPowerList"
                @check-change="handleNode">
              </el-tree>
           </el-form>
           <!-- 对话框底部区域 -->
           <span slot="footer" class="dialog-footer">
               <el-button @click="cancel">取 消</el-button>
               <el-button type="primary" @click="resetPower">确 定</el-button>
           </span>
       </el-dialog>
    </div>
  </div>
</template>

<script>
  export default{
    data:function(){
      return {
        // 等待加载
        loading:false,
        // 显示角色添加表单
        add:false,
        // 显示角色修改表单
        modify:false,
        // 显示设置权限表单
        set:false,
        // 角色列表
        roleList:[],
        // 权限列表
        powerList:[],
        // 渲染的名称以及子节点的数组名称
        defaultProps:{
          children:'children',
          label:'authName'
        },
        // 选中的权限列表
        checkedPowerList:[],
        id:'',
        // 添加角色信息表单
        addRoleForm:{
          roleName:'',
          roleDesc:''
        },
        // 修改角色信息表单
        modifyRoleForm:{
          id:'',
          roleName:'',
          roleDesc:''
        }
      }
    },
    mounted:function(){
      this.getRoleList()
      this.getPowerList()
    },
    methods:{
        // 获取用户角色列表
        getRoleList:async function(){
          this.loading = true
          var res = await this.axios.get('/roles')
          // console.log(res.data)
          if( res.meta.status == 200){
            this.loading = false
            this.roleList = res.data
          }else
            this.$message.error('获取用户角色列表失败')
        },
        // 获取角色权限列表
        getPowerList:async function(){
          var res = await this.axios.get('/rights/tree')
          // console.log(res.data)
          this.powerList = res.data
        },
        // 显示添加角色信息表单
        showRoleForm: function(val){
              this.add = true
         },
         // 隐藏表单并清空表单内容
         cancel:function(){
               this.add = false
               this.modify = false
               this.set = false
               // 清空表单内容
               this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
         },
       // 添加角色信息
        addRole:async function(){
          // console.log(this.addRoleForm)
             var res = await this.axios.post('/roles',this.addRoleForm)
             if(res.meta.status === 201){
               this.$message.success(res.meta.msg)
                 // 隐藏表单
                 this.add = false
                 // 清空表单内容
                 this.$refs.addFormRef.resetFields()
             }else{
               this.$message.error(res.meta.msg)
             }
                 // 重新请求数据
                 this.getRoleList()
        },
        // 展示修改角色信息表单
        edit: function(val){
           // console.log(val)
            this.modify = true
            this.modifyRoleForm.id = val.id
            this.modifyRoleForm.roleName = val.roleName
            this.modifyRoleForm.roleDesc = val.roleDesc
         },
         // 提交修改角色信息表单
         resetRole:async function(){
            var res = await this.axios.put('/roles/'+this.modifyRoleForm.id,{
              roleName:this.modifyRoleForm.roleName,
              roleDesc:this.modifyRoleForm.roleDesc
             })
                 if(res.meta.msg==='获取成功' && res.meta.status === 200){
                   this.$message({
                     message: '获取成功',
                     type: 'success'
                   })
                   // 隐藏表单
                   this.modify = false
                   // 清空表单内容
                   this.$refs.modifyFormRef.resetFields()
                 }else{
                   this.$message.error(res.meta.msg)
                 }
                     // 重新请求数据
                     this.getRoleList()
            },
       // 删除角色信息
        deleted:async function(val){
             var res = await this.axios.delete('/roles/'+val.id)
             if(res.meta.msg==='删除成功' && res.meta.status === 200){
               this.$message({
                 message: '删除成功',
                 type: 'success'
               })
             }else{
               this.$message.error(res.meta.msg)
             }
                 // 重新请求数据
                 this.getRoleList()
        },
       // 弹出分配权限表单
       setPower:function(val){
            this.set = true
            this.id = val.id
       },
       // 选中的节点
       handleNode:function(data,checked){
           if ( checked )  this.checkedPowerList.push(data)
       },
       // 确认设置分配角色
       resetPower:async function(){
            console.log(this.checkedPowerList)
            var rids = []
            this.checkedPowerList.forEach(item=>{
              rids.push(item.id)
            })
            // 去重
            rids = rids.filter((item,index,arr) => arr.indexOf(item) == index)
            rids = rids.join(',')
            // console.log(rids)
            var res = await this.axios.post('/roles/'+this.id+'/rights',{
                  rids:rids
            })
            if(res.meta.status === 200){
              this.$message.success(res.meta.msg)
            }else{
              this.$message.error(res.meta.msg)
            }
            this.set = false
            this.getRoleList()
       }
    }
  }
</script>

<style scoped="scoped">
  .role {
    width: 100%;
    background-color: #EAEDF1;
    padding: 15px;
  }

  .roleList {
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

  .el-table {
    margin: 20px auto;
    height: 375px;
    overflow: scroll;
  }

</style>
