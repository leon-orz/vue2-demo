export let lockedModel = null;
let clikTimer = null;
let lockSpeed = 1;
let mqttDevices = new Map();
//可点击mesh
let allowClickCube = [
	// name:设备编号,lock:是否可被锁定
	//成品
	{ name: "TS1015", lock: true },
	{ name: "TS2015", lock: true },
	{ name: "TS3015", lock: true },
	{ name: "TS4001", lock: true },
	{ name: "PKG1", lock: true },
	{ name: "PKG2", lock: true },
	{ name: "PKG3", lock: true },
	//悬挂链
	{ name: "lift1", lock: true },
	{ name: "lift2", lock: true },
	{ name: "lift3", lock: true },
	{ name: "lift4", lock: true },
	{ name: "lift5", lock: true },
	{ name: "lift6", lock: true },
	{ name: "lift7", lock: true },
	{ name: "lift8", lock: true },
	{ name: "lift9", lock: true },
	//立体仓库
	{ name: "DDJ1", lock: false },
	{ name: "DDJ2", lock: false },
	{ name: "DDJ3", lock: false },
	{ name: "DDJ4", lock: false },
	{ name: "DDJ5", lock: false },
	{ name: "DDJ6", lock: false },
	{ name: "DDJ7", lock: false },
	{ name: "DDJ8", lock: false },
	{ name: "DDJ9", lock: false },
	{ name: "DDJ0", lock: false },
	{ name: "DDJ11", lock: false },
	{ name: "DDJ12", lock: false },
	{ name: "DDJ13", lock: false },
	{ name: "DDJ14", lock: false },
	{ name: "DDJ15", lock: false },
	{ name: "DDJ16", lock: false },
	{ name: "1211", lock: true },
	{ name: "1301", lock: true },
	{ name: "1212", lock: true },
	{ name: "1302", lock: true },
	{ name: "1213", lock: true },
	{ name: "1303", lock: true },
	//AGV之类
	{ name: "agv_", lock: true },
];

