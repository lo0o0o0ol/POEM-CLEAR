<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/5 xl:w-1/6" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-4/5 xl:w-5/6" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <!-- && hasPermission(['6000', '7000']) -->
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                disabled: getUserInfo.id == record.id || record.roleValue == 'systemAdmin',
                // disabled: getUserInfo.roleValue == 'RegularMembers',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, computed } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, delUser } from '/@/api/demo/system';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction },
    setup() {
      const go = useGo();
      const { hasPermission } = usePermission();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const { roleValue, id } = userStore.getUserInfo || {};
        return { roleValue, id };
      });
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '账号列表',
        api: getAccountList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await delUser(record.id);
        console.log(record);
        reload();
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          reload();
        }
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
        hasPermission,
        getUserInfo,
      };
    },
  });
</script>
