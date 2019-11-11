// miniprogram/pages/index/index.js
const app=getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
imgUrls:[
 "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
 "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
 "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
],
    listData: [],
    current:"link"    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getListData()
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handlelink(ev){
    let id=ev.target.dataset.id;
    console.log(id);
    wx.cloud.callFunction({
      name:"update",
      data:{
        collection:"users",
        doc:id,
        data:"{link : _.inc(1)}"
         
      }
    }).then((res)=>{
      console.log(res);
      var  updated=res.result.stats.updated;
      if(updated){
        var  cloneListData = [...this.data.listData];
        for(let i=0;i<cloneListData.length;i++){
          if(cloneListData[i]._id==id){
          cloneListData[i].link++;
          }
        }
      }
      this.setData({
        listData: cloneListData
      })
    })
  },
  handlecurrnt(ev){
   let current=ev.target.dataset.current;
   if(current==this.data.current){
     return false;
   }
   this.setData({
    current 
   },()=>{
   this.getListData()  
   })
  },
  getListData(){
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      link: true
    })
      .orderBy(this.data.current, "desc")
      .get().then((res) => {
        this.setData({
          listData: res.data
        })
      }) 
  },
  handleDetail(ev){
    console.log(ev);
    let id=ev.target.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id
    })
  }
})