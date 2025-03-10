import { AnimationClip } from 'three'
var clipActions = {
  mixer: null,
  object3d: null,
  animations: null,
  actions: {},
  racks: null,
  visibleList: ['对象70491', '对象70520', '组39734', '组038', '对象70563'], //要隐藏子模型
  //初始化
  init: function (_mixer, _object3d, _animations) {
    this.mixer = _mixer
    this.object3d = _object3d
    this.animations = _animations
    this.formaterAnimations()
    this.setAnimation()
    this.setRackModel()
    //隐藏多余模型
    this.visibleList.forEach((name) => {
      let fm = this.findModel(this.object3d, 'name', name)
      fm.visible = false
    })
  },
  formaterAnimations() {
    this.animations = this.animations.reduce((res, item) => {
      res = res.concat(item.tracks)
      return res
    }, [])
  },
  //隐藏模型
  togglerVisible: function (data, type) {
    data.visible = type
    data.traverse(function (obj) {
      if (obj.type === 'Mesh') {
        obj.material.visible = type
      }
    })
  },
  //查询模型
  findModel: function (model, keyName, keyValue) {
    let result = null
    const deepFind = function (initModel) {
      if (initModel[keyName] == keyValue) {
        result = initModel
        return true
      } else if (initModel.children && initModel.children.length) {
        for (let i in initModel.children) {
          let cfm = deepFind(initModel.children[i])
          if (cfm) return cfm
        }
      }
    }
    deepFind(model)
    return result
  },
  transitionPosition(model, position, time, frame) {
    let timer = setInterval(() => {
      if (Math.abs(model.position.y - position.y) >= 0.1) {
        model.position.y += model.position.y - position.y > 0 ? -0.05 : 0.05
      } else {
        clearInterval(timer)
      }
    }, 200)
  },
  // 获取动作合集
  findTracks: function (nameList) {
    let result = nameList.reduce((res, name) => {
      if (!this.animations.find((item) => item.name === name)) {
        console.error('未找到模型对象：', name)
      }
      res.push(this.animations.find((item) => item.name === name))
      return res
    }, [])
    return result
  },
  //配置模型动画
  setAnimation() {
    let jgd = ['jin_guidao.position', 'jin_guidao.quaternion', '箱子.position']
    let cgd = ['chu_guidao.position', 'chu_guidao.quaternion']
    let animas = [
      {
        name: 'jinGuiDao',
        time: 0,
        duration: 10,
        timeout: 18,
        tracks: jgd
      },
      {
        name: 'chuGuiDao',
        time: 0,
        duration: 10,
        timeout: 18,
        tracks: cgd
      },
      {
        name: 'chu3',
        model: '箱子021',
        time: 0,
        duration: 20,
        timeout: 10,
        tracks: ['chu03.position', '箱子021.position']
      },
      {
        name: 'chu2',
        model: '箱子021',
        time: 0,
        duration: 20,
        timeout: 10,
        tracks: ['chu02.position', '箱子002.position']
      },
      {
        name: 'chu1',
        model: '箱子022',
        time: 5,
        duration: 20,
        timeout: 10,
        tracks: ['箱子022.position']
      },
      {
        name: '1105',
        time: 0,
        duration: 20,
        timeout: 40,
        tracks: [
          ...jgd,
          '箱子023.position',
          '移动小车042.position',
          '小红车043.position',
          'Rectangle37222.position',
          'Rectangle37223.position',
          'Rectangle37224.position',
          'Rectangle37225.position'
        ]
      },
      {
        name: '1206',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子019.position',
          '箱子019.position',
          '组122411.position',
          '移动小车041.position',
          '小红车042.position',
          'Rectangle37120_(1).position',
          'Rectangle37121_(1).position',
          'Rectangle37122_(1).position',
          'Rectangle37123_(1).position'
        ]
      },
      {
        name: '1104',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子017.position',
          '箱子017.position',
          '组122385.position',
          '移动小车039_(1).position',
          '小红车040_(1).position',
          'Rectangle37034_(1).position',
          'Rectangle37035_(1).position',
          'Rectangle37036_(1).position',
          'Rectangle37037_(1).position'
        ]
      },
      {
        name: '1205',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子016.position',
          '箱子016.position',
          '组122372.position',
          '移动小车038_(1).position',
          '小红车039_(1).position',
          'Rectangle36987_(1).position',
          'Rectangle36988_(1).position',
          'Rectangle36989_(1).position',
          'Rectangle36990_(1).position'
        ]
      },
      {
        name: '1103',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子015.position',
          '箱子015.position',
          '组122353.position',
          '移动小车037_(1).position',
          '小红车038_(1).position',
          'Rectangle36906_(1).position',
          'Rectangle36907_(1).position',
          'Rectangle36908_(1).position',
          'Rectangle36909_(1).position'
        ]
      },
      {
        name: '1204',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子014.position',
          '箱子014.position',
          '组122340.position',
          '移动小车039.position',
          '小红车040.position',
          'Rectangle36859_(1).position',
          'Rectangle36860_(1).position',
          'Rectangle36861_(1).position',
          'Rectangle36862_(1).position'
        ]
      },
      {
        name: '1202',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子013.position',
          '箱子013.position',
          '组122333.position',
          '移动小车038.position',
          '小红车039.position',
          'Rectangle36812_(1).position',
          'Rectangle36813_(1).position',
          'Rectangle36814_(1).position',
          'Rectangle36815_(1).position'
        ]
      },
      {
        name: '1101',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子012.position',
          '箱子012.position',
          '移动小车037.position',
          '小红车038.position',
          'Rectangle36774_(1).position',
          'Rectangle36775_(1).position',
          'Rectangle36776_(1).position',
          'Rectangle36777_(1).position',
          '组122320.position'
        ]
      },
      {
        name: '1201',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子011.position',
          '箱子011.position',
          '移动小车033.position',
          '小红车034.position',
          'Rectangle36710_(1).position',
          'Rectangle36711_(1).position',
          'Rectangle36712_(1).position',
          'Rectangle36713_(1).position',
          '组122313.position'
        ]
      },
      {
        name: 'huojia10',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子010.position',
          '箱子010_(1).position',
          '移动小车032.position',
          '小红车033.position',
          'Rectangle36663_(1).position',
          'Rectangle36664_(1).position',
          'Rectangle36665_(1).position',
          'Rectangle36666_(1).position',
          '组122294.position'
        ]
      },
      {
        name: 'huojia11',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子009.position',
          '箱子009_(1).position',
          '移动小车031.position',
          '小红车032.position',
          'Rectangle37139.position',
          'Rectangle37140.position',
          'Rectangle37141.position',
          'Rectangle37142.position',
          '组122287.position'
        ]
      },
      {
        name: 'huojia12',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子008.position',
          '箱子008_(1).position',
          '移动小车030.position',
          '小红车031.position',
          'Rectangle37092.position',
          'Rectangle37093.position',
          'Rectangle37094.position',
          'Rectangle37095.position',
          '组122268.position'
        ]
      },
      {
        name: 'huojia13',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子007.position',
          '箱子010.position',
          '组122255.position',
          '移动小车029.position',
          '小红车030.position',
          'Rectangle37062.position',
          'Rectangle37063.position',
          'Rectangle37064.position',
          'Rectangle37065.position'
        ]
      },
      {
        name: 'huojia14',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子006.position',
          '箱子009.position',
          '组122242.position',
          '移动小车028.position',
          '小红车029.position',
          'Rectangle37015.position',
          'Rectangle37016.position',
          'Rectangle37017.position',
          'Rectangle37018.position'
        ]
      },
      {
        name: 'huojia15',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '移动小车027.position',
          '小红车028.position',
          'Rectangle36959.position',
          'Rectangle36960.position',
          'Rectangle36961.position',
          'Rectangle36962.position',
          '运动的箱子005.position',
          '箱子008.position',
          '组122229.position'
        ]
      },
      {
        name: 'huojia16',
        time: 0,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子004.position',
          '箱子011_(1).position',
          '组000122222.position',
          '移动小车024.position',
          '小红车025.position',
          'Rectangle34914.position',
          'Rectangle34915.position',
          'Rectangle34916.position',
          'Rectangle34917.position'
        ]
      },
      ////
      {
        name: '1225',
        time: 6,
        duration: 20,
        timeout: 40,
        tracks: [
          ...jgd,
          '箱子023.position',
          '移动小车042.position',
          '小红车043.position',
          'Rectangle37222.position',
          'Rectangle37223.position',
          'Rectangle37224.position',
          'Rectangle37225.position'
        ]
      },
      {
        name: '1224',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子019.position',
          '箱子019.position',
          '组122411.position',
          '移动小车041.position',
          '小红车042.position',
          'Rectangle37120_(1).position',
          'Rectangle37121_(1).position',
          'Rectangle37122_(1).position',
          'Rectangle37123_(1).position'
        ]
      },
      {
        name: '1125',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子017.position',
          '箱子017.position',
          '组122385.position',
          '移动小车039_(1).position',
          '小红车040_(1).position',
          'Rectangle37034_(1).position',
          'Rectangle37035_(1).position',
          'Rectangle37036_(1).position',
          'Rectangle37037_(1).position'
        ]
      },
      {
        name: '1223',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子016.position',
          '箱子016.position',
          '组122372.position',
          '移动小车038_(1).position',
          '小红车039_(1).position',
          'Rectangle36987_(1).position',
          'Rectangle36988_(1).position',
          'Rectangle36989_(1).position',
          'Rectangle36990_(1).position'
        ]
      },
      {
        name: '1124',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子015.position',
          '箱子015.position',
          '组122353.position',
          '移动小车037_(1).position',
          '小红车038_(1).position',
          'Rectangle36906_(1).position',
          'Rectangle36907_(1).position',
          'Rectangle36908_(1).position',
          'Rectangle36909_(1).position'
        ]
      },
      {
        name: '1123',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子014.position',
          '箱子014.position',
          '组122340.position',
          '移动小车039.position',
          '小红车040.position',
          'Rectangle36859_(1).position',
          'Rectangle36860_(1).position',
          'Rectangle36861_(1).position',
          'Rectangle36862_(1).position'
        ]
      },
      {
        name: '1222',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子013.position',
          '箱子013.position',
          '组122333.position',
          '移动小车038.position',
          '小红车039.position',
          'Rectangle36812_(1).position',
          'Rectangle36813_(1).position',
          'Rectangle36814_(1).position',
          'Rectangle36815_(1).position'
        ]
      },
      {
        name: '1122',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子012.position',
          '箱子012.position',
          '移动小车037.position',
          '小红车038.position',
          'Rectangle36774_(1).position',
          'Rectangle36775_(1).position',
          'Rectangle36776_(1).position',
          'Rectangle36777_(1).position',
          '组122320.position'
        ]
      },
      {
        name: '1121',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子011.position',
          '箱子011.position',
          '移动小车033.position',
          '小红车034.position',
          'Rectangle36710_(1).position',
          'Rectangle36711_(1).position',
          'Rectangle36712_(1).position',
          'Rectangle36713_(1).position',
          '组122313.position'
        ]
      },
      {
        name: '1221',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子010.position',
          '箱子010_(1).position',
          '移动小车032.position',
          '小红车033.position',
          'Rectangle36663_(1).position',
          'Rectangle36664_(1).position',
          'Rectangle36665_(1).position',
          'Rectangle36666_(1).position',
          '组122294.position'
        ]
      },
      {
        name: 'huojia11_chu',
        time: 6,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子009.position',
          '箱子009_(1).position',
          '移动小车031.position',
          '小红车032.position',
          'Rectangle37139.position',
          'Rectangle37140.position',
          'Rectangle37141.position',
          'Rectangle37142.position',
          '组122287.position'
        ]
      },
      {
        name: 'huojia12_chu',
        time: 7,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子008.position',
          '箱子008_(1).position',
          '移动小车030.position',
          '小红车031.position',
          'Rectangle37092.position',
          'Rectangle37093.position',
          'Rectangle37094.position',
          'Rectangle37095.position',
          '组122268.position'
        ]
      },
      {
        name: 'huojia13_chu',
        time: 7,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子007.position',
          '箱子010.position',
          '组122255.position',
          '移动小车029.position',
          '小红车030.position',
          'Rectangle37062.position',
          'Rectangle37063.position',
          'Rectangle37064.position',
          'Rectangle37065.position'
        ]
      },
      {
        name: 'huojia14_chu',
        time: 7,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子006.position',
          '箱子009.position',
          '组122242.position',
          '移动小车028.position',
          '小红车029.position',
          'Rectangle37015.position',
          'Rectangle37016.position',
          'Rectangle37017.position',
          'Rectangle37018.position'
        ]
      },
      {
        name: 'huojia15_chu',
        time: 7,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '移动小车027.position',
          '小红车028.position',
          'Rectangle36959.position',
          'Rectangle36960.position',
          'Rectangle36961.position',
          'Rectangle36962.position',
          '运动的箱子005.position',
          '箱子008.position',
          '组122229.position'
        ]
      },
      {
        name: 'huojia16_chu',
        time: 7,
        duration: 20,
        timeout: 48,
        tracks: [
          ...jgd,
          '运动的箱子004.position',
          '箱子011_(1).position',
          '组000122222.position',
          '移动小车024.position',
          '小红车025.position',
          'Rectangle34914.position',
          'Rectangle34915.position',
          'Rectangle34916.position',
          'Rectangle34917.position'
        ]
      }
    ]
    for (let item of animas) {
      const duration = item.duration //动画源时长 秒
      const tracks = this.findTracks(item.tracks)
      let clip = new AnimationClip(item.name, duration, tracks)
      //创建控制器
      let action = this.mixer.clipAction(clip)
      action.initTime = item.time
      action.initTimeout = item.timeout
      action.initModel = item.model
      if (action.initModel) {
        //默认隐藏 播放时才显示箱子
        let fm = this.findModel(this.object3d, 'name', action.initModel)
        fm.visible = false
      }
      action.setDuration(180)
      action.time = item.time
      action.paused = true
      this.actions[item.name] = action
    }
  },
  animeRun(name) {
    let action = this.actions[name]
    if (action) {
      if (!action.paused) return
      action.time = action.initTime
      action.paused = false
      action.play()
      let fm = null
      if (action.initModel) {
        fm = this.findModel(this.object3d, 'name', action.initModel)
        fm.visible = true
      }
      if (action.initTimeout) {
        setTimeout(() => {
          action.paused = true
          if (fm) fm.visible = false
        }, action.initTimeout * 1000)
      }
    }
  },
  //以下为成品链动画
  //升降机1动画   time
  lifter1() {
    let action = null
    if (this.actions.lifter1) {
      action = this.actions.lifter1
    } else {
      const duration = 10 //动画源时长 秒
      const tracks = this.findTracks([
        'Rectangle37272.position',
        '对象70559.position',
        'Rectangle37276.position',
        '对象70560.position',
        '对象70560.quaternion',
        '组122482.quaternion',
        '组122484.position',
        '组122488.position',
        '组122489.position',
        '组122490.position',
        '组122492.position',
        '组122493.position',
        '组122494.position',
        '组122496.position',
        '组122497.quaternion',
        '组122498.position',
        '组122498.quaternion'
      ])
      let clip = new AnimationClip('lifter1', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(100)
      this.actions['lifter1'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.reset()
      action.paused = true
    }, 25 * 1000)
  },
  //升降机2动画   time
  lifter2() {
    let action = null
    if (this.actions.lifter2) {
      action = this.actions.lifter2
    } else {
      const duration = 9.4 //动画源时长 秒
      const tracks = this.findTracks([
        'Rectangle27730.position',
        '对象70542.position',
        'Rectangle27731.position',
        '对象70551.position',
        '对象70551.quaternion',
        '组39037.quaternion',
        '组39047.position',
        '组122464.position',
        '组122465.position',
        '组122466.position',
        '组39043.position',
        '组122468.position',
        '组122469.position',
        '组122470.position',
        '组122471.quaternion',
        '组122472.position',
        '组122472.quaternion'
      ])
      let clip = new AnimationClip('lifter2', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(100)
      this.actions['lifter2'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.reset()
      action.paused = true
    }, 25 * 1000)
  },
  //升降机3动画   time
  lifter3() {
    let action = null
    if (this.actions.lifter3) {
      action = this.actions.lifter3
    } else {
      const duration = 3.4 //动画源时长 秒
      const tracks = this.findTracks([
        'Rectangle37372.position',
        '对象70561.position',
        'Rectangle37376.position',
        '对象70562.position',
        '对象70562.quaternion',
        '组122503.quaternion',
        '组122505.position',
        '组122509.position',
        '组122510.position',
        '组122511.position',
        '组122513.position',
        '组122514.position',
        '组122515.position',
        '组122517.position',
        '组122518.quaternion',
        '组122519.position',
        '组122519.quaternion'
      ])
      let clip = new AnimationClip('lifter3', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(100)
      this.actions['lifter3'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.reset()
      action.paused = true
    }, 25 * 1000)
  },
  //打包机1
  baler1() {
    let action = null
    if (this.actions.baler1) {
      action = this.actions.baler1
    } else {
      const duration = 15 //动画源时长 秒
      const tracks = this.findTracks([
        '组38749.position',
        'Arc001.quaternion',
        'Circle012.quaternion',
        'Circle009_(1).quaternion',
        '组043.position',
        '对象70491.position'
      ])
      let clip = new AnimationClip('baler1', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(50)
      this.actions['baler1'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.paused = true
    }, 10 * 1000)
  },
  //打包机2
  baler2() {
    let action = null
    if (this.actions.baler2) {
      action = this.actions.baler2
    } else {
      const duration = 3.4 //动画源时长 秒
      const tracks = this.findTracks([
        '对象70520.position',
        'Circle021.quaternion',
        'Circle022.quaternion',
        'Arc003.quaternion',
        '组39070.position',
        '组39587.position'
      ])
      let clip = new AnimationClip('baler2', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(50)
      this.actions['baler2'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.paused = true
    }, 10 * 1000)
  },
  //打包机3
  baler3() {
    let action = null
    if (this.actions.baler3) {
      action = this.actions.baler3
    } else {
      const duration = 3.4 //动画源时长 秒
      const tracks = this.findTracks([
        'Circle027.quaternion',
        'Circle028.quaternion',
        'Arc004.quaternion',
        '组122529.position',
        '组122534.position',
        '对象70563.position'
      ])
      let clip = new AnimationClip('baler3', duration, tracks)
      //创建控制器
      action = this.mixer.clipAction(clip)
      action.setDuration(50)
      this.actions['baler3'] = action
      action.paused = true
    }
    if (!action.paused) return // 播放中 则退出
    action.paused = false
    action.reset()
    action.play()
    setTimeout(() => {
      action.paused = true
    }, 10 * 1000)
  },
  //以下为悬挂链
  setRackModel() {
    this.racks = {
      lift1: {
        rack: 'shengjiangjizuhe02',
        frameLeft: 'Group2137',
        frameRight: 'Group2133',
        Heih: 7,
        Low: 2,
        Status: '',
        LoadedCode: ''
      },
      lift2: {
        rack: 'Group1911',
        frameLeft: 'Group1075',
        frameRight: 'Group1068',
        Heih: 4,
        Low: -1.2,
        Status: '',
        LoadedCode: ''
      },
      lift3: {
        rack: 'Group1945',
        frameLeft: 'Group1942',
        frameRight: 'Group1947',
        Heih: 8,
        Low: -1,
        Status: '',
        LoadedCode: ''
      },
      lift4: {
        rack: 'Group1959',
        frameLeft: 'Group1956',
        frameRight: 'Group1952',
        Heih: 7.5,
        Low: -1,
        Status: '',
        LoadedCode: ''
      },
      lift5: {
        rack: 'Group2051',
        frameLeft: 'Group2056',
        frameRight: 'Group2052',
        Heih: 8,
        Low: -1,
        Status: '',
        LoadedCode: ''
      },
      lift6: {
        rack: 'Group2083',
        frameLeft: 'Group2088',
        frameRight: 'Group2084',
        Heih: 8,
        Low: -1,
        Status: '',
        LoadedCode: ''
      },
      lift7: {
        rack: '组39538',
        frameLeft: 'Group2028',
        frameRight: 'Group2024',
        Heih: 7.5,
        Low: 2,
        Status: '',
        LoadedCode: ''
      },
      lift8: {
        rack: 'shengjiangjizuhe01',
        frameLeft: 'Group2121', //-2.4
        frameRight: 'Group2124', //-0.9
        Heih: 8,
        Low: 1.8,
        Status: '',
        LoadedCode: ''
      },
      lift9: {
        rack: '组39539',
        frameLeft: 'Group1982',
        frameRight: 'Group1978',
        Heih: 7.5,
        Low: 2,
        Status: '',
        LoadedCode: ''
      },
      lift10: {
        rack: '组39540',
        frameLeft: 'Group1971',
        frameRight: 'Group1967',
        Heih: 7.5,
        Low: 2,
        Status: '',
        LoadedCode: ''
      }
    }
  },
  //升降机执行操作
  liftRun(prop, msg) {
    if (!this.racks[prop]) return
    if (this.racks[prop].Status != msg.Status) {
      // 状态更换
      let rack_y = null
      if (msg.Status == 'High') {
        rack_y = this.racks[prop].Heih
      } else if (msg.Status == 'Low') {
        rack_y = this.racks[prop].Low
      }
      //拿出模型
      let rack = this.findModel(this.object3d, 'name', this.racks[prop].rack)
      //执行动画
      this.transitionPosition(rack, {
        y: rack_y
      })
      this.racks[prop].Status = msg.Status
    }
    if (msg.LoadedCode && this.racks[prop].LoadedCode != msg.LoadedCode) {
      // 设备运行状态更换
      let load = msg.LoadedCode.split(',')
      let left = this.findModel(this.object3d, 'name', this.racks[prop].frameLeft)
      let right = this.findModel(this.object3d, 'name', this.racks[prop].frameRight)
      if (!left || !right) {
        return
      }
      this.togglerVisible(left, load[0] != '0')
      this.togglerVisible(right, load[1] != '0')
    }
  }
}
export default clipActions
