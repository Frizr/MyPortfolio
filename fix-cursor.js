const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');
const jsPath = path.join(__dirname, 'assets', 'js', 'main.js');

let cssContent = fs.readFileSync(cssPath, 'utf8');

// 1. Remove transform from .cursor-follower.hover
cssContent = cssContent.replace(/transform:\s*translate3d\(0,0,0\)\s*scale\(1\.5\)\s*!important;\s*\/\*\s*GPU accelerated scale\s*\*\//g, '');
cssContent = cssContent.replace(/\s*transform:\s*translate3d\(0,0,0\)\s*scale\(1\.5\)\s*!important;\n?/g, ''); // fallback just in case comment format differs

// 2. Remove transition: transform ... from .cursor-follower
cssContent = cssContent.replace(/transition:\s*transform[^,]+,\s*(background-color.*?);/g, 'transition: $1;');
cssContent = cssContent.replace(/transition:\s*transform[^,]+;/g, ''); 

fs.writeFileSync(cssPath, cssContent);

let jsContent = fs.readFileSync(jsPath, 'utf8');

// 3. Modifying JS loop
const originalVars = `        let followerX = mouseX;
        let followerY = mouseY;`;
const newVars = `        let followerX = mouseX;
        let followerY = mouseY;
        let targetScale = 1;
        let currentScale = 1;`;
jsContent = jsContent.replace(originalVars, newVars);

const originalAnimate = `        function animateCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.transform = \`translate3d(\${followerX}px, \${followerY}px, 0)\`;
            requestAnimationFrame(animateCursor);
        }`;
const newAnimate = `        function animateCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            currentScale += (targetScale - currentScale) * 0.15;
            
            cursorFollower.style.transform = \`translate3d(\${followerX}px, \${followerY}px, 0) scale(\${currentScale})\`;
            requestAnimationFrame(animateCursor);
        }`;
jsContent = jsContent.replace(originalAnimate, newAnimate);

const originalListeners = `        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
        });`;
const newListeners = `        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover');
                targetScale = 1.5;
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover');
                targetScale = 1;
            });
        });`;
jsContent = jsContent.replace(originalListeners, newListeners);

fs.writeFileSync(jsPath, jsContent);
console.log('Cursor fix applied successfully!');
