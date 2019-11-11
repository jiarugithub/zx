// miniprogram/pages/user/user.js
const app=getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userPhoto:"/images/user/user-weidenglu.png",
  nickName:"柚子恋上蜂蜜",
  logged:false,
  disabled:true,
  isLocation:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.getLocation()
   wx.cloud.callFunction({name:"login",
   data:{}
   }).then((res)=>{
    // console.log(res);
    db.collection("users").where({
     _openid:res.result.openid 
    }).get().then((res)=>{
      if(res.data.length){
        app.userInfo = Object.assign(app.userInfo, res.data[0]);

        console.log(res.data);
        this.setData({
          userPhoto: app.userInfo.userPhoto,
          nickName: app.userInfo.nickName,
          logged: true
        }) 
        this.getMessage()
      }else{
        this.setData({
       disabled:false 
      })
      }
     
    })
   })
    
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   this.setData({
    userPhoto:app.userInfo.userPhoto,
    nickName:app.userInfo.nickName 
   })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (){

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*获取微信基本信息，把信息插入到云数据库中，再把数据抛出到其他组件可以使用，实时更新用户的数据*/
  bindGetUserInfo:function(ev){
    let userInfo=ev.detail.userInfo;
   console.log(userInfo);
    if(!this.data.logged && userInfo){
      db.collection('users').add({
        data:{
        /*微信头像*/userPhoto:userInfo.avatarUrl,
       /*微信名*/ nickName:userInfo.nickName,
        /*签名*/signatrue:'',
        /*电话号码*/phoneNumber:'',
        /*微信账号*/weixinNumber:'',
        /*点赞*/link:0,
        /*注册时间*/time:new Date(),
          longitude: this.longitude,
          latitude: this.latitude   
        }
      }).then((res)=>{
      db.collection("users").doc(res._id).get().then((res)=>{
        console.log(res.data);
        app.userInfo=Object.assign(app.userInfo,res.data);
        this.setData({
         userPhoto:app.userInfo.userPhoto,
         nickName:app.userInfo.nickName,
         logged:true,
          
         
        })
      })
      })
    }
  },
 getMessage(){
   db.collection('message').where({
     userId: app.userInfo._id
   }).watch({
     onChange: function (snapshot) {
     console.log(snapshot);
       if(snapshot.docChanges.length){
         let list=snapshot.docChanges[0].doc.list;
         if(list.length){
           wx.showTabBarRedDot({
             index: 2
           });
           app.userMessage=list;
         }
       }else{
        wx.hideTabBarRedDot({
          index: 2
        })
        app.userMessage=[];
       }
     },
     onError: function (err) {
       console.error('the watch closed because of error', err)
     }
   })
  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
         this.latitude = res.latitude
        this.longitude = res.longitude
        
      }
    })
  }
})