<template>
  <div class="goods">
  <div class="goodsList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content">
          <el-alert
              title="注意:只允许为第三级分类设置相关参数"
              type="warning"
              show-icon>
          </el-alert>
          <div class="block">
            <span class="demonstration">选择商品分类 ：</span>
            <el-cascader
              v-model="categoryId"
              :options="goodsCateoryList"
               clearable
              :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id' }"
              @change=""></el-cascader>
          </div>

             <el-tabs  v-model="activeName" @tab-click="change">
                <el-tab-pane label="动态参数" name="many"></el-tab-pane>
                <el-tab-pane label="静态属性" name="only"></el-tab-pane>
              </el-tabs>

            <el-button type="primary" @click="showForm">添加参数</el-button>

          <!-- 商品参数信息表格 -->
          <el-table :data="goodsDataList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="attr_id" label="#" width="60px"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="450px"></el-table-column>
            <el-table-column prop="attr_action" label="操作">
            <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="deleted(scope.row)" circle></el-button>
            </el-tooltip>
        </template>
            </el-table-column>
          </el-table>

           <!-- 添加参数表单 -->
          <el-dialog :title="title" :visible.sync="add" width="50%" >

           <el-form ref="addFormRef" :model="addForm" label-width="80px">
             <el-form-item label="参数名称" prop="attr_name">
               <el-input v-model="addForm.attr_name"  ></el-input>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setCategoryData">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 修改参数表单 -->
          <el-dialog :title="title" :visible.sync="modify" width="50%" >

           <el-form ref="modifyFormRef" :model="modifyForm" label-width="80px">
             <el-form-item label="参数名称">
               <el-input v-model="modifyForm.attr_name" ></el-input>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setModifyCategoryData">确 定</el-button>
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
          // 商品列表
          goodsDataList:[],
          // 添加参数表单
          add:false,
          title:'',
          addForm:{
            attr_name:'',
            attr_sel:'',
          },
          // 商品参数分页
          params:{
            pagenum:1,
            pagesize:4
          },
          total:1,
          goodsCateoryList: [],
          // 分类id
          categoryId: '',
          // 切换动态与静态
          activeName: 'many',
          // 修改参数表单
          modify:false,
          modifyForm:{
            attr_name:'',
            attr_sel:'',
          }
      }
    },
    mounted:function(){
        this.getGoodsCateory()
    },
    methods:{
      // 获取商品分类列表
        async getGoodsCateory(){
           var res = await this.axios.get('/categories',{
             params:this.params
           })
           if(res.meta.msg == '获取成功' && res.meta.status == 200){
              this.goodsCateoryList = res.data.result
           }else{
             this.$message.error(res.meta.msg)
           }
           // console.log(this.goodsCateoryList)
        },
        // 切换动态参数与静态参数
        change(tab){
          this.activeName = tab.paneName
          this.getGoodsData()
        },
        // 获取动态参数列表
        async getGoodsData(){
           this.loading = true
           var id = this.categoryId[this.categoryId.length - 1]
           var res = await this.axios.get('categories/'+id+'/attributes',{
             params:{sel:this.activeName}
           })
           if( res.meta.status == 200){
              this.goodsDataList = res.data
              this.total = res.data.length
              this.loading = false
           }else{
             this.$message.error(res.meta.msg)
           }
        },
        // 隐藏表单
        cancel(){
          this.add = false
          this.modify = false
          // 清除添加参数表单
          this.$refs.addFormRef.resetFields()
        },
        // 展示添加参数表单
        showForm(){
            // 判断是否为第三级分类
            if(this.categoryId.length != 3){
              this.$message.error('只允许为第三级分类设置相关参数')
              return
             }
            this.add = true
            this.title = this.activeName == 'many'?'添加动态参数':'添加静态参数'
        },
        // 提交分类参数
        async setCategoryData(){
          var id = this.categoryId[this.categoryId.length - 1]
          this.addForm.attr_sel = this.activeName
          var res = await this.axios.post('categories/'+id+'/attributes',{
               attr_name:this.addForm.attr_name,
               attr_sel:this.addForm.attr_sel
          })
          if(res.meta.status == 201){
                 this.add = false
                 // 清除添加参数表单
                 this.$refs.addFormRef.resetFields()
                 this.getGoodsData()
          }else{
            this.$message.error(res.meta.msg)
          }
        },
        // 编辑参数
        edit(val){
            this.modify = true
            this.modifyForm.attr_name = val.attr_name
            this.modifyForm.attr_sel = val.attr_sel
            this.modifyForm.attr_id = val.attr_id
        },
        // 确认提交编辑表单
        async setModifyCategoryData(){
          var id = this.categoryId[this.categoryId.length - 1]
          var attrId = this.modifyForm.attr_id
          // attr_sel = this.activeName
          var res = await this.axios.put('/categories/'+id+'/attributes/'+attrId,{
            attr_name:this.modifyForm.attr_name,
            attr_sel:this.modifyForm.attr_sel
          })
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg)
            this.modify = false
            this.getGoodsData()
          } else{
            this.$message.error(res.meta.msg)
          }
        },
        // 删除参数
        async deleted(val){
          var id = this.categoryId[this.categoryId.length - 1]
          var attrid = val.attr_id
          var res = await this.axios.delete('/categories/'+id+'/attributes/'+attrid)
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg)
            this.getGoodsData()
          }else{
            this.$message.error(res.meta.msg)
          }
        },
        handleCurrentCateory(){
          this.getGoodsData()
        },
        // 改变每页条数
        handleSizeChange(val) {
          // console.log(`每页 ${val} 条`);
          this.params.pagesize = val
          this.getGoodsData()
        },
        //改变当前页
        handleCurrentChange(val) {
          // console.log(`当前页: ${val}`);
          this.params.pagenum = val
          this.getGoodsData()
        },

    }
  }
</script>

<style scoped="scoped">
  .goods{
    width: 100%;
    background-color: #EAEDF1;
    padding: 15px;
  }

  .goodsList {
    width: 100%;
    height: 40px;
  }

  .content {
    width: 100%;
    /* height: 500px; */
    padding: 20px;
    box-sizing: border-box;
    margin-top: -10px;
    background-color: #fff;
    /* overflow: scroll; */
  }
  .el-table{
    margin: 20px auto;
    height: 245px;
    overflow: scroll;
  }
  .el-alert{
    margin-bottom: 10px;
  }
</style>
