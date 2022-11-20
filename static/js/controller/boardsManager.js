import {dataHandler} from "../data/dataHandler.js";
import {
    htmlFactory,
    htmlTemplates,
    buttonBuilder,
    modalBuilder,
    makeDroppable,
    inputBuilder,
    addButtonBuilder,
    newColumnBuilder,
    ContainerBuilder
} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";


export let boardsManager = {
        loadBoards: async function () {
            let userId;
            let boards = []
            const publicBoards = await dataHandler.PublicBoards();
            let privateButton = document.getElementById("create_private_board")
            if (privateButton) {
                userId = privateButton.dataset.userId
                const privateBoards = await dataHandler.PrivateBoards(userId);
                boards = privateBoards.concat(publicBoards)
            }
            else {
                boards = publicBoards
            }
            await this.newBoard()
            let columns = document.getElementsByClassName('board-content');
            for (let board of boards) {
                const statuses = await dataHandler.getStatuses(board.id)
                const boardBuilder = htmlFactory(htmlTemplates.board);
                const content = boardBuilder(statuses, board); 
                domManager.addChild("#root", content); 
                makeDroppable.droppableBoards();
                domManager.addEventListenerToMore(
                    `.board-title`,
                    "dblclick",
                    renameBoardTitle
                );
                domManager.addEventListenerToMore(
                    `.arrow-board-toggle[data-board-id="${board.id}"]`,
                    "click",
                    showHideButtonHandler
                );
                domManager.addEventListenerToMore(
                    '.board-column-title',
                    'dblclick',
                    renameColumnTitle
                );
                domManager.addEventListenerToMore(
                    '.icon-button', 'click', deleteColumn
                );
            }
            for (let column of columns) {
                column.style.visibility = "hidden";
            }
            domManager.addEventListenerToMore('.delete', 'click', deleteBoard)
        },
        newBoard: async function () {
            const button = buttonBuilder()
            domManager.addChild("#root", button);
            domManager.addEventListener(`#create_new_board`, 'click', addBoardTitle)
        },
    }
;


function getBoard(boards, boardId) {
    let actualBoard
    for (let board of boards) {
        if (board.dataset.boardId === String(boardId)) {
            actualBoard = board
            break
        }
    } return actualBoard
}


async function addNewCard(clickEvent) {
    const boardId = clickEvent.target.parentElement.parentElement.dataset.boardId
    const newCardModalTitle = modalBuilder('new_card')
    domManager.addChild('#root', newCardModalTitle);
    $('.modal').modal('toggle');
    domManager.addEventListener('#create', 'click', async function () {
        const cardTitle = $('#new-element-title').val()
        let statuses = await dataHandler.getStatuses(boardId)
        await dataHandler.addNewCard(cardTitle, boardId, statuses[0].id);
        document.getElementsByClassName('modal')[0].remove()

        $(`.arrow-board-toggle[data-board-id="${boardId}"]`).click()
        $(`.arrow-board-toggle[data-board-id="${boardId}"]`).click()

    })
    domManager.addEventListener('.close', 'click', async function () {
        document.getElementById('root').innerHTML = ''
        await boardsManager.loadBoards()
    })
}


domManager.addEventListener(`#create_private_board`, 'click', addBoardTitle)
function addBoardTitle(clickEvent) {
    let userId = clickEvent.target.dataset.userId
    const newBoardModalTitle = modalBuilder('new_board')
    domManager.addChild('#root', newBoardModalTitle);
    $('.modal').modal('toggle');
    domManager.addEventListener('#create', 'click', async function () {
        const boardTitle = $('#new-element-title').val()
        const boardId = await dataHandler.addNewBoard(boardTitle, userId);
        document.getElementById('root').innerHTML = ''
        await boardsManager.loadBoards()
    })
    domManager.addEventListener('.close', 'click', async function () {
        document.getElementById('root').innerHTML = ''
        await boardsManager.loadBoards()
    })
}

async function showHideButtonHandler(clickEvent) {
    let header = clickEvent.target.parentElement
    let columns = document.getElementsByClassName('board-content')
    let boardId = clickEvent.target.dataset.boardId
    let changeButton = document.querySelector(`.arrow-board-toggle[data-board-id="${boardId}"]`) // zmiana przycisku
    changeButton.src = "../static/images/hide.png"; // ikona po kliknieciu show
    if (clickEvent.target.dataset.show === "false") {
        const boardId = clickEvent.target.dataset.boardId;
        const addColumnButton = addButtonBuilder('column')
        const addCardButton = addButtonBuilder('card')
        await cardsManager.loadCards(boardId);
        clickEvent.target.dataset.show = "true";
        for (let column of columns) {
            if (boardId === column.dataset.boardId) {
                column.previousElementSibling.children[1].insertAdjacentHTML('beforebegin', addColumnButton)
                column.previousElementSibling.children[1].insertAdjacentHTML('beforebegin', addCardButton)
                column.style.visibility = "visible";
                domManager.addEventListenerToMore(
                    '.add-card',
                    'click',
                    addNewCard);
                domManager.addEventListenerToMore(
                    '.add-column',
                    'click',
                    addNewColumn);
            }
        }
    } else {
        changeButton.src = "../static/images/show.png"; // przycisk po zwinieciu
        header.removeChild(header.children[1])
        header.removeChild(header.children[1])
        for (let column of columns) {
            if (boardId === column.dataset.boardId) {
                let cards = document.getElementsByClassName('board-column-content')
                for (let col of cards) {
                    col.innerHTML = ''}
                column.style.visibility = "hidden";
                clickEvent.target.dataset.show = "false";
            }
        }
    }
}

