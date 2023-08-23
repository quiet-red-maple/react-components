### 基于 react + antd + ts 封装的业务层基础组件

#### 1、ellipsis-text 字符省略组件
支持 
文本超出限制，显示省略号+Tooltip
指定字数显示省略号
指定宽度显示省略号

### 2、useObserver 操作dom替换指定dom文本内容

使用示例

```js
useObserver({
    specifiedField: '列设置',
    replacementText: '告警字段列设置',
    className: 'oss-ui-tooltip-inner',
  });
```

### 3、table-scrolling-load 基于 antd Table 下拉加载数据实现demo