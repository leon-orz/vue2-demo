export default function ({el}) {
	const downEl = el;
	if (!downEl.style.transform) {
		downEl.style.transform = " translateX(0px) translateY(0px)";
	}
	el.onmousedown = function () {
        let scale
        if(downEl.style.transform) {
            const values = downEl.style.transform.split(' ')
            values.forEach((value) => {
                if (value.indexOf('scale') !== -1) {
                    scale = parseFloat(value.replace('scale(', '').replace(')', ''))
                }
            })
        }
		document.onmousemove = function (e) {
			if (downEl) {
				let x = 0;
				let y = 0;
				let newTransform = "";
				let transform = "";
				if (downEl.style.transform) {
					transform = downEl.style.transform;
				}

				// 默认填充
				if (transform.indexOf("translateX") === -1) {
					transform += " translateX(0px) ";
				}
				if (transform.indexOf("translateY") === -1) {
					transform += " translateY(0px) ";
				}

				// start
				const values = transform.split(" ");
				values.forEach((value) => {
					if (value.indexOf("translateX") !== -1) {
						x = parseInt(value.replace("translateX(", "").replace("px)", "")) + e.movementX / scale;
						newTransform += `translateX(${x}px) `;
					} else if (value.indexOf("translateY") !== -1) {
						y = parseInt(value.replace("translateY(", "").replace("px)", "")) + e.movementY / scale;
						newTransform += `translateY(${y}px) `;
					} else {
						newTransform += value + " ";
					}
				});
				downEl.style.transform = newTransform;
			}
		};
		document.onmouseup = function () {
			document.onmousemove = document.onmouseup = null;
		};
	};
}