function clearTimer() {
	if (clikTimer) {
		clearTimeout(clikTimer);
		clikTimer = null;
	}
}
//显示设备详情弹框
function openDeviceDetailDLG(intersects) {
	let meshs = filterAllowIntersects(intersects, false);
	if (meshs) {
		let data = [];
		for (let item of meshs) {
			data.push(mqttDevices.get(item.name));
		}
        data = data.filter(i=>i);
		renderDialog(data);
	}
}
function renderDialog(data) {
    closeBox();
	createBox();
	function createBox() {
		let div = document.createElement("div");
		div.id = "dlgMsgWarp";
		//关闭按钮
		let closeBtn = document.createElement("button");
		closeBtn.innerHTML = `<el-icon class="el-icon-close"></el-icon>`;
		closeBtn.onclick = function() {
			closeBox(div);
		};
		div.append(closeBtn);
		//内容
		let ihtml = "";
		if (data) {
			data.forEach((item) => {
				let col = "";
				if (item.topic.url == "fgconveyor") {
					//成品链
					const labelWidth = 80;
					const statusMap = [
						{ label: "高位", key: "high" },
						{ label: "下降", key: "down" },
						{ label: "低位", key: "low" },
						{ label: "上升", key: "up" },
						{ label: "异常", key: "err" },
						{ label: "打包中", key: "work1" },
						{ label: "闲置", key: "idle" },
					];
					col += `
                        <div class="label">
                            <i class="i-label-icon el-icon-receiving"></i>
                            <span style="width:${labelWidth}px">设备编号:</span> ${item.topic.prop}
                            <b>${item.TimeStamp}</b>
                        </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">负载数量:</span> ${item.Loaded}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">货物编号:</span> ${item.LoadedCode || "无货物"}</div>`;
					col += `<div class="item" style="color:${item.Fault == "true" ? "red" : ""}">
                                <span style="width:${labelWidth}px;">是否故障:</span> 
                                ${item.Fault == "true" ? "故障" : "无故障"}
                            </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">设备状态:</span> ${keyMap(statusMap, item.Status)}</div>`;
					item.Mode && (col += `<div class="item"><span style="width:${labelWidth}px">设备模式:</span> ${item.Mode == "auto" ? "自动" : "手动"}</div>`);
				} else if (item.topic.url == "suspendchain") {
					//悬挂链
					const labelWidth = 80;
					const statusMap = [
						{ label: "高位", key: "High" },
						{ label: "低位", key: "Low" },
						{ label: "上升", key: "Up" },
						{ label: "下降", key: "Down" },
					];
					col += `
                        <div class="label">
                            <i class="i-label-icon el-icon-receiving"></i>
                            <span style="width:${labelWidth}px">设备编号:</span> ${item.topic.prop}
                            <b>${item.TimeStamp}</b>
                        </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">负载数量:</span> ${item.Loaded}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">货物编号:</span> ${item.LoadedCode || "无货物"}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">设备状态:</span> ${keyMap(statusMap, item.Status)}</div>`;
				} else if (item.topic.url == "jsagv") {
					//冲压AGV
					const labelWidth = 90;
					const statusMap = [
						{ label: "充电中", key: "Charging" },
						{ label: "关机", key: "Offline" },
						{ label: "运行", key: "Run" },
						{ label: "闲置", key: "Idle" },
						{ label: "忙碌", key: "Busy" },
						{ label: "异常", key: "Error" },
						{ label: "停止", key: "Stop" },
					];
					col += `
                        <div class="label">
                            <i class="i-label-icon el-icon-receiving"></i>
                            <span style="width:${labelWidth}px">AGV编号:</span> ${item.topic.dev}
                            <b>${item.TimeStamp}</b>
                        </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">车型:</span> ${item.Model}</div>`;
					col += `<div class="item" style="color:${item.Status == "Error" ? "red" : ""}">
                                <span style="width:${labelWidth}px">设备状态:</span> 
                                ${keyMap(statusMap, item.Status)}
                            </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">小时吞量:</span> ${item.QtyHrIn}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px"> 小时吐量:</span> ${item.QtyHrOut}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">小时吞吐:</span> ${item.QtyHrTotal}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">当前容量:</span> ${item.QtyCache}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">容量下限:</span> ${item.QtyCacheMin}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">容量上限:</span> ${item.QtyCacheMax}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">状态消息:</span> ${item.Message}</div>`;
				} else if (item.topic.url == "hikagv") {
					//装配AGV
					const labelWidth = 90;
					const statusMap = [
						{ label: "充电中", key: "Charging" },
						{ label: "关机", key: "Offline" },
						{ label: "运行", key: "Run" },
						{ label: "闲置", key: "Idle" },
						{ label: "忙碌", key: "Busy" },
						{ label: "异常", key: "Error" },
						{ label: "停止", key: "Stop" },
					];
					col += `
                        <div class="label">
                            <i class="i-label-icon el-icon-receiving"></i>
                            <span style="width:${labelWidth}px">AGV编号:</span> ${item.topic.dev}
                            <b>${item.TimeStamp}</b>
                        </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">车型:</span> ${item.Model}</div>`;
					col += `<div class="item" style="color:${item.Status == "Error" ? "red" : ""}">
                                <span style="width:${labelWidth}px">设备状态:</span> 
                                ${keyMap(statusMap, item.Status)}
                            </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">小时吞量:</span> ${item.QtyHrIn}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">小时吐量:</span> ${item.QtyHrOut}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">小时吞吐:</span> ${item.QtyHrTotal}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">当前容量:</span> ${item.QtyCache}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">容量下限:</span> ${item.QtyCacheMin}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">容量上限:</span> ${item.QtyCacheMax}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">状态消息:</span> ${item.Message}</div>`;
				} else if (item.topic.url == "asrs") {
                    //立体仓库
					const labelWidth = 80;
					const statusMap = [
						{ label: "静止", key: "idle" },
						{ label: "正转", key: "FWD" },
						{ label: "反转", key: "BWD" },
					];
					col += `
                        <div class="label">
                            <i class="i-label-icon el-icon-receiving"></i>
                            <span style="width:${labelWidth}px">设备编号:</span> ${item.topic.prop}
                            <b>${item.TimeStamp}</b>
                        </div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">负载数量:</span> ${item.Loaded}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">货物编号:</span> ${item.LoadedCode || "无货物"}</div>`;
					col += `<div class="item"><span style="width:${labelWidth}px">设备状态:</span> ${keyMap(statusMap, item.Status)}</div>`;

                }

				ihtml += `<div class="row">${col}</div>`;
			});
		}
		let warp = document.createElement("div");
		warp.classList.add("row-warp");
		warp.innerHTML = ihtml;
		div.append(warp);

		//加到app中
		let app = document.getElementById("app");
		app.append(div);
	}
}
function closeBox(box) {
    if(!box){
        let msgBox = document.getElementById("dlgMsgWarp");
        if (msgBox) {
            //移除现有的
            msgBox.classList.add("dlg-close");
            setTimeout(() => {
                msgBox.remove();
            }, 200);
        }
    }else{
        box.classList.add("dlg-close");
        setTimeout(() => {
            box.remove();
        }, 200);
    }
}
//锁定设备视角
function lockDevice(intersects) {
	let meshs = filterAllowIntersects(intersects, true);
	if (meshs) {
		//锁定第一个
		if (meshs[0].lockParent) {
			//有些需要取上一层parent的模型位置
			lockedModel = meshs[0].parent;
		} else {
			lockedModel = meshs[0];
		}
		lockSpeed = 2;
		if (lockedModel.name.indexOf("agv") != -1) {
			setTimeout(() => {
				lockSpeed = 0.2;
			}, 10 * 1000);
		}
	}
}
//过滤不被允许的网格模型
function filterAllowIntersects(intersects, lock) {
	let leftInter = [];
	for (let inter of intersects) {
		for (let i of allowClickCube) {
			if (!lock || i.lock) {
				if (inter.object.name.indexOf(i.name) != -1) {
					leftInter.push(inter.object);
					break;
				}
			}
		}
	}
	return leftInter.length ? leftInter : false;
}
//字典
function keyMap(list, key) {
	let f = list.find((i) => i.key == key);
	if (f) {
		return f.label;
	} else {
		return key;
	}
}

