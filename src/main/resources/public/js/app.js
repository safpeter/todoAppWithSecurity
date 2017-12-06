import Controller from './controller.js';
import View from './view.js';

const view = new View();
const controller = new Controller(view);

const setView = () => controller.setView(document.location.hash);
window.addEventListener('load', setView);
window.addEventListener('hashchange', setView);
