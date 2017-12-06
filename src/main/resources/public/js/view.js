import {qs, $delegate, escapeForHTML} from './helpers.js';

const _itemId = element => element.parentNode.dataset.id;
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class View {

	constructor() {
		this.$todoList = qs('.todo-list');
		this.$todoItemCounter = qs('.todo-count');
		this.$clearCompleted = qs('.clear-completed');
		this.$main = qs('.main');
		this.$toggleAll = qs('.toggle-all');
		this.$newTodo = qs('.new-todo');
		$delegate(this.$todoList, 'li label', 'dblclick', ({target}) => {
			this.editItem(target);
		});

        this.$filterAll = document.getElementById("filterAll");
        this.$filterActive = document.getElementById("filterActive");
        this.$filterComplete = document.getElementById("filterCompleted");
	}

    bindFilterAll(handler) {
        this.$filterAll.addEventListener('click', ({target}) => {
            handler('');
        });
    }
    bindFilterActive(handler) {
        this.$filterActive.addEventListener('click', ({target}) => {
            handler('active');
        });
    }
    bindFilterComplete(handler) {
        this.$filterComplete.addEventListener('click', ({target}) => {
            handler('complete');
        });
    }

	/**
	 * Put an item into edit mode.
	 *
	 * @param {!Element} target Target Item's label Element
	 */
	editItem(target) {
		const listItem = target.parentElement;

		listItem.classList.add('editing');

		const input = document.createElement('input');
		input.className = 'edit';

		input.value = target.innerText;
		listItem.appendChild(input);
		input.focus();
	}

	/**
	 * Populate the todolist with a list of items.
	 *
	 * @param items Array of items to display
	 */
	showItems(items) {
		this.$todoList.innerHTML = items.reduce((a, item) => a + `
<li data-id="${item.id}"${item.completed ? ' class="completed"' : ''}>
	<input class="toggle" type="checkbox" ${item.completed ? 'checked' : ''}>
	<label>${escapeForHTML(item.title)}</label>
	<button class="destroy"></button>
</li>`, '');
	}

	/**
	 * Remove an item from the view.
	 *
	 * @param {number} id Item ID of the item to remove
	 */
	removeItem(id) {
		const elem = qs(`[data-id="${id}"]`);

		if (elem) {
			this.$todoList.removeChild(elem);
		}
	}

	/**
	 * Set the number in the 'items left' display.
	 *
	 * @param {number} itemsLeft Number of items left
	 */
	setItemsLeft(itemsLeft) {
		this.$todoItemCounter.innerHTML = `${itemsLeft} item${itemsLeft !== 1 ? 's' : ''} left`;
	}

	/**
	 * Set the visibility of the "Clear completed" button.
	 *
	 * @param {boolean|number} visible Desired visibility of the button
	 */
	setClearCompletedButtonVisibility(visible) {
		this.$clearCompleted.style.display = !!visible ? 'block' : 'none';
	}

	/**
	 * Set the visibility of the main content and footer.
	 *
	 * @param {boolean|number} visible Desired visibility
	 */
	setMainVisibility(visible) {
		this.$main.style.display = !!visible ? 'block' : 'none';
	}

	/**
	 * Set the checked state of the Complete All checkbox.
	 *
	 * @param {boolean|number} checked The desired checked state
	 */
	setCompleteAllCheckbox(checked) {
		this.$toggleAll.checked = !!checked;
	}

	/**
	 * Change the appearance of the filter buttons based on the route.
	 *
	 * @param {string} route The current route
	 */
	updateFilterButtons(route) {
	    // TODO wrong now
		//qs('.filters>.selected').className = '';
		//qs(`.filters>[href="#/${route}"]`).className = 'selected';
	}

	/**
	 * Clear the new item input
	 */
	clearNewTodo() {
		this.$newTodo.value = '';
	}

	/**
	 * Render an item as either completed or not.
	 *
	 * @param {!number} id Item ID
	 * @param {!boolean} completed True if the item is completed
	 */
	setItemComplete(id, completed) {
		const listItem = qs(`[data-id="${id}"]`);

		if (!listItem) {
			return;
		}

		listItem.className = completed ? 'completed' : '';

		// In case it was toggled from an event and not by clicking the checkbox
		qs('input', listItem).checked = completed;
	}

	/**
	 * Bring an item out of edit mode.
	 *
	 * @param {!number} id Item ID of the item in edit
	 * @param {!string} title New title for the item in edit
	 */
	editItemDone(id, title) {
		const listItem = qs(`[data-id="${id}"]`);

		const input = qs('input.edit', listItem);
		listItem.removeChild(input);

		listItem.classList.remove('editing');

		qs('label', listItem).textContent = title;
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindAddItem(handler) {
		this.$newTodo.addEventListener('change', ({target}) => {
			const title = target.value.trim();
			if (title) {
				handler(title);
			}
		});
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindRemoveCompleted(handler) {
        this.$clearCompleted.addEventListener('click', handler);
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindToggleAll(handler) {
        this.$toggleAll.addEventListener('click', ({target}) => {
            handler(target.checked);
        });
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindRemoveItem(handler) {
		$delegate(this.$todoList, '.destroy', 'click', ({target}) => {
			handler(_itemId(target));
		});
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindToggleItem(handler) {
		$delegate(this.$todoList, '.toggle', 'click', ({target}) => {
			handler(_itemId(target), target.checked);
		});
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindEditItemSave(handler) {
		$delegate(this.$todoList, 'li .edit', 'blur', ({target}) => {
			if (!target.dataset.iscanceled) {
				handler(_itemId(target), target.value.trim());
			}
		}, true);

		// Remove the cursor from the input when you hit enter just like if it were a real form
		$delegate(this.$todoList, 'li .edit', 'keypress', ({target, keyCode}) => {
			if (keyCode === ENTER_KEY) {
				target.blur();
			}
		});
	}

	/**
	 * @param {Function} handler Function called on synthetic event.
	 */
	bindEditItemCancel(handler) {
		$delegate(this.$todoList, 'li .edit', 'keyup', ({target, keyCode}) => {
			if (keyCode === ESCAPE_KEY) {
				target.dataset.iscanceled = true;
				target.blur();

				handler(_itemId(target));
			}
		});
	}
}
