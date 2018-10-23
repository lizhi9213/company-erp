var express = require('express')
var router = express.Router()
var URL = require('url')
var Mock = require('mockjs')
var multiparty = require('multiparty')
// var path = require('path')
var fs = require('fs')

router.get('/getClassifly', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  const classList = [{
      id: '01',
      name: '常用工作'
    },
    {
      id: '02',
      name: '全部工作'
    },
    {
      id: '03',
      name: '公文管理'
    },
    {
      id: '04',
      name: '行政管理'
    },
    {
      id: '05',
      name: '人资管理'
    },
    {
      id: '06',
      name: '财务管理'
    },
    {
      id: '07',
      name: '资产管理'
    },
    {
      id: '08',
      name: '项目管理'
    },
    {
      id: '09',
      name: '采购管理'
    },
    {
      id: '10',
      name: '生产管理'
    },
    {
      id: '11',
      name: '销售业务'
    },
    {
      id: '12',
      name: '其他'
    }
  ]
  res.send(classList)
})

router.get('/getTemplateList', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  const iconList = []
  const num = Math.floor(Math.random() * 10 + 1)
  // console.log(num)
  for (let i = 0; i < num; i++) {
    iconList.push(
      Mock.mock({
        'id|+1': 33,
        'IconText|1': [
          'ask',
          'clock_fill',
          'coordinates_fill',
          'flag_fill',
          'group_fill',
          'label_fill'
        ],
        'IconColor|1': [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          '#c7158577'
        ],
        'TmpName|1': [
          '借款申请',
          '用印申请',
          '开票申请',
          '开支计划申请表',
          '费用报销申请表',
          '资产购置申请表',
          '资产调拨',
          '内部结算申请',
          '技术部采购单',
          '员工岗位变动申请',
          '辞职申请表'
        ]
      })
    )
  }
  if (params.id) {
    res.send(iconList)
  }
})

router.post('/saveTmpForm', (req, res) => {
  // console.log(req.body)
  if (req.body.TmpName) {
    res.send({
      code: true,
      msg: '创建成功！',
      id: '123'
    })
  }
})

router.post('/fileUpload', (req, res) => {
  // 生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({
    uploadDir: './upload/picture/'
  })

  // 上传完成后处理
  form.parse(req, function (err, fields, files) {
    // var obj = {}

    var filesTmp = JSON.stringify(files, null, 2)
    if (err) {
      console.log('parse error: ' + err)
    } else {
      console.log('parse files: ' + filesTmp)
      var inputFile = files.file[0]
      var uploadedPath = inputFile.path
      var dstPath = './upload/picture/' + inputFile.originalFilename
      // 重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
          console.log('rename error: ' + err)
          res.send({
            code: false,
            msg: '上传失败！'
          })
        } else {
          console.log('rename ok')
          res.send({
            code: true,
            fileName: inputFile.originalFilename,
            url: '/APIService/upload/picture/' + inputFile.originalFilename,
            id: '01',
            msg: '上传成功！'
          })
        }
      })
    }
  })
})

router.get('/delUploadFile', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params.id)
  if (params.id) {
    res.send({
      code: true,
      msg: '删除成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '删除失败！'
    })
  }
})

router.get('/applyForm', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params.id)
  const formData = {
    applyName: '请假申请',
    applyDesc: '测试请假申请测试请假申请测试请假申请测试请假申请测试请假申请测试请假申请',
    attachList: [{
      FileSrc: '/src/images/logo.png',
      FileName: '14561326813261.png'
    }, {
      FileSrc: '/src/images/logo.png',
      FileName: '14561326813261.png'
    }],
    FormData: [
      [{
        type: 1,
        name: 'podpis',
        text: '描述文字',
        scale: 24,
        tips: '',
        content: '',
        label: '描述文字'
      }],
      [{
        type: 2,
        name: 'dtext',
        text: '单行文字',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        astrict: false,
        maximum: -1,
        minimum: -1,
        label: '单行文字'

      }],
      [{
        type: 3,
        name: 'mtext',
        text: '多行文字',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        astrict: false,
        maximum: '',
        minimum: '',
        label: '多行文字'
      }],
      [{
        type: 4,
        name: 'date',
        text: '日期',
        scale: 24,
        tips: '',
        date: '',
        required: false,
        norepeat: false,
        precise: false,
        label: '日期'
      }],
      [{
        type: 5,
        name: 'email',
        text: '邮箱',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        label: '邮箱'
      }],
      [{
        type: 6,
        name: 'phone',
        text: '手机',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        label: '手机'
      }],
      [{
        type: 7,
        name: 'number',
        text: '数字',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        decimals: true,
        label: '数字'
      }],
      [{
        type: 8,
        name: 'link',
        text: '链接',
        scale: 24,
        tips: '',
        default: '',
        required: false,
        norepeat: false,
        label: '链接'
      }],
      [{
        type: 9,
        name: 'uniterming',
        text: '单项选择',
        scale: 24,
        tips: '',
        radio: '',
        required: false,
        arrange: 1,
        share: false,
        oFlag: false,
        childs: [{
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          }
        ],
        label: '单项选择'
      }],
      [{
        type: 10,
        name: 'dropdown',
        text: '下拉选择',
        scale: 24,
        tips: '',
        select: '',
        required: false,
        share: false,
        oFlag: false,
        childs: [{
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          }
        ],
        label: '下拉选择'
      }],
      [{
        type: 11,
        name: 'multiple',
        text: '多项选择',
        scale: 24,
        tips: '',
        checkbox: [],
        required: false,
        arrange: 1,
        share: false,
        astrict: false,
        maximum: '',
        minimum: '',
        oFlag: false,
        childs: [{
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          },
          {
            label: '未命名',
            rnoly: false,
            frequency: 0
          }
        ],
        label: '多项选择'
      }],
      [{
        type: 12,
        name: 'fileupload',
        text: '附件上传',
        scale: 24,
        tips: '',
        required: false,
        limitType: false,
        fileType: [],
        limitSize: true,
        listText: 'txt/html',
        maxSize: 20,
        label: '附件上传'
      }],
      [{
        type: 13,
        name: 'timerange',
        text: '起止时间',
        scale: 24,
        tips: '',
        daterange: '',
        required: false,
        norepeat: false,
        precise: false,
        label: '起止时间'
      }],
      [{
        type: 14,
        name: 'picture',
        text: '图片选择',
        scale: 24,
        tips: '',
        selectimg: [],
        required: false,
        astrict: false,
        maximum: '',
        minimum: '',
        share: false,
        oFlag: false,
        childs: [{
            label: '未命名',
            imglist: 1,
            imgurl: '/src/images/image-choice-1.png',
            frequency: 0
          },
          {
            label: '未命名',
            imglist: 2,
            imgurl: '/src/images/image-choice-2.png',
            frequency: 0
          },
          {
            label: '未命名',
            imglist: 3,
            imgurl: '/src/images/image-choice-3.png',
            frequency: 0
          }
        ],
        label: '图片选择'
      }],
      [{
        type: 15,
        name: 'richtext',
        text: '富文本',
        scale: 24,
        value: '',
        tips: '',
        required: false,
        label: '富文本'
      }]
    ]
  }
  if (params.id) {
    res.send(formData)
  } else {
    res.status(500).send({
      error: '无法获取到ID值'
    })
  }
})

module.exports = router
