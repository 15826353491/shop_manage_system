<template>
  <div class="power">
  <div class="powerList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
        <div class="content"  >
          <!-- 搜索框 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model.trim="searchData" :value="searchData" placeholder="请输入内容" @input="search">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
          </el-row>

          <!-- 订单信息表格 -->
          <el-table :data="orderList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="order_id" label="#" width="60px"></el-table-column>
            <el-table-column prop="consignee_addr" label="订单地址" width="250px"></el-table-column>
            <el-table-column prop="order_number" label="订单数量" ></el-table-column>
            <el-table-column prop="order_price" label="订单价格"></el-table-column>
            <el-table-column prop="pay_status" label="是否付款">
              <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status=='1'" type="success">已付款</el-tag>
              <el-tag v-else type="danger">未付款</el-tag>
              </template>
</el-table-column>
            <el-table-column prop="is_send" label="是否发货"></el-table-column>
            <el-table-column :formatter="dateFormat" prop="create_time" label="下单时间" width="200px"></el-table-column>
            <el-table-column prop="order_action" label="操作">
             <template slot-scope="scope">
            <el-tooltip content="修改订单" placement="top">
             <el-button type="primary"  icon="el-icon-edit" circle @click="editOrder(scope.row)"></el-button>
             </el-tooltip>
            <el-tooltip content="修改地址" placement="top">
             <el-button type="primary" icon="el-icon-setting" circle @click="editAddress(scope.row)"></el-button>
             </el-tooltip>
             </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagenum"
              :page-sizes="[4, 10, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>

          <!-- 修改订单信息表单 -->
          <el-dialog title="修改订单" :visible.sync="modify" width="50%" >

           <el-form ref="modifyForm" :model="modifyForm" label-width="80px">
             <el-form-item label="订单编号" >
               <el-input v-model="order_id" disabled="disabled"></el-input>
             </el-form-item>
             <el-form-item label="是否发货">
               <el-switch v-model="modifyForm.is_send"></el-switch>
             </el-form-item>
             <el-form-item label="订单支付">
               <el-radio-group v-model="modifyForm.order_pay">
                 <el-radio label="0" >未支付</el-radio>
                 <el-radio label="1" >支付宝</el-radio>
                 <el-radio label="2" >微信</el-radio>
                 <el-radio label="3" >银行卡</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="订单价格">
               <el-input v-model="modifyForm.order_price"></el-input>
             </el-form-item>
             <el-form-item label="订单数量">
               <el-input v-model="modifyForm.order_number"></el-input>
             </el-form-item>
             <el-form-item label="支付状态">
               <el-switch v-model="modifyForm.pay_status"></el-switch>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setOrder">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 修改订单地址表单 -->
          <el-dialog title="修改地址" :visible.sync="address" width="50%" >

           <el-form label-width="80px" >
             <el-form-item label="省市区/县" >
                <el-cascader
                   :options="cityOptions"
                    v-model="city"
                    :props="{ expandTrigger: 'hover' }"
                   @change=" getProvince"
                 >
                 </el-cascader>
             </el-form-item>
             <el-form-item label="详细地址" >
               <el-input v-model="detailAddress" ></el-input>
             </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="setAddress">确 定</el-button>
            </span>
          </el-dialog>

        </div>
    </div>
</template>

