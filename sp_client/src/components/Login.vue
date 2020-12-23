<template>
	<div class="login">
		<form>
			<div class="login-wrap">
				<img class="avatar" src="../assets/image/default.png">
				<div class="form-group">
					<img src="../assets/image/nameicon.png" class="unameicon">
					<input id="name" type="text" class="form-control uname" placeholder="用户名" autofocus autocomplete="off" v-model.trim="uname">
				</div>
				<div class="form-group">
					<img src="../assets/image/pwdicon.png" class="pwdicon">
					<input id="password" type="password" class="form-control pwd" placeholder="密码" v-model.trim="password">
				</div>
				<input type="submit" class="btn" value="登录" @click.prevent="login" />
				<input type="reset" class="btn" value="重置" />
			</div>
		</form>
	</div>
</template>

<script>

export default {
  data: function () {
    return {
      uname: '',
      password: ''
    }
  },
  methods: {
    // 请求登录
    login: async function () {
      const res = await this.axios.post('/login', {
        username: this.uname,
        password: this.password
      })
      if(res.meta.msg == '登录成功' && res.meta.status==200){
          // 使用登录用户信息的token保存用户的状态
          sessionStorage.setItem('username',res.data.username)
          sessionStorage.setItem('token',res.data.token)
          // 等待加载
          const loading = this.$loading({
		            lock: true,
		            text: 'Loading',
		            spinner: 'el-icon-loading',
		            background: 'rgba(187, 195, 199, 0.7)'
		          });
		          setTimeout(() => {
		            loading.close();
                this.$router.push('/index')
		          }, 2000);
      }
      else {
        this.$message.error(res.meta.msg)
        this.uname = ''
        this.password = ''
      }
    }
  }
}
</script>

<style scoped="scoped" lang="css">
	.login {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #2f4050;
	}

	.login .login-wrap {
		position: relative;
		max-width: 380px;
		margin: 180px auto;
		padding: 120px 40px 40px;
		border-radius: 4px;
		background-color: #fff;
	}

	.login .login-wrap .avatar {
		position: absolute;
		top: -60px;
		left: 50%;
		overflow: hidden;
		width: 140px;
		height: 140px;
		margin-left: -70px;
		border: 10px solid #fff;
		border-radius: 50%;
		box-shadow: 0 1px 5px #ccc;
	}

	.login .form-group {
		width: 100%;
		height: 40px;
		margin: 20px auto;
	}

	.login .form-group .unameicon {
		position: absolute;
		bottom: 168px;
		width: 23px;
	}

	.login .form-group .pwdicon {
		position: absolute;
		bottom: 110px;
		width: 23px;
	}

	.login .form-control {
		width: 100%;
		height: 100%;
		padding: 0 28px;
		border: 0;
		outline: none;
		font-size: 16px;
		background-color: #fff;
		box-sizing: border-box;
		border-bottom: 1px solid #b6b6b6;
	}

	.login .btn {
		width: 70px;
		height: 40px;
		border-radius: 5px;
		outline: none;
		border: 0;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		margin-left: 60%;
		background-color: #0055ff;
	}

	.login .btn:last-child {
		background-color: #a7a7b5;
		margin-left: 10px;
	}
</style>
