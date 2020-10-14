(self.webpackChunk=self.webpackChunk||[]).push([[332],{332:(e,l,t)=>{"use strict";t.r(l),t.d(l,{default:()=>m});var a=t(113),d=t.n(a),i=t(936),s=t(758),r=t(336);const n=(0,s.lH)(),o=r.iv`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`,c=r.iv`
  border: 1px solid #bbb;
  flex: 1;
  .vtable-header {
    border-bottom: 1px solid #bbb;
  }
  .vtable-splitter {
    border-right: 1px solid #bbb;
  }
  .vtable-splitter-active {
    background-color: #bbb;
  }
  .vtable-cell,
  .vtable-header-cell {
    padding: 0 2px;
    text-overflow: ellipsis;
  }
  .vlist-row:hover {
    background-color: #eee;
  }
  .cell-desc {
    flex: 1;
  }
`,u=[{id:"name",minWidth:80,defaultWidth:120},{id:"value",minWidth:80,defaultWidth:120,className:"cell-value"},{id:"description",minWidth:100,defaultWidth:240,className:"cell-desc"}],p=[..."ABCDE"],v=(e,l)=>l<5?{data:{id:e,value:"value: "+e},children:p.map((t=>v(`${e}${t}`,l+1)))}:{data:{id:e,value:"value: "+e}},b=p.map((e=>v(e,0))),m=(0,i.aZ)({name:"App",setup(){const e=(0,i.iH)({widths:{}}),l=(0,i.iH)(null),t=e=>{const{id:l,value:t}=e.item.data;switch(e.columnId){case"name":return(0,i.Wm)(s.jc,{nodeState:e.item,class:"cell-name"},{default:()=>[l]});case"value":return t;case"description":return"desc: "+l;default:return e.columnId}};return()=>(0,i.Wm)("div",{class:o},[(0,i.Wm)("div",{style:{margin:"2px"}},[(0,i.Wm)("button",{style:{margin:"2px"},onClick:()=>l.value?.expandAll()},[(0,i.Uk)("Expand all")]),(0,i.Wm)("button",{style:{margin:"2px"},onClick:()=>l.value?.collapseAll()},[(0,i.Uk)("Collapse all")])]),(0,i.Wm)(n,(0,i.dG)(d()({"update:state":l=>{e.value=l}}),{ref:l,class:c,columns:u,getItemKey:e=>e.id,rootNodes:b,rowHeight:24,renderCell:t,state:e.value,hoveredSplitterClass:"vtable-splitter-active",draggingSplitterClass:"vtable-splitter-active"}),null)])}})}}]);
//# sourceMappingURL=332.js.map