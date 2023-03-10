const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createNotice,NoticeList,NoticeMessageList,updateNotice,delNotice,multipleDelNotice,setNoticeStatus,NoticeRead} = require('../../../controller/admin/notice')
// createNotice, updateNotice, delNotice, NoticeInfo

router.post('/createNotice', createNotice)
router.post('/updateNotice', updateNotice)
router.post('/delNotice', delNotice)
router.post('/multipleDelNotice', multipleDelNotice)
router.post('/setNoticeStatus', setNoticeStatus)
// router.get('/NoticeInfo', NoticeInfo)
router.get('/noticeList', NoticeList)
router.get('/NoticeMessageList', NoticeMessageList)
router.get('/NoticeRead', NoticeRead)
module.exports = router