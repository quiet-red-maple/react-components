import { useEffect, useRef } from 'react';

interface Props {
    specifiedField: string; // 指定字段
    replacementText: string; // 需要替换的字段
    className: string; // 需要查找的元素类名
}

// 强制替换body下新增节点的目标文本（antd Pro Table 中的列设置未对外开放api，通过该方法强制改变显示文本）
const useObserver = (props: Props) => {
    const { specifiedField, replacementText, className } = props;

    const obsRef = useRef<any>(null);
    // 找到的目标节点
    const elementList: any = [];
    function traverse (element) {
        if (element.textContent === specifiedField && element.children.length === 0) {
            elementList.push(element);
            return;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const child of element.children) {
            traverse(child);
        }
    }
    const init = () => {
        const body = document.getElementsByTagName('body')[0];

        const observer = new MutationObserver((mutationsList) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 处理 DOM 变化，比如新增的元素
                    const addedNode: any = mutation.addedNodes[0];
                    // 检查新增的元素是否有目标元素
                    if (addedNode?.textContent?.includes(specifiedField)) {
                        // 获取要修改的元素
                        const target = addedNode.getElementsByClassName(className)[0];
                        // 节点存在并且没有被替换为目标文本时
                        if (target && !target.textContent.includes(replacementText)) {
                            // 修改内容
                            traverse(target); // 找到所有最子级的目标元素
                            // 对所有找到的元素进行替换
                            elementList.forEach(element => {
                                const current = element;
                                const updatedText = element.textContent.replace(specifiedField, replacementText);
                                current.textContent = updatedText;
                            });
                            obsRef.current.disconnect();
                            return;
                        }
                    }
                }
            }
        });
        obsRef.current = observer;
        // 配置观察选项
        const observerConfig = { childList: true };

        // 开始观察指定的 DOM 节点
        observer.observe(body, observerConfig);
    };

    useEffect(() => {
        init();
        return () => {
            obsRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default useObserver;