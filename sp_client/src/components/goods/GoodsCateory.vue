<template>
  <div class="goods">
  <div class="goodsList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content">
            <el-button type="primary" @click="showAdd">添加分类</el-button>

          <!-- 商品分类信息表格 -->
          <el-table :data="goodsCateoryList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="cat_id" label="#" width="60px"></el-table-column>
            <el-table-column prop="cat_name" label="分类名称" width="450px"></el-table-column>
            <el-table-column prop="cat_pid" label="是否有效">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.cat_pid==0" type="success" icon="el-icon-check" circle size="mini"></el-button>
                  <el-button v-else type="danger" icon="el-icon-close" circle size="mini"></el-button>

               </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.cat_level==0" >一级</el-tag>
                  <el-tag v-else-if="scope.row.cat_level=='1'" type="success">二级</el-tag>
                  <el-tag v-else type="danger" >三级</el-tag>
               </template>
</el-table-column>
            <el-table-column prop="cat_action" label="操作">
              <template slot-scope="scope">
              <el-tooltip content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle  @click="edit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleted(scope.row)"></el-button>
              </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagenum"
              :page-sizes="[ 4, 10, 15,20]" :page-size="4" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>

          <!-- 添加商品分类表单 -->
          <el-dialog title="添加分类" :visible.sync="add" width="50%" >

           <el-form ref="addFormRef" :model="addForm" label-width="80px">
             <el-form-item label="分类名称" prop="cat_name">
               <el-input v-model="addForm.cat_name" ></el-input>
             </el-form-item>
             <el-form-item label="分类ID">
               <el-input v-model="addForm.cat_pid" prop="cat_pid"  disabled="disabled"></el-input>
             </el-form-item>
             <el-form-item label="分类层级" prop="cat_level" >
               <el-radio-group v-model="addForm.cat_level" @change="setPid">
               <el-radio  label="0">一级分类</el-radio>
               <el-radio  label="1">二级分类</el-radio>
               <el-radio  label="2">三级分类</el-radio>
               </el-radio-group>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setGoodsCategory">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 修改商品分类表单 -->
          <el-dialog title="修改分类" :visible.sync="modify" width="50%" >

           <el-form ref="modifyFormRef" :model="modifyForm" label-width="80px">
             <el-form-item label="分类名称">
               <el-input v-model="modifyForm.cat_name" ></el-input>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setModifyGoodsCategory">确 定</el-button>
            </span>
          </el-dialog>

        </div>
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
          goodsCateoryList:[],
          // 商品分页
          params:{
            type:2,
            pagenum:1,
            pagesize:4
          },
          total:1,
          // 添加分类表单
          add:false,
          addForm:{
            cat_pid:'',
            cat_name:'',
            cat_level:''
          },
          // 修改分类表单
          modify:false,
          modifyForm:{
            cat_pid:'',
            cat_name:''
          }
      }
    },
    mounted:function(){
        this.getGoodsCateory()
    },
    methods:{
      // 获取商品分类列表
        async getGoodsCateory(){
           this.loading = true
           var res = await this.axios.get('/categories',{
             params:this.params
           })
           if(res.meta.status == 200){
              this.goodsCateoryList = res.data.result
              this.total = res.data.total
              this.loading = false
           }else{
             this.$message.error(res.meta.msg)
           }
        },
        // 改变每页条数
        handleSizeChange(val) {
          // console.log(`每页 ${val} 条`);
          this.params.pagesize = val
          this.getGoodsCateory()
        },
        //改变当前页
        handleCurrentChange(val) {
          // console.log(`当前页: ${val}`);
          this.params.pagenum = val
          this.getGoodsCateory()
        },

        // 展示添加分类表单
        showAdd(){
          this.add = true
        },
        // 隐藏添加分类表单
        cancel(){
          this.add = false
          this.modify = false
          // 清空表单内容
          this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
        },
        // 添加一级分类 pid = 0
        setPid(){
              this.addForm.cat_pid='0'
        },
        // 确认提交添加分类表单
        async setGoodsCategory(){
          var res = await this.axios.post('/categories',{
            cat_pid:this.addForm.cat_pid,
            cat_name:this.addForm.cat_name,
            cat_level:this.addForm.cat_level
          })
          if (res.meta.status == 201) {
            this.add = false
            // 清空表单内容
            this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
            this.$message.success(res.meta.msg)
            this.getGoodsCateory()
          } else{
            this.$message.error(res.meta.msg)
          }
        },
        // 展示修改分类表单
        edit(val){
          this.modify = true
          this.modifyForm.cat_name = val.cat_name
          this.modifyForm.cat_id = val.cat_id
        },
        // 确认提交修改分类表单
        async setModifyGoodsCategory(){
          var res = await this.axios.put('/categories/'+this.modifyForm.cat_id,{
            cat_name:this.modifyForm.cat_name
          })
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg)
            this.modify = false
            this.getGoodsCateory()
          } else{
            this.$message.error(res.meta.msg)
          }
        },
        // 删除分类
        async deleted(val){
          var res = await this.axios.delete('/categories/'+val.cat_id)
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg)
            this.getGoodsCateory()
          } else{
            this.$message.error(res.meta.msg)
          }
        }


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
    padding: 20px;
    box-sizing: border-box;
    margin-top: -10px;
    background-color: #fff;
  }
  .el-table{
    margin: 20px auto;
    height: 350px;
    overflow: scroll;
  }
</style>
