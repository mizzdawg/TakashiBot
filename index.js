// Define variables
const canvas = document.querySelector('#canvas');
const bannerCanvas = document.querySelector('#banner-canvas');
const container = document.querySelector('#canvas-container');
const chooseColor = document.querySelector('#chooseColor');
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

// Object containing different color palettes available in HTML select element - remember to add as option there
const colorPalettes = {
    rainbow: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#E6E6FA', '#DA70D6', '#AAFF00', '#ef476f', '#ffd166', '#31572c', '#118ab2', '#073b4c', '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#540d6e', '#ee4266', '#3bceac', '#0ead69', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'],
    red: ['#f9e5e5', '#efb2b2', '#e57f7f', '#db4c4c', '#d63232', '#d11919', '#cc0000', '#b70000', '#8e0000', '#660000'],
    orange: ['#ff4800', '#ff5400', '#ff6000', '#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#ffaa00', '#ffb600'],
    yellow: ['#fff3d1', '#ffe8a3', '#ffdc75', '#ffd147', '#ffcb30', '#ffc61a', '#ffd75e', '#e5b217', '#cc9e14', '#b28a12'],
    blue: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'],
    green: ['#e8f3e8', '#bcdcbc', '#90c590', '#64ad64', '#389638', '#228b22', '#1e7d1e', '#389638', '#176117', '#114511'],
    purple: ['#f0eaf5', '#d2c1e2', '#b498cf', '#966fbb', '#875ab2', '#7846a8', '#6a329f', '#5f2d8f', '#4a236f', '#35194f'],
    pink: ['#ff0a54', '#ff477e', '#ff5c8a', '#ff7096', '#ff85a1', '#ff99ac', '#fbb1bd', '#f9bec7', '#f7cad0', '#fae0e4'],
    newBalance: ['#f2f2f2', '#cccccc', '#a5a5a5', '#7f7f7f', '#595959', '#eae0d5', '#c6ac8f', '#cebebe', '#ece2d0', '#d5b9b2', '#e21836']
}
// arrays containing data used to adjust size and placement of flowers
const flowerSizes = [.15, 0.2, .25, 0.3];
const coordRandomizer = [0, -5, 5, -6, 6, -7, 7, -8, 8, -9, 9, -10, 10, -20, 20, -30, 30];


// Set default value to rainbow palette
let palette = colorPalettes.rainbow;

// Set viewBox
bannerCanvas.setAttribute('viewBox', `0 0 ${viewBoxW} ${viewBoxH}`);
canvas.setAttribute('viewBox', `0 0 ${viewBoxW} ${viewBoxH}`);

// Center placeholder flower in middle of canvas
const placeholderSize = placeholder.getBBox();
placeholder.setAttribute('transform', `translate(${(viewBoxW / 2) - (placeholderSize.width / 2)}, ${(viewBoxH / 2) - (placeholderSize.height / 2)})`);

// Chooses a random item in an array using Math object methods
function randomChoice(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    const choice = arr[idx];
    return choice;
}

// Clears given element's child elements
function clear(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

// Creates flower body by generating 
function createCircle(cx, cy, r, strokeWidth, svg) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', randomChoice(palette));
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(circle);
}


// Generates coordinates to draw two straight lines from edge of cirlce and a Bezier curve to connect them, forming a petal
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

// Draw flower mouth by creating path elements, setting attributes and appending them to canvas
function drawMouth(x, y, r, svg) {
    const bottom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const top = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const color = randomChoice(palette);
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


// Draw flower eyes
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

// Draw lines for petals and append them to the canvas
function drawPetals(ix1, iy1, ix2, iy2, mx1, my1, mx2, my2, ox1, oy1, ox2, oy2, svg, color) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${ix1} ${iy1} L ${mx1} ${my1} C ${ox1} ${oy1}, ${ox2} ${oy2}, ${mx2} ${my2} L ${ix2} ${iy2}`);
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', color);
    svg.appendChild(path);
}

function drawFlower(x, y, scale, el) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    petalPoints(160, 160);
    const petalColor = randomChoice(palette);
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

// Generates coords to place flowers across grid then places flowers on those coords
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

// Handle button click
button.addEventListener('click', () => {
    clear(canvas);
    placeFlowers(canvas);
});

// Handle Select value change
chooseColor.addEventListener('change', function () {
    palette = colorPalettes[this.value];
});


// Generate banner on top of page
placeFlowers(bannerCanvas);


