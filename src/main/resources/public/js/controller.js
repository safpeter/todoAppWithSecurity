import View from './view.js';

export default class Controller {
	/**
	 * @param  {!View} view A View instance
	 */
	constructor(view) {
		this.view = view;

		view.bindAddItem(this.addItem.bind(this));
		view.bindEditItemSave(this.editItemSave.bind(this));
		view.bindEditItemCancel(this.editItemCancel.bind(this));
		view.bindRemoveItem(this.removeItem.bind(this));
		view.bindToggleItem((id, completed) => {
			this.toggleCompleted(id, completed);
			this._filter();
		});
		view.bindRemoveCompleted(this.removeCompletedItems.bind(this));
		view.bindToggleAll(this.toggleAll.bind(this));

		view.bindFilterAll(this.updateState.bind(this));
		view.bindFilterActive(this.updateState.bind(this));
		view.bindFilterComplete(this.updateState.bind(this));

		this._activeRoute = '';
		this._lastActiveRoute = null;
	}

	updateState(newState) {
        this._activeRoute = newState;
        this._filter();
        this.view.updateFilterButtons(newState); // TODO wrong
    }


    /**
     * Sends an AJAX request.
     * @param endpoint The endpoint of the request, for example "/login"
     * @param method Request method. Can be "GET", "POST", "PUT", "DELETE",..
     * @param params Parameters in URL format, like "param1=3&param3=asdf"
     * @param onSuccess A function to call when the request completes successfully.
     *                  The data will be in event.target.response
     */
	sendAjax(endpoint, method, params = null, onSuccess = null) {
	    const scope = this;
        const req = new XMLHttpRequest();
        req.addEventListener("load", function (event) {
            onSuccess.call(scope, event);
        });
        req.addEventListener("error", function (err) {
            console.log("Request failed for " + endpoint + " error: " + err);
        });
        req.open(method, "http://localhost:9999/" + endpoint);
        if (method === "POST" || method === "PUT") {
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        req.send(params);
    }

	/**
	 * Set and render the active route.
	 *
	 * @param {string} raw '' | '#/' | '#/active' | '#/completed'
	 */
	setView(raw) {
		const route = raw.replace(/^#\//, '');
		this._activeRoute = route;
		this._filter();
		this.view.updateFilterButtons(route);
	}

	/**
	 * Add an Item to the Store and display it in the list.
	 *
	 * @param {!string} title Title of the new item
	 */
	addItem(title) {
	    this.sendAjax("todos", "POST", "todo-title=" + title, function (event) {
            this.view.clearNewTodo();
            this._filter(true);
        });
	}

	/**
	 * Save an Item in edit.
	 *
	 * @param {number} id ID of the Item in edit
	 * @param {!string} title New title for the Item in edit
	 */
	editItemSave(id, title) {
		if (title.length) {
		    this.sendAjax("todos/" + id, "PUT",  "todo-title=" + title, function (event) {
                this.view.editItemDone(id, title);
            });
		} else {
			this.removeItem(id);
		}
	}

	/**
	 * Cancel the item editing mode.
	 *
	 * @param {!number} id ID of the Item in edit
	 */
	editItemCancel(id) {
        this.sendAjax("todos/" + id, "GET", null, function (event) {
            this.view.editItemDone(id, event.target.response);
        });
	}

	/**
	 * Remove the data and elements related to an Item.
	 *
	 * @param {!number} id Item ID of item to remove
	 */
	removeItem(id) {
        this.sendAjax("todos/" + id, "DELETE", null, function (event) {
            this.view.removeItem(id);
        });
	}

	/**
	 * Remove all completed items.
	 */
	removeCompletedItems() {
        this.sendAjax("todos/completed", "DELETE", null, function (event) {
            this._filter(true);
        });
	}

	/**
	 * Update an Item in storage based on the state of completed.
	 *
	 * @param {!number} id ID of the target Item
	 * @param {!boolean} completed Desired completed state
	 */
	toggleCompleted(id, completed) {
	    this.sendAjax("todos/" + id + "/toggle_status", "PUT", "status=" + completed, function (event) {
            this._filter(true);
        });
	}

	/**
	 * Set all items to complete or active.
	 *
	 * @param {boolean} completed Desired completed state
	 */
	toggleAll(completed) {
        this.sendAjax("todos/toggle_status", "PUT", "toggle-all=" + completed, function (event) {
            this._filter(true);
        });
	}

	/**
	 * Refresh the list based on the current route.
	 *
	 * @param {boolean} [force] Force a re-paint of the list
	 */
	_filter(force) {
		const route = this._activeRoute;

		if (force || this._lastActiveRoute !== '' || this._lastActiveRoute !== route) {
            // an item looks like: {id:abc, title:"something", completed:true}
            this.sendAjax("list", "POST", "status=" + route, function (event) {
                const respObj = JSON.parse(event.target.response);
                this.refreshItems(respObj);
            });
		}
		this._lastActiveRoute = route;
	}

	refreshItems(respObj) {
        this.view.showItems(respObj);

        const total = respObj.length;
        const completed = respObj.filter(item => item.completed === true).length;
        const active = total - completed;

        this.view.setItemsLeft(active);
        this.view.setClearCompletedButtonVisibility(completed);

        this.view.setCompleteAllCheckbox(completed === total);
        this.view.setMainVisibility(total);
    }
}
