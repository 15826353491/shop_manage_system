<template>
  <div class="main">
  <div class="navbar">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content" v-loading="loading">
          <el-alert
              title="添加商品信息"
              type="info"
              center
              show-icon>
            </el-alert>
          <!-- 步骤条 -->
          <el-steps :space="200" align-center :active="step" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>

        <!-- 商品表单信息 -->
       <el-tabs tab-position="left" style="" @tab-click="stepchange">
           <el-tab-pane  label="基本信息">
               <el-form label-position="left" label-width="80px" :model="goods">
                 <el-form-item label="商品名称">
                   <el-input v-model="goods.goods_name"></el-input>
                 </el-form-item>
                 <el-form-item label="商品价格">
                   <el-input v-model="goods.goods_price"></el-input>
                 </el-form-item>
                 <el-form-item label="商品重量">
                   <el-input v-model="goods.goods_weight"></el-input>
                 </el-form-item>
                 <el-form-item label="商品数量">
                   <el-input v-model="goods.goods_number"></el-input>
                 </el-form-item>
                 <el-form-item label="商品分类">
                   <div class="block">
                     <span class="demonstration"></span>
                     <el-cascader
                       v-model="goods.goods_cat"
                       :options="goodsCateoryList"
                        clearable
                       :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id'}"
                       @change=""></el-cascader>
                   </div>
                 </el-form-item>
               </el-form>
           </el-tab-pane>
           <el-tab-pane  label="商品参数"></el-tab-pane>
           <el-tab-pane  label="商品属性"></el-tab-pane>
           <el-tab-pane label="商品图片">
             <el-upload
                ref='upload'
               class="upload-demo"
               :headers="header"
               action="http://www.yangsong.cool:8888/api/private/v1/upload"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :file-list="fileList"
               :on-success="submitSuccess"
               :auto-upload="true"
               list-type="picture">
               <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-tab-pane>
           <el-tab-pane label="商品内容">
             <div style="height: 280px;">
               <quill-editor
                   v-model="content"
                   ref="myQuillEditor"
                   :options="editorOption"
                   @blur="" @focus=""
                   @change="">
               </quill-editor>
               <!-- 富文本内容 -->
               <div class="text"></div>
           </div>
           <el-button type="primary" @click="addGoods">添加商品</el-button>
           </el-tab-pane>
         </el-tabs>
        </div>
    </div>
</template>

<script>


  export default{
    data:function(){
      return {
        // 步骤
        step:1,
        // 等待加载
        loading:false,
        // 商品基本信息
        goods: {
            goods_cat:'',
            goods_name: '',
            goods_price:'',
            goods_weight:'',
            goods_number:''
          },
        // 商品分类
        goodsCateoryList: [],
        // 商品图片列表
        fileList:[],
        file:'',
        //设置请求头 token
        header:{
          Authorization:sessionStorage.getItem("token")
        },
        content:null,
        editorOption:{}
      }
    },
    mounted:function(){
      this.getGoodsCateory()
    },
    computed:{
      editor() {
          return this.$refs.myQuillEditor.quill;
      },
    },
    methods:{
      // 获取商品分类列表
      async getGoodsCateory(){
        var res = await this.axios.get('/categories')
        this.goodsCateoryList = res.data
        // console.log(this.goodsCateoryList)
      },
      // 添加商品
      async addGoods(){

        var res = await this.axios.post('/goods',{
              goods_cat:this.goods.goods_cat && this.goods.goods_cat.join(','),
              goods_name:this.goods.goods_name ,
              goods_price:this.goods.goods_price ,
              goods_weight:this.goods.goods_weight ,
              goods_number:this.goods.goods_number
        })
        if (res.meta.status == 201) {
          this.loading = true
          this.$message.success(res.meta.msg)
          setTimeout(()=>{
            this.$router.push('/index/goodslist')
            this.loading = false
            this.$message.success('正在加载...')
          },2000)
        }else{
          this.$message.error(res.meta.msg)
        }
      },

      // 展示步骤条第几步
      stepchange(tab,event){
        this.step = parseInt(tab.paneName) + 1
      },

      // 图片事件
      submitSuccess(response){
        console.log(response)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      async handlePreview(file) {
        // this.file = file
        // console.log(this.file)
      },

      // 富文本事件
      onEditorBlur(){//失去焦点事件
      },
      onEditorFocus(){//获得焦点事件
      },
      onEditorChange(){//内容改变事件
        //console.log(this.content)
      //$('.text').html(this.content)
      },

    }
  }
</script>

<style scoped="scoped">
  .main {
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
  .el-alert{
    margin-bottom: 10px;
  }
  /* 内容 */
  .el-tabs{
    margin: 10px auto;
    height:330px;
   }

   /* 富文本内容 */
   .quill-editor{
   }

</style>
