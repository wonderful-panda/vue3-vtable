(self.webpackChunkvue3_vtable=self.webpackChunkvue3_vtable||[]).push([[391],{391:(e,l,a)=>{"use strict";a.r(l),a.d(l,{default:()=>m});var t=a(771),i=a.n(t),d=a(393),s=a(749),r=a(44);const n=(0,s.lH)(),o=r.iv`
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
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .vlist-row:hover {
    background-color: #eee;
  }
  .cell-desc {
    flex: 1;
  }
`,u=[{id:"name",minWidth:80,defaultWidth:120},{id:"value",minWidth:80,defaultWidth:120,className:"cell-value"},{id:"description",minWidth:100,defaultWidth:240,className:"cell-desc"}],v=[..."ABCDE"],p=(e,l)=>l<5?{data:{id:e,value:"value: "+e},children:v.map((a=>p(`${e}${a}`,l+1)))}:{data:{id:e,value:"value: "+e}},b=v.map((e=>p(e,0))),m=(0,d.aZ)({name:"App",setup(){const e=(0,d.iH)({widths:{}}),l=(0,d.iH)(null),a=e=>{const{id:l,value:a}=e.item.data;switch(e.columnId){case"name":return(0,d.Wm)(s.jc,{nodeState:e.item,class:"cell-name"},{default:()=>[l]});case"value":return a;case"description":return"desc: "+l;default:return e.columnId}};return()=>(0,d.Wm)("div",{class:o},[(0,d.Wm)("div",{style:{margin:"2px"}},[(0,d.Wm)("button",{style:{margin:"2px"},onClick:()=>l.value?.expandAll()},[(0,d.Uk)("Expand all")]),(0,d.Wm)("button",{style:{margin:"2px"},onClick:()=>l.value?.collapseAll()},[(0,d.Uk)("Collapse all")])]),(0,d.Wm)(n,(0,d.dG)(i()({"update:state":l=>{e.value=l}}),{ref:l,class:c,columns:u,getItemKey:e=>e.id,rootNodes:b,rowHeight:24,renderCell:a,state:e.value,hoveredSplitterClass:"vtable-splitter-active",draggingSplitterClass:"vtable-splitter-active"}),null)])}})}}]);
//# sourceMappingURL=391.js.map