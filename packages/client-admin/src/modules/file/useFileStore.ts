import { Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { findData, findOneData, updateFieldData, destroyData } from './api';
import { STATUS, TYPE } from './constants';
import { FILE_STORE_KEY } from '@/configs/storeKeys';
import { BaseItem, UpdateFieldParmas, ListFilter } from '@/types/globals';

export interface FileItem extends BaseItem {
    originalname: string;
    filename: string;
    description: string;
    path: string;
    mimetype: string;
    type: TYPE;
    authorId: number;
}
export type FileList = Array<FileItem>;
export interface FileFilter extends ListFilter {
    order: string;
    type: TYPE;
}

export interface UpdateFieldPamas {
    id: number;
    field: string;
    value: any;
    type: string;
}

export default defineStore(FILE_STORE_KEY, () => {
    const detail: FileItem = reactive({
        id: undefined,
        uuid: undefined,
        originalname: '',
        filename: '',
        description: '',
        path: '',
        mimetype: '',
        type: TYPE.ALL,
        authorId: 0,
        status: STATUS.ALL,
        createdAt: undefined,
        updatedAt: undefined,
    });
    const defaultCache = cloneDeep(detail);
    const list: Ref<FileItem[]> = ref([]);
    const filter: FileFilter = reactive({
        page: 1,
        size: 20,
        order: 'updatedAt DESC',
        status: STATUS.ALL,
        type: TYPE.ALL,
    });
    const total = ref(0);

    const find = async (query?: Record<string, any>) => {
        Object.assign(filter, query);
        const res = await findData(filter);
        console.log('res', res);
        list.value = res.list;
        total.value = res.total;
    };
    const findOne = async (id: number) => {
        const res = await findOneData(id);
        Object.assign(detail, res);
    };

    const isDialogUpdateVisible = ref(false);
    const updateDialogUpdateVisibleState = (visible: boolean) => {
        isDialogUpdateVisible.value = visible;
    };

    const resetDetail = () => {
        Object.assign(detail, defaultCache);
    };

    /**
     * ??????????????????
     * @param data
     */
    const updateStatus = async (data: UpdateFieldParmas) => {
        const { id, field, value, type } = data;
        updateFieldData(id, {
            type,
            field,
            value,
        }).then((res) => {
            debugger;
            if (res.affected === 1) {
                ElMessage({
                    type: value === STATUS.AVAILABLE ? 'success' : 'warning',
                    message:
                        value === STATUS.AVAILABLE
                            ? '??????????????????'
                            : '????????????',
                });
            }
        });
    };

    const destroy = (id: number) => {
        ElMessageBox.confirm('?????????????????????????????????????????????', '????????????', {
            confirmButtonText: '??????',
            cancelButtonText: '??????',
            type: 'warning',
        })
            .then(() => {
                destroyData(id)
                    .then((res) => {
                        find(filter);
                        return res;
                    })
                    .then(() => {
                        ElMessage({
                            type: 'success',
                            message: '????????????',
                        });
                    });
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '????????????',
                });
            });
    };

    return {
        detail,
        list,
        total,
        filter,
        find,
        findOne,
        isDialogUpdateVisible,
        updateDialogUpdateVisibleState,
        resetDetail,
        destroy,
        updateStatus,
    };
});
