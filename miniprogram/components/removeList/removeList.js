// components/removeList/removeList.js
const app=getApp()
const db=wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: "apply-shared" // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
userMessage:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    messagelist(){
      wx.showModal({
      title:"提示信息",
      content:"删除信息",
      confirmText:"删除",
      success:(res)=>{
       if(res.confirm){
         db.collection('message').where({
          userId:app.userInfo._id 
         }).get().then((res)=>{
           console.log(res);
           let list=res.data[0].list;
           console.log(list);
           list=list.filter((val,i)=>{
             return val !=this.data.messageId;
           })
           
           console.log(list);
           wx.cloud.callFunction({
            name:'update',
            data:{
             collection:"message",
             where:{
               userId:app.userInfo._id
             },
             data:{
               list
             } 
            } 
           }).then((res)=>{
           this.triggerEvent("myevent",list)
           })
         })
        console.log("用户点击确定"); 
       }else if(res.cancel){
         console.log("用户点击取消");
       } 
      }

      })
    }
  },
  lifetimes:{
   attached:function(){
    db.collection('users').doc(this.data.messageId).field({
      userPhoto:true,
      nickName:true
    }).get().then((res)=>{

      this.setData({
        userMessage:res.data
      })
    }) 
   } 
  }
})
