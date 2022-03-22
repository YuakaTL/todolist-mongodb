const headers = require('./corsHeader');

const errorContentCenter = {
    400: {
        40001: '格式錯誤',
        40002: '資料錯誤',
        40003: '無此資料',
    },
    403: '權限不足',
    404: '無此網站路由',
    default: '連接錯誤',
}

const errorHandle = (res, status, errorCode) => {
    let customErrorMessage = errorContentCenter['default']

    if (status) customErrorMessage = errorContentCenter[status]
    if (status && errorCode)
        customErrorMessage = errorContentCenter[status][errorCode]

    let data = {
        'status': 'error',
        'message': `${customErrorMessage}`,
    }

    if (errorCode) {
        data = {
            ...data,
            'code': errorCode,
            'message': `${errorContentCenter[status][errorCode]}`,
        }
    }

    res.writeHead(status, headers)
    res.write(JSON.stringify(data))
    res.end()
}


const successHandle = (res, data) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        'status': 'success',
        'data': data,
    }))
    res.end();
}

module.exports = {
    errorHandle,
    successHandle
}