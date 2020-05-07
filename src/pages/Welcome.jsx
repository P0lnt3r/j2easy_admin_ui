import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert, DatePicker } from 'antd';
import styles from './Welcome.less';
import FooterView from '@ant-design/pro-layout/lib/Footer';
import ProTable from '@ant-design/pro-table';


const { RangePicker } = DatePicker;
const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

function Account(id, username, password, age) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.age = age;
}
const getAccounts = (count) => {
  let accounts = [];
  let i = 0;
  while (i < count) {
    accounts.push(new Account(i, `UserName->${i}`, `Password->${i}`, i));
    i++;
  }
  return accounts;
}
const datasource = getAccounts(10);

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
  },
  {
    title: '创建时间',
    dataIndex: 'aaa',
    hideInTable: true,
    ellipsis: true,
    renderFormItem: () => (<RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
    />)
  }
]


export default () => (
  <PageHeaderWrapper>
    <ProTable
      style={{
        marginLeft: '10%'
      }}
      dataSource={datasource}
      rowKey="id"
      columns={columns} >
    </ProTable>
  </PageHeaderWrapper>
);

