const {rTime, timestamp} = require("../../../../utils/timeformat");
const DB = require("../../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../../config");

exports.createPost = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    const {
        type,
        userId,
        title,
        content,
        cover = '',
        cateId = "",
        label_title = "",
        subjectIds='',
        postType,
        postFormats,
        status,
        checkStatus = "0",
        isRecycle = "1",
        openComment,
        drafts,
        orderNo,
        isTop
    } = req.body;
    const bannerInfo = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `title='${title}'`
    );
    if (!bannerInfo[0]) {
        const ret = await DB(res, "xcx_blog_post", "insert", "服务器错误", {
            type,
            userId,
            title,
            content,
            // content:JSON.stringify(content),
            cover,
            cateId,
            subjectIds,
            label_title,
            postType,
            postFormats,
            status,
            checkStatus,
            isRecycle,
            openComment,
            drafts,
            isTop,
            orderNo,
            createTime: rTime(timestamp(new Date())),
        });
        // for(let i  = 0;i<subjectList.length;i++){
        //     await DB(res, "xcx_blog_subject", "insert", "服务器错误", {
        //         userId,
        //         title,
        //         cover,
        //         description = "",
        //         postIds='',
        //         subjectCateId = "1",
        //         subjectlabelId = "2",
        //         isEnd,
        //         status,
        //         openComment,
        //         isTop,
        //         isRecycle = "1",
        //         createTime: rTime(timestamp(new Date())),
        //     });
        // }

        if (ret.affectedRows == 1) {

            res.json({
                code: 200,
                message: "发布成功 正在审核中",
            });
        }
    } else {
        res.json({
            code: 403,
            message: "文章标题已存在",
        });
    }
};


exports.updatePost = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    const {
        id,
        type,
        title,
        content,
        cover = '',
        cateId = "",
        label_title = "",
        postType,
        postFormats,
        status,
        isRecycle = "1",
        subjectIds='',
        openComment,
        isTop,
        drafts,
        orderNo
    } = req.body;
    /** 如果当前角色的 后台配置的 系统管理员 没有限制修改文章*/
    if (payload.accountId.roleValue == 'systemAdmin') {
        const ret = await DB(res, 'xcx_blog_post', 'update', '服务器错误', `id=${id}`, {
            type,
            title,
            content,
            // content:JSON.stringify(content).replace(/\"/g,"'"),
            cover,
            cateId,
            label_title,
            postType,
            postFormats,
            status,
            isRecycle,
            openComment,
            subjectIds,
            isTop,
            drafts,
            orderNo,
            updateTime: rTime(timestamp(new Date())),
        })
        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "修改成功"
            })
        } else {
            res.json({
                code: 403,
                message: "修改失败"
            })
        }
        return
    }
    const ret = await DB(res, 'xcx_blog_post', 'update', '服务器错误', `userId=${payload.accountId.id} and id=${id}`, {
        type,
        title,
        // content:JSON.stringify(content).replace(/\"/g,"'"),
        content,
        cover,
        cateId,
        label_title,
        postType,
        postFormats,
        status,
        subjectIds,
        isRecycle,
        openComment,
        isTop,
        drafts,
        updateTime: rTime(timestamp(new Date())),
    })
    if (ret.affectedRows == 1) {
       let result =  await DB(res, 'xcx_blog_post', 'find', '服务器错误', `userId=${payload.accountId.id} and id=${id}`)
            res.json({
            code: 200,
            message: result[0].checkStatus!=2? '发布成功 正在审核中':"修改成功"
        })
    } else {
        res.json({
            code: 403,
            message: "修改失败"
        })
    }
};
exports.postList = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }

    let params = {
        status: req.query.status || "",
        author: req.query.author || '',
        isRecycle: req.query.isRecycle || "1",
        drafts: req.query.drafts || '0',
        title: req.query.title || "",
        checkStatus: req.query.checkStatus || "",
        postType: req.query.postType || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10,
    };

    if (payload.accountId.roleValue == 'systemAdmin') {
        let result_num = await DB(
            res,
            "xcx_blog_post",
            "find",
            "服务器错误",
            `title like '%${params.title}%'  and drafts='${params.drafts}' and  isRecycle like '%${params.isRecycle}%' and postType like '%${params.postType}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
        );

        let result = await DB(
            res,
            "xcx_blog_post",
            "find",
            "服务器错误",
            `title like '%${params.title}%' and drafts like '%${params.drafts}%'  and isRecycle like '%${params.isRecycle
            }%' and status like '%${params.status}%'  and postType like '%${params.postType}%'  and  checkStatus like '%${params.checkStatus
            }%'  order by id desc  limit ${(params.page - 1) * params.pageSize},${params.pageSize
            }`
        );
        let userList = await DB(
            res,
            "sy_users",
            "find",
            "服务器错误",
        );
        result.forEach((v, i) => {
            v.cover = v.cover ? [v.cover] : '';
            v.label_title = v.label_title ? v.label_title.split(',') : [];

            v.cateId = v.cateId ? v.cateId.split(',').map(Number) : []
            v.subjectIds = v.subjectIds ? v.subjectIds.split(",").map(Number) : []
            // v.content = v.content.replace(/'/g, '"');

            userList.forEach((ele) => {
                if (v.userId == ele.id) {
                    v.author = {
                        username: ele.nickname,
                        avatar: ele.avatar
                    }
                }
            })
            if (v.createTime) {
                v.createTime = rTime(timestamp(v.createTime));
            }
            if (v.updateTime) {
                v.updateTime = rTime(timestamp(v.updateTime));
            } else {
                delete v.updateTime;
            }
        });

        if (!result[0]) {
            res.json({
                code: 200,
                result: {
                    items: [],
                },
            });
        } else {
            res.json({
                code: 200,
                result: {
                    items: result,
                    total: result_num.length,
                    page: Number(params.page),
                    pageSize: Number(params.pageSize),
                },
            });
        }
        return
    }
    let result_num = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id}  and drafts like '%${params.drafts}%'   and postType like '%${params.postType}%'  and title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
    );

    let result = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} and drafts='${params.drafts}'   and postType like '%${params.postType}%'  and title like '%${params.title}%' and isRecycle like '%${params.isRecycle
        }%' and status like '%${params.status}%' and  checkStatus like '%${params.checkStatus
        }%'  order by id desc  limit ${(params.page - 1) * params.pageSize},${params.pageSize
        }`
    );
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    result.forEach((v, i) => {
        v.cover = v.cover ? [v.cover] : '';
        v.label_title = v.label_title ? v.label_title.split(',') : [];

        v.cateId = v.cateId ? v.cateId.split(',').map(Number) : []
        // v.content = v.content.replace(/'/g, '"');
        v.subjectIds = v.subjectIds ? v.subjectIds.split(",").map(Number) : []
        userList.forEach((ele) => {
            if (v.userId == ele.id) {
                v.author = {
                    username: ele.nickname,
                    avatar: ele.avatar
                }
            }
        })
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
    });

    if (!result[0]) {
        res.json({
            code: 200,
            result: {
                items: [],
            },
        });
    } else {
        res.json({
            code: 200,
            result: {
                items: result,
                total: result_num.length,
                page: Number(params.page),
                pageSize: Number(params.pageSize),
            },
        });
    }
};

