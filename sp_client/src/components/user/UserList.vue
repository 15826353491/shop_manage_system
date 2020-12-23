<template>
  <div class="user">
    <div class="userlist">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="searchData"  placeholder="请输入内容" @input="searchUser" >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" @click="showForm">添加用户</el-button>
      </el-row>
      <!-- 用户信息表格 -->
      <el-table :data="userList" border  v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="id" width="60px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
          <el-button type="primary" icon="el-icon-edit" circle @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleted(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="分配角色" placement="top">
          <el-button type="warning" icon="el-icon-star-off" circle @click="changeRole(scope.row)"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagenum"
          :page-sizes="[4,10,15]" :page-size="4" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 添加用户表单 -->
      <el-dialog title="添加用户" :visible.sync="add" width="50%">
          <!-- 对话框主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
          </el-form>
          <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>

      <!-- 编辑用户表单 -->
      <el-dialog title="修改用户" :visible.sync="modify" width="50%">
          <!-- 对话框主体区域 -->
          <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                  <el-input disabled="disabled" v-model="modifyForm.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="modifyForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                  <el-input v-model="modifyForm.mobile"></el-input>
              </el-form-item>
          </el-form>
          <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="modifyUser">确 定</el-button>
          </span>
      </el-dialog>


        <!-- 分配角色 -->
        <el-dialog title="分配角色" :visible.sync="changerole" width="50%">
            <!-- 对话框主体区域 -->
            <el-form :model="changeRoleForm" ref="changeRoleFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">:
                    {{changeRoleForm.username}}
                </el-form-item>
                <el-form-item label="当前角色" prop="rid">:
                    {{changeRoleForm.rid}}
                </el-form-item>
                <el-form-item label="新角色" prop="new_role_id">
                     <el-select v-model="changeRoleForm.new_rid"  placeholder="请选择">
                      <el-option
                          v-for="item in roleList"
                          :key="item.id"
                          :label="item.roleName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="setNewRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>

  </div>
</template>

<script>
  export default {
    data: function() {
      var checkEmail = (rule, value, cb) => {
          const regEmail = /^\w+@\w+(\.\w+)+$/
          if (regEmail.test(value)) {
            return cb()
          }
          //返回一个错误提示
          cb(new Error('请输入合法的邮箱'))
        }
        //验证手机号码的规则
        var checkMobile = (rule, value, cb) => {
          const regMobile = /^1[34578]\d{9}$/
          if (regMobile.test(value)) {
            return cb()
          }
          //返回一个错误提示
          cb(new Error('请输入合法的手机号码'))
        }
      return {
        // 等待加载
        loading:false,
        // 添加表单
        add: false,
        // 修改表单
        modify:false,
        // 分配角色表单
        changerole:false,
        // 添加信息
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 修改信息
        modifyForm: {
          id:'',
          usernama:'',
          email: '',
          mobile: ''
        },
        // 分配角色信息
        changeRoleForm: {
          id:'',
          username:'',
          rid:'',
          new_rid:''
        },

        // 用户添加规则
         addFormRules: {
            username: [
              { required: true, message: '请输入用户名称', trigger: 'blur' },
              {
                min: 3,
                max: 10,
                message: '用户名在3~10个字符之间',
                trigger: 'blur'
              }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              {
                min: 6,
                max: 15,
                message: '密码在6~15个字符之间',
                trigger: 'blur'
              }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
            ],
            mobile: [
                { required: true, message: '请输入手机号码', trigger: 'blur' },
                { validator:checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur'}
            ]
          },
         // 修改用户规则
         modifyFormRules:{
           email: [
               { required: true, message: '请输入邮箱', trigger: 'blur' },
               { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
           ],
           mobile: [
               { required: true, message: '请输入手机号码', trigger: 'blur' },
               { validator:checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur'}
           ]
         },
         // 搜索内容
        searchData: '',
        // 用户列表
        userList: [],
        // 角色列表
        roleList:[],
        // 页码
        params: {
          query: '',
          pagenum: 1,
          pagesize: 4
        },
        total: 0,
      }
    },
    mounted: function() {
      this.getUser()
      this.getRoleList()
    },
    methods: {
      // 获取用户列表
      getUser: async function() {
        this.loading = true
        var res = await this.axios.get('/users', {
          params: this.params
        })
        // console.log(res)
        if( res.meta.status == 200){
          this.userList = res.data.users
          this.total = res.data.total
          this.loading = false
        }else{
          this.$message.error('获取用户失败')
        }
      },
      // 改变每页条数
      handleSizeChange: function(val) {
        // console.log(`每页 ${val} 条`);
        this.params.pagesize = val
        this.getUser()
      },
      //改变当前页
      handleCurrentChange: function(val) {
        // console.log(`当前页: ${val}`);
        this.params.pagenum = val
        this.getUser()
      },
      // 显示添加用户表单
      showForm:function(){
          this.add = true
      },
      // 点击取消 表单隐藏
      cancel:function(){
        this.add = false
        this.modify = false
        this.changerole = false
        // 清空表单内容
        this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
        this.$refs.modifyFormRef && this.$refs.modifyFormRef.resetFields()
        this.$refs.changeRoleFormRef && this.$refs.changeRoleFormRef.resetFields()
      },
      // 添加用户信息
      addUser:async function() {
        this.$refs.addFormRef.validate( async valid => {
            if(!valid) return this.$message.error("请填写完整用户信息");
            else{
               var res = await this.axios.post('/users',this.addForm)
              // console.log(res)
              if(res.meta.msg==='创建成功' && res.meta.status === 201){
                this.$message.success('用户创建成功')
                // 表单框消失
                this.add = false
                // 清空表单内容
                this.$refs.addFormRef.resetFields()
              }else{
                this.$message.error(res.meta.msg)
              }
                // 重新请求数据
                this.getUser()
            }
        })
      },
     // 改变用户状态信息
     changeUserStatus:async function(val){
          // console.log(val)
          var res = await this.axios.put('/users/'+val.id+'/state/'+val.mg_state)
          // console.log(res)
          if(res.meta.msg==='设置状态成功' && res.meta.status === 200){
            this.$message.success('设置状态成功')
          }else{
            this.$message.error(res.meta.msg)
          }
              // 重新请求数据
              this.getUser()
             // this.loading = false
     },

    // 编辑用户信息
     edit:function(val){
       // console.log(val)
       // 显示修改表单
       this.modify = true
       this.modifyForm.username = val.username
       this.modifyForm.id = val.id
       this.modifyForm.email = val.email
       this.modifyForm.mobile = val.mobile
     },
    // 提交编辑用户信息
     modifyUser:async function(){
       this.$refs.modifyFormRef.validate( async valid => {
           if(!valid) return this.$message.error("请填写完整用户信息");
           else{
        var res = await this.axios.put('/users/'+this.modifyForm.id,{
          email:this.modifyForm.email,
          mobile:this.modifyForm.mobile
        })
        if(res.meta.msg=='更新成功' && res.meta.status == 200){
          this.$message.success('用户更新成功')
            this.modify = false
            this.$refs.modifyFormRef.resetFields()
            // 重新请求数据
            this.getUser()
            console.log(res)
        }else{
          this.$message.error(res.meta.msg)
        }
        }
       })
      },
    // 删除用户信息
     deleted:async function(val){
          var res = await this.axios.delete('/users/'+val.id)
          if(res.meta.msg==='删除成功' && res.meta.status === 200){
            this.$message.success('删除成功')
              // 重新请求数据
              this.getUser()
          }else{
            this.$message.error(res.meta.msg)
          }
     },
     // 获取用户角色列表
     getRoleList:async function(){
       var res = await this.axios.get('/roles')
       // console.log(res.data)
       this.roleList = res.data
     },
     // 分配用户角色
     changeRole:function(val){
        // console.log(val)
        // 显示分配角色表单
        this.changerole = true
        this.changeRoleForm.username = val.username
        this.changeRoleForm.id = val.id
        this.changeRoleForm.rid = val.role_name
      },
     // 确认设置用户角色
      setNewRole:async function(){
        // console.log(this.changeRoleForm)
        var res = await this.axios.put('/users/'+this.changeRoleForm.id+'/role',{
          rid:this.changeRoleForm.new_rid
        })
        if(res.meta.msg==='设置角色成功' && res.meta.status === 200){
            this.$message.success('设置角色成功')
             this.changerole = false
            // 重新请求数据
            this.getUser()
        }else{
          this.$message.error(res.meta.msg)
        }
      },
      // 搜索用户信息
      searchUser:async function(){
        // console.log(this.searchData)
        var res = await this.axios.get('/users', {
          params:{
            query:this.searchData.trim(),
            pagenum:1,
            pagesize:4
          }
        })
        if(res.meta.status == 200){
          this.userList = res.data.users
          this.total = res.data.total
         }
         else
          this.$message.error(res.meta.msg)
      }
    },
  }
</script>

<style scoped="scoped">
  
  .user {
    width: 100%;
    background-color: #EAEDF1;
    padding: 15px;
  }

  .userlist {
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
    height: 350px;
    overflow: scroll;
  }

  .el-switch {
    height: 0;
    padding: 0;
    margin: 0;
  }
</style>
