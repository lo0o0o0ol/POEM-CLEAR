import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';

export const columns: BasicColumn[] = [
  {
    title: '封面',
    dataIndex: 'cover',
    width: 100,
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    width: 300,
    align: 'left',
  },

  {
    title: '浏览量',
    dataIndex: 'views_count',
    width: 80,
  },
  {
    title: '点赞量',
    dataIndex: 'like_count',
    width: 80,
  },
  {
    title: '评论量',
    dataIndex: 'comment_count',
    width: 80,
  },
  {
    title: '收藏量',
    dataIndex: 'collect_count',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === '1',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? '1' : '0';
          const { createMessage } = useMessage();
          setRoleStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改文章状态`);
            })
            .catch(() => {
              // createMessage.error('修改文章状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '审核状态',
    dataIndex: 'checkStatus',
    width: 80,
    customRender: ({ record }) => {
      const status = record.checkStatus;
      const toDoEnable = ~~status === 0;
      const FailEnable = ~~status === 1;
      const SuccessEnable = ~~status === 2;
      const color = toDoEnable ? 'orange' : SuccessEnable ? 'green' : 'red';
      const text = toDoEnable ? '审核中' : FailEnable ? '未通过' : '审核通过';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '文章标题',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'checkStatus',
    label: '审核状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '审核中', value: '0' },
        { label: '审核失败', value: '1' },
        { label: '审核通过', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
  // checkStatus
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '文章名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleValue',
    label: '文章值',
    required: true,
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
  },
];
