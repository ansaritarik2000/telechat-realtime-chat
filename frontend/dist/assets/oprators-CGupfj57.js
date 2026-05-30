function a(t){if(t===0)return"0 Bytes";const n=["Bytes","KB","MB","GB","TB"],o=1024,i=Math.floor(Math.log(t)/Math.log(o));return`${(t/Math.pow(o,i)).toFixed(2)} ${n[i]}`}export{a as f};
