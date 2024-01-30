import{i as e,s as n}from"./main-ce25b28f.js";import{i as s}from"./ipcRenderer-5e19eaee.js";import{_ as o,h as i,r as a,o as d,b as l,g as t,a as c,w,e as g,t as r,p as u,f as p}from"./index-de86382b.js";const k={data:()=>({messageString:"",message1:"",message2:"",message3:"",windowName:"window-ipc",newWcId:0,views:[{type:"vue",content:"#/special/subwindow",windowName:"window-ipc",windowTitle:"ipc window"}]}),mounted(){this.init()},methods:{init(){s.removeAllListeners(e.ipcSendMsg),s.on(e.ipcSendMsg,((n,s)=>{console.log("[ipcRenderer] [socketMsgStart] result:",s),this.messageString=s,n.sender.send(e.hello,"electron-egg")})),s.removeAllListeners(n.window2ToWindow1),s.on(n.window2ToWindow1,((e,n)=>{this.$message.info(n)}))},sendMsgStart(){s.send(e.ipcSendMsg,{type:"start",content:"开始"})},sendMsgStop(){s.send(e.ipcSendMsg,{type:"end",content:""})},handleInvoke(){s.invoke(e.ipcInvokeMsg,"异步-回调").then((e=>{console.log("r:",e),this.message1=e}))},async handleInvoke2(){const n=await s.invoke(e.ipcInvokeMsg,"异步");console.log("msg:",n),this.message2=n},handleSendSync(){const n=s.sendSync(e.ipcSendSyncMsg,"同步");this.message3=n},createWindow(n){s.invoke(e.createWindow,i(this.views[n])).then((e=>{console.log("[createWindow] id:",e)}))},async sendTosubWindow(){this.newWcId=await s.invoke(e.getWCid,this.windowName),s.sendTo(this.newWcId,n.window1ToWindow2,"窗口1通过 sendTo 给窗口2发送消息")}}},m=e=>(u("data-v-227d95f1"),e=e(),p(),e),v={id:"app-base-socket-ipc"},f=m((()=>t("div",{class:"one-block-1"},[t("span",null," 1. 发送异步消息 ")],-1))),h={class:"one-block-2"},S=m((()=>t("p",null,null,-1))),_=m((()=>t("div",{class:"one-block-1"},[t("span",null," 2. 同步消息（不推荐，阻塞执行） ")],-1))),b={class:"one-block-2"},C=m((()=>t("div",{class:"one-block-1"},[t("span",null," 3. 长消息： 服务端持续向前端页面发消息 ")],-1))),W={class:"one-block-2"},M=m((()=>t("div",{class:"one-block-1"},[t("span",null," 4. 多窗口通信：子窗口与主进程通信，子窗口互相通信 ")],-1))),y={class:"one-block-2"};const I=o(k,[["render",function(e,n,s,o,i,u){const p=a("a-button"),k=a("a-space");return d(),l("div",v,[f,t("div",h,[c(k,null,{default:w((()=>[c(p,{onClick:u.handleInvoke},{default:w((()=>[g("发送 - 回调")])),_:1},8,["onClick"]),g(" 结果："+r(i.message1),1)])),_:1}),S,c(k,null,{default:w((()=>[c(p,{onClick:u.handleInvoke2},{default:w((()=>[g("发送 - async/await")])),_:1},8,["onClick"]),g(" 结果："+r(i.message2),1)])),_:1})]),_,t("div",b,[c(k,null,{default:w((()=>[c(p,{onClick:u.handleSendSync},{default:w((()=>[g("同步消息")])),_:1},8,["onClick"]),g(" 结果："+r(i.message3),1)])),_:1})]),C,t("div",W,[c(k,null,{default:w((()=>[c(p,{onClick:u.sendMsgStart},{default:w((()=>[g("开始")])),_:1},8,["onClick"]),c(p,{onClick:u.sendMsgStop},{default:w((()=>[g("结束")])),_:1},8,["onClick"]),g(" 结果："+r(i.messageString),1)])),_:1})]),M,t("div",y,[c(k,null,{default:w((()=>[c(p,{onClick:n[0]||(n[0]=e=>u.createWindow(0))},{default:w((()=>[g("打开新窗口2")])),_:1}),c(p,{onClick:n[1]||(n[1]=e=>u.sendTosubWindow())},{default:w((()=>[g("向新窗口2发消息")])),_:1})])),_:1})])])}],["__scopeId","data-v-227d95f1"]]);export{I as default};
