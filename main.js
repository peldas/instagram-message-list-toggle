// ==UserScript==
// @name        Instagram Message List Toggle
// @namespace   Violentmonkey Scripts
// @match       *://www.instagram.com/*
// @grant       none
// @version     1.1
// @author      peldas
// @description 2024/7/16 17:50:00
// @inject-into auto
// ==/UserScript==
var svg;
function toggleMessageList() {
  console.log('trying to toggle...;')
  messageList = document.querySelector('div[role="navigation"]');

  if (messageList.style.display === 'none') {
    messageList.style.display = 'revert';
    svg.setAttribute('style', 'transform: rotate(90deg)');
  } else {
    messageList.style.display = 'none';
    svg.setAttribute('style', 'transform: rotate(270deg)');
  }
}

function injectSVG() {
  var a = document.createElement('a');
  a.onclick = function() { toggleMessageList(); };
  a.setAttribute('style', 'display:block;padding:0px 25px 0px 10px;');
  a.setAttribute('role', 'messagelisthide');

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('height', '20');
  svg.setAttribute('role', 'img');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('style', 'transform: rotate(90deg)');

  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 15.087l8.293-8.296a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293Z');

  svg.appendChild(path);
  a.appendChild(svg);

  var headerdiv = document.querySelector('div[role="main"]').children[0].children[0].children[0].children[0].children[0];
  headerdiv.insertBefore(a, headerdiv.children[0]);
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var messageWindow = document.querySelector('div[role="main"]');
    var listHideButton = document.querySelector('a[role="messagelisthide"]');

    if (mutation.type !== 'childList') // only attempt to inject if the page has changed
      return;

    if (!messageWindow) // no need to inject if message window isn't visible
      return;

    if (listHideButton) // no need to inject if already injected
      return;

    injectSVG();
  });
});

observer.observe(document.body, { subtree: true, childList: true });