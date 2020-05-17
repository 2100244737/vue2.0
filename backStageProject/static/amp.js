var str = []
window.onload=function(){


}
getData(sessionStorage.getItem("JSON"))
function getData(row) {
    var _t = this;
    const params = {
        "bizContent": row,
        "encryptType": "NONE",
        "filename": "FCS_MAP_FIND_REQ_88000504_20200108150154581.json",
        "version": "2.0",
        "signType": "NONE",
        "sign": "NONE",
        "timestamp": "2020-01-08T15:01:54",
        "tokenType": "USER_AUTH",
        "accessToken": "chinaetcorg",
    }
    axios.post('/b/api/json', params).then(function (response) {
        if (response.data.statusCode != 0) {
            _t.$confirm(response.data.errorMsg, '查询日志失败', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
        } else {
            if (response.data.bizContent) {
                str = JSON.parse(response.data.bizContent).data
                // _t.setData(JSON.stringify(JSON.parse(response.data.bizContent).data))
                // JSON.stringify(JSON.parse(response.data.bizContent).data)
            } else {
                _t.$confirm(response.data.errorMsg, '此文件无法查看地图', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            }

        }

    }).catch(function (error) {
        console.log(error);
    });
    return str
}
