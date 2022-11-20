export let dataHandler = {
    PublicBoards: async function () {
        const response = await apiGet("/api/boards/public");
        return response;
    },
    PrivateBoards: async function (userId) {
        const response = await apiGet(`/api/boards/private?user=${userId}`);
        return response;
    },
    getBoard: async function (boardId) {
        return await postData('/api/get_board', {id: boardId})
    },
    getStatuses: async function (boardId) {
        let data = await postData('/api/getStatuses', {boardId: boardId});
        return data
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    addNewBoard: function (boardTitle, userId=null) {
        // creates new board, saves it and calls the callback function with its data
        return postData('/api/new_board', {title: boardTitle, user_id: userId})
            .then(data => {
                return data// JSON data parsed by `data.json()` call
            });
    },
    addNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    return postData('/api/new_card', {title: cardTitle, board_id: boardId, status: statusId})
            .then(data => {
                return data// JSON data parsed by `data.json()` call
            });
    },
    NewStatus: async function (columnTitle, boardId) {
        return postData('/api/column', {title: columnTitle, boardId: boardId})
    },
    renameCard: async function (cardId, newTitle) {
        return postData('/api/rename_card', {id: cardId, title: newTitle})
    },
    renameBoard: function (id, boardTitle) {
        return postData('/api/rename_board', {id:id, title: boardTitle})
            .then(data => {
                return data// JSON data parsed by `data.json()` call
            });
    },
    renameColumn: function (columnId, newStatus) {
        let ColumnId = columnId[0];
        let boardId = columnId[2];
        return postData('/api/rename_column', {id:ColumnId, title:newStatus})
            .then(data => {
                return data
            });
    },
    deleteColumn: async function (columnId) {
        return await apiDelete(`/api/delete_column/${columnId}`, {columnId:columnId});
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/delete_board/${boardId}`, {boardId:boardId});
    },
     deleteCard: async function (cardId) {
        return apiDelete('/api/delete_card', {id: cardId})
    }
};


export async function postData(url = '', data = {}) {
            // Default options are marked with
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}
async function apiDelete(url="", data={}) {
        let response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
            return response.json();
}
async function apiPost(url, payload) {
}
async function apiPut(url) {
}




