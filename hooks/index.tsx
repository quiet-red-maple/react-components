import React from 'react';
import useObserver from './useObserver';

// 使用示例
const Example = () => {

  useObserver({
    specifiedField: '列设置',
    replacementText: '告警字段列设置',
    className: 'oss-ui-tooltip-inner',
  });
  
  return (
    <div>
      <h1>使用示例</h1>
    </div>
  )
}

export default Example;