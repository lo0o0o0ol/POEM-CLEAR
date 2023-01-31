import { defHttp } from '/@/utils/http/axios';

enum Api {
  SubjectList = '/content/subjectList',
  CreateSubject = '/content/createSubject',
  UpdateSubject = '/content/updateSubject',
  SubjectItem = '/content/subjectItem',
  updateCheckSubject = '/content/updateCheckSubject',
  upDateSubjectRecycle = '/content/upDateSubjectRecycle',
  // delSubjectPost
  DelSubjectPost = '/content/delSubjectPost',
}

export function getSubjectList(params?: any) {
  return defHttp.get({ url: Api.SubjectList, params });
}
export function createSubject(data?: any) {
  return defHttp.post({ url: Api.CreateSubject, data });
}
export function updateSubject(params?: object) {
  return defHttp.post({ url: Api.UpdateSubject, params });
}
export function delSubjectPost(id: number) {
  return defHttp.post({ url: Api.DelSubjectPost, params: { id } });
}

export function getSubjectItem(id: number) {
  return defHttp.get({ url: Api.SubjectItem, params: { id } });
}
export function updateCheckSubject(id: number, checkStatus: string) {
  return defHttp.post({ url: Api.updateCheckSubject, params: { id, checkStatus } });
}
export function upDateSubjectRecycle(id: number, isRecycle: string) {
  return defHttp.post({ url: Api.upDateSubjectRecycle, params: { id, isRecycle } });
}