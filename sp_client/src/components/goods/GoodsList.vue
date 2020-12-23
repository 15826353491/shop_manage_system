<template>
  <div class="goods">
  <div class="goodsList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content">
          <!-- 搜索框 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model.trim="searchData" :value="searchData" placeholder="请输入内容" @input="search">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <router-link :to="{path:'/index/addgoods'}">
            <el-button type="primary" >添加商品</el-button>
            </router-link>
          </el-row>

          <!-- 商品信息表格 -->
          <el-table :data="goodsList" stripe  v-loading="loading" border style="width: 100%">
            <el-table-column  prop="goods_id" label="#" width="60px"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
</el-table-column>
            <el-table-column :formatter="dateFormat" prop="add_time"  label="创建时间" width="180px"></el-table-column>
            <el-table-column prop="goods_action" label="操作">
              <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
             <el-button type="primary" icon="el-icon-edit" circle @click="edit(scope.row)"></el-button>
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
              :page-sizes="[4, 10, 20, 50,100,500]" :page-size="4" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>


          <!-- 修改商品信息表单 -->
          <el-dialog title="修改商品" :visible.sync="modify" width="50%" >
           <el-form ref="modifyForm" :model="modifyForm" label-width="80px">
             <el-form-item label="商品编号">
               <el-input v-model="goods_id" disabled="disabled"></el-input>
             </el-form-item>
             <el-form-item label="商品名称">
               <el-input v-model="modifyForm.goods_name" ></el-input>
             </el-form-item>
             <el-form-item label="商品价格">
               <el-input v-model="modifyForm.goods_price"></el-input>
             </el-form-item>
             <el-form-item label="商品数量">
               <el-input v-model="modifyForm.goods_number"></el-input>
             </el-form-item>
             <el-form-item label="商品重量">
               <el-input v-model="modifyForm.goods_weight"></el-input>
             </el-form-item>
             <el-form-item label="商品分类">
               <div class="block">
                 <span class="demonstration"></span>
                 <el-cascader
                   v-model="modifyForm.goods_cat"
                   :options="goodsCateoryList"
                    clearable
                   :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id'}"
                   @change="getCat_id"></el-cascader>
               </div>
             </el-form-item>
             <el-form-item label="商品介绍">
               <el-input v-model="modifyForm.goods_introduce"></el-input>
             </el-form-item>
             <el-form-item label="图片路径">
               <el-input v-model="modifyForm.goods_pics"></el-input>
             </el-form-item>
             <el-form-item label="商品参数">
               <el-input v-model="modifyForm.goods_attr"></el-input>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setGoods">确 定</el-button>
            </span>
          </el-dialog>

        </div>
    </div>
  </div>
</template>

<script>

  import moment from 'moment'

  export default{
    data:function(){
      return {
          // 等待加载
          loading:false,
          // 商品列表
          goodsList:[],
          // 商品分类列表
          goodsCateoryList: [],
          // 商品分页
          params:{
            query:'',
            pagenum:1,
            pagesize:4
          },
          // 商品修改表单信息
          modify:false,
          goods_id:'',
          modifyForm:{
            goods_name:'',
            goods_price:'',
            goods_number:'',
            goods_weight:'',
            goods_cat:'',
            goods_introduce:'',
            pics:'',
            attrs:''
          },
          // 搜索商品
          searchData:'',
          total:1
      }
    },
    mounted:function(){
        this.getGoodList()
        this.getGoodsCateory()
    },
    methods:{
        // 获取商品列表
        async getGoodList(){
           this.loading = true
           var res = await this.axios.get('/goods',{params:this.params})
           if(res.meta.status == 200){
              this.loading = false
              this.goodsList = res.data.goods.reverse()
              this.total = res.data.total
           }else{
             this.$message.error(res.meta.msg)
           }
           // console.log(this.goodsList)
        },
        // 获取商品分类列表
        async getGoodsCateory(){
          var res = await this.axios.get('/categories')
          this.goodsCateoryList = res.data
          // console.log(this.goodsCateoryList)
        },
        // 改变每页条数
        handleSizeChange(val) {
          // console.log(`每页 ${val} 条`);
          this.params.pagesize = val
          this.getGoodList()
        },
        //改变当前页
        handleCurrentChange(val) {
          // console.log(`当前页: ${val}`);
          this.params.pagenum = val
          this.getGoodList()
        },
        // 时间格式化
        dateFormat(row, column) {
          let date = row[column.property]
          if (date == undefined) {
            return ''
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },
        // 隐藏表单信息
        cancel(){
          this.modify = false
        },
        // 搜索商品
        async search(){
          this.params.query = this.searchData
          var res = await this.axios.get('/goods',{params:this.params})
          if( res.meta.status == 200){
             this.goodsList = res.data.goods
             this.total = res.data.total
          }else{
            this.$message.error(res.meta.msg)
          }
        },
        // 获取分类 Cat_id
        getCat_id(){
           this.modifyForm.goods_cat = this.modifyForm.goods_cat.join(',')
        },
        // 显示修改商品表单
        edit(val){
          // console.log(val)
          this.modify = true
          this.goods_id = val.goods_id

          this.modifyForm.goods_name = val.goods_name
          this.modifyForm.goods_price = val.goods_price
          this.modifyForm.goods_number = val.goods_number
          this.modifyForm.goods_weight = val.goods_weight
          // 商品分类
          this.modifyForm.goods_introduce = val.goods_introduce
          this.modifyForm.pics = val.goods_pics
          this.modifyForm.attrs = val.goods_attrs

        },
        // 修改商品
        async setGoods(){
          // console.log(this.modifyForm)
          this.loading = true
          var　res = await this.axios.put('goods/'+this.goods_id,this.modifyForm)
          if(res.meta.status == 200){
              this.modify = false
              this.getGoodList()
              this.$message.success('修改商品成功')
          }else{
            this.$message.error(res.meta.msg)
            this.loading = false
          }
        },
        // 删除商品
        async deleted(val){
          this.loading = false
          var res = await this.axios.delete('/goods/'+val.goods_id)
          if(res.meta.status == 200){
              this.$message.success('商品删除成功')
              this.getGoodList()
          }
          else
              this.$message.error(res.meta.msg)
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
    height: 350px ;
    overflow: scroll;
  }
</style>