<script>

  // 时间格式化模块
  import moment from 'moment'
  // 获取中国省份
  import cityOptions from '@/assets/js/city_data2017_element.js'

  export default{
    data:function(){
      return {
        // 等待加载
         loading:false,
        // 显示修改订单信息表单
         modify:false,
        // 显示修改订单地址信息表单
         address:false,
        // 获取订单列表
         orderList:[],
         params:{
           query:'',
           pagenum:1,
           pagesize:4,
           user_id:'',
           pay_status:'',
           is_send:'',
           order_fapiao_title:'',
           order_fapiao_company:'',
           order_fapiao_content:'',
           consignee_addr:''
         },
         //修改订单表单信息
            order_id:'',
          modifyForm:{
            is_send:'',
            order_pay:'',
            order_price:'',
            order_number:'',
            pay_status:'',
            consignee_addr:''
          },
        //修改订单地址表单信息
         modifyAddressForm:{
           is_send:'',
           order_pay:'',
           order_price:'',
           order_number:'',
           pay_status:'',
           consignee_addr:''
         },
         // 省份
         city:'',
         cityOptions:cityOptions,
         // 详细地址
         detailAddress:'',
         searchData:'',
         total:1
      }
    },
    mounted:function(){
        this.getOrderList()
    },
    methods:{
        // 获取订单列表
        getOrderList:async function(){
          this.loading = true
          var res = await this.axios.get('/orders',{
            params:this.params
          })
          // console.log(res)
          if(res.meta.status == 200){

             this.orderList = res.data.goods
             this.total = res.data.total
             this.loading = false
          }else{
              this.$message.error('订单列表获取失败')
          }
        },
        // 时间格式化
        dateFormat(row, column) {
          let date = row[column.property]
          if (date == undefined) {
            return ''
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },
        // 改变每页条数
        handleSizeChange(val) {
          // console.log(`每页 ${val} 条`);
          this.params.pagesize = val
          this.getOrderList()
        },
        //改变当前页
        handleCurrentChange(val) {
          // console.log(`当前页: ${val}`);
          this.params.pagenum = val
          this.getOrderList()
        },
        // 搜索订单
        async search(){
          this.params.query = this.searchData
          // console.log(this.params.query)
          var res = await this.axios.get('/orders',{
            params:{
                   pagenum:1,
                   pagesize:50,
                   }
           })
          if( res.meta.status == 200){
             var searchOrder = res.data.goods.filter(item => item.consignee_addr.includes(this.searchData))
             this.orderList = searchOrder
             this.total = searchOrder.length
          }else{
            this.$message.error(res.meta.msg)
          }
        },
        // 隐藏表单
        cancel(){
          this.modify = false
          this.address = false
        },
        // 显示编辑订单并把值传入表单
        editOrder(val){
          this.modify = true
          // console.log(val)
          this.order_id = val.order_id
          this.modifyForm.is_send = val.is_send == '否' ? false : true
          this.modifyForm.pay_status = val.pay_status == '0' ? false : true
          this.modifyForm.order_pay = val.order_pay
          this.modifyForm.order_price = val.order_price
          this.modifyForm.order_number = val.order_number
        },
        // 确认提交编辑订单
        async setOrder(){
          this.loading = true
          this.modifyForm.is_send = this.modifyForm.is_send == false ? 0 : 1
          this.modifyForm.pay_status = this.modifyForm.pay_status == false ? '0' : '1'
          // console.log(this.modifyForm.pay_status)
          var res = await this.axios.put('orders/'+this.order_id,this.modifyForm)
          if (res.meta.status == 201) {
            this.$message.success(res.meta.msg)
            this.modify = false
            this.getOrderList()
          } else{
            this.$message.error(res.meta.msg)
          }
        },
        // 编辑地址
        editAddress(val){
          this.address = true
          // console.log(val)
          this.order_id = val.order_id
          this.modifyAddressForm.is_send = val.is_send == '否' ? false : true
          this.modifyAddressForm.pay_status = val.pay_status == '0' ? false : true
          this.modifyAddressForm.order_pay = val.order_pay
          this.modifyAddressForm.order_price = val.order_price
          this.modifyAddressForm.order_number = val.order_number
        },
        // 获取选中的省份
        getProvince(){
          this.modifyAddressForm.consignee_addr = this.city.join('/')
        },
        async setAddress(){
          this.modifyAddressForm.consignee_addr += ' '+ this.detailAddress
          // console.log(this.modifyAddressForm)

          this.loading = true
          this.modifyAddressForm.is_send = this.modifyAddressForm.is_send == false ? 0 : 1
          this.modifyAddressForm.pay_status = this.modifyAddressForm.pay_status == false ? '0' : '1'
          var res = await this.axios.put('orders/'+this.order_id,this.modifyAddressForm)
          if (res.meta.status == 201) {
            this.address = false
            this.city = ''
            this.detailAddress = ''
            this.$message.success(res.meta.msg)
            this.getOrderList()
          } else{
            this.$message.error(res.meta.msg)
          }
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
    height: 350px;
    overflow: scroll;
  }

  /* 修改表单 */
  .el-form-item {
      margin-bottom: 5px;
  }

  .el-switch{
    margin-top: 10px;
  }
</style>
