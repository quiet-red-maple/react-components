import React, { useEffect, useState, useRef } from 'react';
import { Table, ProTable } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { _ } from 'lodash';

const ScrollTableDem = () => {
    const tableRef = useRef<any>(null);
    const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const lock = useRef(false); // 确保前置请求完毕后再请求

    const columns: ColumnsType<any> = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            align: 'center',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            align: 'center',
            key: 'address',
        },
    ];

    // 模拟发送后端请求
    const mockGetData = (params) => {
        const { pageNum, pageSize } = params;
        console.log(33, pageNum, pageSize);
        return new Promise<Record<string, any>[]>((reject) => {
            const data = Array(10).fill({
                age: 32,
                name: '胡彦斌',
                address: '西湖区湖底公园1号',
            });

            setTimeout(() => reject(data), 1000);
        }).then((res) => {
            return res;
        });
    };

    // 获取数据
    const getList = async (params) => {
        lock.current = true;
        try {
        const list = await mockGetData(params);
        setDataSource([...dataSource, ...list]);
        } catch(e) {
            // 错误时回到上个分页
            // setCurrentPage((page: number) => page - 1);
        } finally {
            lock.current = false;
        }
    };

    useEffect(() => {
        getList({
            pageNum: currentPage,
            pageSize: 10,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handleScroll = () => {
        const container = tableRef?.current?.getElementsByClassName('oss-ui-table-body')[0];

        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - (scrollTop + clientHeight) <= 20 && !lock.current) {
                // 在此处执行滚动到距离底部20时的操作
                setCurrentPage((page: number) => page + 1);
            }
        }
    };
    useEffect(() => {
        const container = tableRef?.current?.getElementsByClassName('oss-ui-table-body')[0];
        container.addEventListener('scroll',  _.throttle(handleScroll, 500));
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const newData = dataSource.map((item, index) => ({
        ...item,
        id: index + 1,
    }));

    return (
        <div style={{ margin: 20 }}>
            <h2>滚动加载数据样例</h2>
            <Table
                columns={columns}
                ref={tableRef}
                dataSource={newData}
                // loading={loading}
                pagination={false}
                scroll={{ y: 300 }} // 设置表格内容的滚动区域高度
                sticky
                rowKey="id"
            />
        </div>
    );
};
export default ScrollTableDem;
