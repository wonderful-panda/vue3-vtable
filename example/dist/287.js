(self.webpackChunkvue3_vtable=self.webpackChunkvue3_vtable||[]).push([[287],{287:(e,l,t)=>{"use strict";t.r(l),t.d(l,{default:()=>b});var a=t(771),i=t.n(a),s=t(393),d=t(749),r=t(44);const c=(0,d.nl)(),o=r.iv`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`,n=r.iv`
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
`,u=[{id:"name",minWidth:80,defaultWidth:120},{id:"value",minWidth:80,defaultWidth:120,className:"cell-value"},{id:"description",minWidth:100,defaultWidth:240,className:"cell-desc"}],v=[];for(let e=1;e<10001;++e)v.push({id:e.toString(),value:"value: "+e});const b=(0,s.aZ)({name:"App",setup(){const e=(0,s.iH)({widths:{}}),l=e=>{const{id:l,value:t}=e.item;switch(e.columnId){case"name":return l;case"value":return t;case"description":return"desc: "+l;default:return e.columnId}};return()=>(0,s.Wm)("div",{class:o},[(0,s.Wm)(c,(0,s.dG)(i()({"update:state":l=>{e.value=l}}),{class:n,columns:u,getItemKey:e=>e.id,items:v,rowHeight:24,renderCell:l,state:e.value,hoveredSplitterClass:"vtable-splitter-active",draggingSplitterClass:"vtable-splitter-active"}),null)])}})}}]);
//# sourceMappingURL=287.js.map