exports.postSelectList = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }

    let params = {
        status: req.query.status || "1",
        isRecycle: req.query.isRecycle || "1",
        drafts: req.query.drafts || '0',
        title: req.query.title || "",
        checkStatus: req.query.checkStatus || "2",
        postType: req.query.postType || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 100000,
    };

    let result_num = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id}  and drafts like '%${params.drafts}%'   and postType like '%${params.postType}%'  and title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
    );

    let result = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} and drafts like '%${params.drafts}%'   and postType like '%${params.postType}%'  and title like '%${params.title}%' and isRecycle like '%${params.isRecycle
        }%' and status like '%${params.status}%' and  checkStatus like '%${params.checkStatus
        }%'  order by orderNo desc  limit ${(params.page - 1) * params.pageSize},${params.pageSize
        }`
    );

    result.forEach((v, i) => {
        v.cover = v.cover ? [v.cover] : '';
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
    });

    if (!result[0]) {
        res.json({
            code: 200,
            result: {
                items: [],
            },
        });
    } else {
        res.json({
            code: 200,
            result: {
                items: result,
                total: result_num.length,
                page: Number(params.page),
                pageSize: Number(params.pageSize),
            },
        });
    }
};
/**
 * 文章详情
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.postItem = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    let {id} = req.query;
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    let cateList = await DB(res, 'sy_blog_cate', 'find', '服务器出错', `status=1`);
    let result = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `id='${id}'`
    );

    result.forEach((v) => {
        v.cover = v.cover ? [v.cover] : [];
        // v.cateId = v.cateId ? v.cateId.split(',') : [];
        cateList.forEach((ele)=>{
            if(ele.id==v.cateId)
            v.cate_title = ele.title
        })
        v.label_title = v.label_title ? v.label_title.split(',') : [];
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
        userList.forEach((ele) => {
            if (v.userId == ele.id) {
                v.author = ele.nickname
                v.avatar = ele.avatar

            }
        })
    });
    if (!result[0]) {
        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result: {
                items: {},
            },
        });
    } else {
        res.json({
            code: 200,
            type: "success",
            message: "ok",
            result: {
                items: result[0],
            },
        });
    }
};

/**
 * 文章放入回收站 恢复
 * @param req
 * @param res
 */
exports.upDatePostRecycle = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    const {id, isRecycle} = req.body;
    const ret = await DB(
        res,
        "xcx_blog_post",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            isRecycle,
            updateTime: rTime(timestamp(new Date())),
        }
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: isRecycle == 1 ? "已还原" : '已删除',
        });
    } else {
        res.json({
            code: 200,
            message: "修改失败",
        });
    }
};

/**
 * 审核文章 0 审核中 1 审核失败 2 审核成功
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateCheckPost = async (req, res) => {
    const {id, checkStatus} = req.body;
    const ret = await DB(
        res,
        "xcx_blog_post",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            checkStatus,
        }
    );
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "审核成功",
        });
    } else {
        res.json({
            code: 200,
            message: "审核失败",
        });
    }
};

/**
 * 删除文章
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.delPost = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    const {id} = req.body;
    const ret = await DB(
        res,
        "xcx_blog_post",
        "delete",
        "服务器错误",
        `id='${id}'`
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功",
        });
    } else {
        res.json({
            code: 200,
            message: "修改失败",
        });
    }
};