async function renameColumnTitle(clickEvent) {
    const columnId = clickEvent.target.dataset.status;
    let actualColumn = clickEvent.target
    actualColumn.style.visibility = 'hidden'
    const inputting = inputBuilder('column')
    let parent = clickEvent.target.parentElement
    parent.insertBefore(inputting[1], parent.childNodes[0])
    parent.insertBefore(inputting[0], parent.childNodes[0])

    let ignoreClickOnMeElement = inputting[0]
    document.addEventListener('click', isOutside)

    domManager.addEventListener('.rename-column', 'click', async function () {
            let newStatus = inputting[0].value
            await dataHandler.renameColumn(columnId, newStatus)
            actualColumn.textContent = newStatus
            inputting[0].remove()
            inputting[1].remove()
            actualColumn.style.visibility = 'visible'
            document.removeEventListener('click', isOutside)
        }
    )

    function isOutside(event) {
        if ((event.target) !== ignoreClickOnMeElement) {
            document.removeEventListener('click', isOutside)
            inputting[0].remove()
            inputting[1].remove()
            actualColumn.style.visibility = 'visible'

        }
    }
}

async function addNewColumn(clickEvent) {
    const boardId = clickEvent.target.parentElement.parentElement.dataset.boardId
    const newColumnModalTitle = modalBuilder('new_column')
    domManager.addChild('#root', newColumnModalTitle);
    $('.modal').modal('toggle');
    domManager.addEventListener('#create', 'click', async function () {
        const columnTitle = $('#new-element-title').val()
        let columns = clickEvent.target.parentElement.nextElementSibling.children
        let status = await dataHandler.NewStatus(columnTitle, boardId)
        let newColumn = newColumnBuilder(columnTitle, boardId, status[0].id);
        document.getElementsByClassName('modal')[0].remove()
        columns[0].insertAdjacentHTML('beforeend', newColumn)
        makeDroppable.droppableBoards();
        document.getElementById('root').innerHTML = ''
        let createColumnButton = document.querySelector('.btn-primary');
        console.log(createColumnButton);
        await boardsManager.loadBoards();
    })
    domManager.addEventListener('.close', 'click', async function () {
        document.getElementById('root').innerHTML = ''
        await boardsManager.loadBoards()
    })
}

async function deleteColumn(clickEvent) {
    let columns = document.getElementsByClassName('board-column');
    let boardId = clickEvent.target.parentElement.dataset.board
    const columnId = clickEvent.target.parentElement.dataset.column; //1_1, vagy 1_2
    let columnsParent = document.querySelector(`.board-container[data-board-id="${boardId}"]`) //
    await dataHandler.deleteColumn(columnId);

    const column = clickEvent.target.parentElement
    column.parentElement.remove();
}

async function deleteBoard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId
    await dataHandler.deleteBoard(boardId);
    reload();
}

domManager.addEventListener(`#reload`, 'click', reload)
function reload() {
    window.location.reload()
}

function renameBoardTitle(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let actualBoard = clickEvent.target
    actualBoard.style.visibility = 'hidden'
    const inputbar = inputBuilder('board')
    let parent = clickEvent.target.parentElement
    parent.insertBefore(inputbar[1], parent.childNodes[0])
    parent.insertBefore(inputbar[0], parent.childNodes[0])

     let ignoreClickOnMeElement = inputbar[0]
    document.addEventListener('click', isOutside)


    domManager.addEventListener('.rename-board', 'click', async function () {
            let newTitle = inputbar[0].value
            await dataHandler.renameBoard(boardId, newTitle)
            inputbar[0].remove()
            inputbar[1].remove()
            actualBoard.style.visibility = 'visible'
            actualBoard.textContent = newTitle
            document.removeEventListener('click', isOutside)
        }
    )
    function isOutside(event) {
        if ((event.target) !== ignoreClickOnMeElement) {
            document.removeEventListener('click', isOutside)
            console.log('na')
            inputbar[0].remove() //input field
            inputbar[1].remove() //button
            actualBoard.style.visibility = 'visible'
        }
    }
}