const canvas = document.querySelector('#canvas');
const bannerCanvas = document.querySelector('#banner-canvas');
const container = document.querySelector('#canvas-container');
const placeholder = document.querySelector('#placeholder');
const button = document.querySelector('#generate');
const numOfPoints = 12;
const innerRadius = 70;
const middleRadius = 120;
const outerRadius = 185;
const innerPoints = [];
const middlePoints = [];
const outerPoints = [];
const coords = [];
const viewBoxW = 900;
const viewBoxH = 500;

bannerCanvas.setAttribute('viewBox', `0 0 ${viewBoxW} ${viewBoxH}`);
canvas.setAttribute('viewBox', `0 0 ${viewBoxW} ${viewBoxH}`);

const placeholderSize = placeholder.getBBox();
console.log(placeholderSize);
placeholder.setAttribute('transform', `translate(${(viewBoxW / 2) - (placeholderSize.width / 2)}, ${(viewBoxH / 2) - (placeholderSize.height / 2)})`);


const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#E6E6FA', '#DA70D6', '#AAFF00', '#ef476f', '#ffd166', '#31572c', '#118ab2', '#073b4c', '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#540d6e', '#ee4266', '#3bceac', '#0ead69', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
const flowerSizes = [.15, 0.2, .25, 0.3];
const coordRandomizer = [0, -5, 5, -6, 6, -7, 7, -8, 8, -9, 9, -10, 10, -20, 20, -30, 30];


function createCircle(cx, cy, r, strokeWidth, svg) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', randomChoice(colors));
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(circle);
}

function petalPoints(centerX, centerY) {
    const theta = 2.0 * Math.PI / numOfPoints;
    for (let i = 1; i <= numOfPoints; i++) {
        let pointXI = (innerRadius * Math.cos(theta * i) + centerX);
        let pointYI = (innerRadius * Math.sin(theta * i) + centerY);
        let pointXM = (middleRadius * Math.cos(theta * i) + centerX);
        let pointYM = (middleRadius * Math.sin(theta * i) + centerY);
        let pointXO = (outerRadius * Math.cos(theta * i) + centerX);
        let pointYO = (outerRadius * Math.sin(theta * i) + centerY);
        innerPoints.push([pointXI, pointYI]);
        middlePoints.push([pointXM, pointYM]);
        outerPoints.push([pointXO, pointYO]);
    }

    innerPoints.push([innerPoints[0][0], innerPoints[0][1]]);
    middlePoints.push([middlePoints[0][0], middlePoints[0][1]]);
    outerPoints.push([outerPoints[0][0], outerPoints[0][1]]);
}

function drawMouth(x, y, r, svg) {
    const bottom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const top = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const color = randomChoice(colors);
    bottom.setAttribute('d', `M ${x - r} ${y} a ${r} ${r} 0 0 0 ${r * 2} 0`);
    bottom.setAttribute('fill', color);
    bottom.setAttribute('stroke', 'black');
    bottom.setAttribute('stroke-width', '3');
    top.setAttribute('d', `M ${x - r} ${y + 1} C ${x - 20} ${y - 10}, ${x + 20} ${y - 10}, ${x + r} ${y + 1}`);
    top.setAttribute('fill', color);
    top.setAttribute('stroke', 'black');
    top.setAttribute('stroke-width', '3');
    svg.appendChild(bottom);
    svg.appendChild(top);
}

function drawEyes(cx, cy, rx, ry, rotate, color, svg) {
    const eye = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    eye.setAttribute('cx', cx);
    eye.setAttribute('cy', cy);
    eye.setAttribute('rx', rx);
    eye.setAttribute('ry', ry);
    eye.setAttribute('fill', color);
    eye.setAttribute('transform', `rotate(${rotate}, ${cx}, ${cy})`) //45, 225, 220
    svg.appendChild(eye);

}

function drawPetals(ix1, iy1, ix2, iy2, mx1, my1, mx2, my2, ox1, oy1, ox2, oy2, svg, color) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${ix1} ${iy1} L ${mx1} ${my1} C ${ox1} ${oy1}, ${ox2} ${oy2}, ${mx2} ${my2} L ${ix2} ${iy2}`);
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', color);
    svg.appendChild(path);
}

function randomChoice(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    const choice = arr[idx];
    return choice;
}

function clear(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

function placeFlowers(el) {
    const width = viewBoxW;
    const height = viewBoxH;
    const xInc = 55;
    const yInc = 55;
    for (let i = 0; i <= width + xInc; i += xInc) {
        for (let j = 0; j <= height + yInc; j += yInc) {
            let xRand = randomChoice(coordRandomizer);
            let yRand = randomChoice(coordRandomizer);
            coords.push([i + xRand, j + yRand]);
        }
    }

    for (let k = 0; k < coords.length; k++) {
        const flowerSize = randomChoice(flowerSizes);
        const x = coords[k][0];
        const y = coords[k][1];
        drawFlower(x, y, flowerSize, el);
    }
    coords.length = 0;
}

function drawFlower(x, y, scale, el) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    petalPoints(160, 160);
    const petalColor = randomChoice(colors);
    for (let i = 0; i < innerPoints.length - 1; i++) {
        drawPetals(innerPoints[i][0], innerPoints[i][1], innerPoints[i + 1][0], innerPoints[i + 1][1], middlePoints[i][0], middlePoints[i][1], middlePoints[i + 1][0], middlePoints[i + 1][1], outerPoints[i][0], outerPoints[i][1], outerPoints[i + 1][0], outerPoints[i + 1][1], group, petalColor);
    }

    createCircle(160, 160, innerRadius, 3, group);
    drawMouth(160, 160, 50, group);
    drawEyes(135, 130, 7, 10, 45, 'black', group);
    drawEyes(185, 130, 7, 10, -45, 'black', group);
    drawEyes(136, 126.25, 3, 4.5, 45, 'white', group);
    drawEyes(135.5, 134, 2, 3, 45, 'white', group);
    drawEyes(184, 126.25, 3, 4.5, -45, 'white', group);
    drawEyes(184.5, 134, 2, 3, -45, 'white', group);

    group.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);
    el.appendChild(group);

    innerPoints.length = 0;
    middlePoints.length = 0;
    outerPoints.length = 0;
}

// drawFlower(50, 50, .2);
// drawFlower(175, 50, .6);
// drawFlower(50, 175, .55);
// drawFlower(250, 125, .2);
// drawFlower(150, 250, .9);
// drawFlower(750, 250, .5);

//button code to reuse later!!!
button.addEventListener('click', () => {
    clear(canvas);
    placeFlowers(canvas);
})

placeFlowers(bannerCanvas);