//存储设备信息
export function setDeviceInfo(topic, msg) {
	msg = { ...msg, topic: topic };
	if (topic.url === "jsagv") {
		//AGV
		//agv坐标信号和那个不存 没必要
		if (topic.prop === "pos" || topic.prop === "chain") {
			return;
		}
		mqttDevices.set("agv_" + topic.dev, Object.assign(mqttDevices.get("agv_" + topic.dev) || {}, msg));
	} else if (topic.url === "hikagv") {
		//AGV
		//agv坐标信号和那个不存 没必要
		if (topic.prop === "pos" || topic.prop === "pallet") {
			return;
		}
		mqttDevices.set("agv_" + topic.dev, Object.assign(mqttDevices.get("agv_" + topic.dev) || {}, msg));
	} else if (topic.url === "asrs" && topic.type === "part") {
		//立体仓库
		mqttDevices.set(topic.prop, msg);
	} else if (topic.url === "fgconveyor" && topic.type === "part") {
		//成品链
		mqttDevices.set(topic.prop, msg);
	} else if (topic.url === "suspendchain" && topic.prop.indexOf("lift") != -1) {
		//成品链
		mqttDevices.set(topic.prop, msg);
	}
}
//单击 = 显示详情
export function handleClick(intersects) {
	clearTimer();
	clikTimer = setTimeout(() => {
		openDeviceDetailDLG(intersects);
	}, 500);
}
//双击 = 显示详情 并 锁定设备视角
export function handleDBlClick(intersects) {
	clearTimer();
	lockDevice(intersects);
	openDeviceDetailDLG(intersects);
}

//清除锁定
export function clearLocked() {
	lockedModel = null;
    closeBox()
}

//锁定AGV中 视角更新
export function updatelockedModel(camera, controls) {
	//跟踪agv
	if (lockedModel) {
		let translate = lockedModel.preinstall ? 0 : 20; //是否根据预设位置定位
		if (Math.abs(camera.position.x - (lockedModel.position.x + translate)) > 3) {
			if (camera.position.x < lockedModel.position.x + translate) {
				camera.position.x += lockSpeed;
			} else {
				camera.position.x -= lockSpeed;
			}
		}
		if (Math.abs(camera.position.z - (lockedModel.position.z + translate)) > 3) {
			if (camera.position.z < lockedModel.position.z + translate) {
				camera.position.z += lockSpeed;
			} else {
				camera.position.z -= lockSpeed;
			}
		}
		if (Math.abs(camera.position.y - 30) > 3) {
			if (camera.position.y < 30) {
				camera.position.y += lockSpeed;
			} else {
				camera.position.y -= lockSpeed;
			}
		}
		if (Math.abs(controls.target.x - lockedModel.position.x) > 3) {
			if (controls.target.x < lockedModel.position.x) {
				controls.target.x += lockSpeed;
			} else {
				controls.target.x -= lockSpeed;
			}
		}
		if (Math.abs(controls.target.z - lockedModel.position.z) > 3) {
			if (controls.target.z < lockedModel.position.z) {
				controls.target.z += lockSpeed;
			} else {
				controls.target.z -= lockSpeed;
			}
		}
		if (Math.abs(controls.target.y - lockedModel.position.y) > 3) {
			if (controls.target.y < lockedModel.position.y) {
				controls.target.y += lockSpeed;
			} else {
				controls.target.y -= lockSpeed;
			}
		}
	}
}
