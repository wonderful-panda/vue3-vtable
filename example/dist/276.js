(self.webpackChunk=self.webpackChunk||[]).push([[276],{276:(e,l,t)=>{"use strict";t.r(l),t.d(l,{default:()=>v});var a=t(113),i=t.n(a),d=t(936),s=t(758),r=t(336);const c=(0,s.nl)(),n=r.iv`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`,o=r.iv`
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
  }
  .vlist-row:hover {
    background-color: #eee;
  }
  .cell-desc {
    flex: 1;
  }
`,u=[{id:"name",minWidth:80,defaultWidth:120},{id:"value",minWidth:80,defaultWidth:120,className:"cell-value"},{id:"description",minWidth:100,defaultWidth:240,className:"cell-desc"}],b=[];for(let e=1;e<10001;++e)b.push({id:e.toString(),value:"value: "+e});const v=(0,d.aZ)({name:"App",setup(){const e=(0,d.iH)({widths:{}}),l=e=>{const{id:l,value:t}=e.item;switch(e.columnId){case"name":return l;case"value":return t;case"description":return"desc: "+l;default:return e.columnId}};return()=>(0,d.Wm)("div",{class:n},[(0,d.Wm)(c,(0,d.dG)(i()({"update:state":l=>{e.value=l}}),{class:o,columns:u,getItemKey:e=>e.id,items:b,rowHeight:24,renderCell:l,state:e.value,hoveredSplitterClass:"vtable-splitter-active",draggingSplitterClass:"vtable-splitter-active"}),null)])}})}}]);
//# sourceMappingURL=276.js.map