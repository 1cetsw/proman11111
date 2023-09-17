# ProMAN (sprint 1)

## Story
An email from the client
From: Mark Smith <ceo@thepartner.com>

Subject: Welcome on board the ProMan project!

In these days, everyone wants to create a new project management tool,
and we're no exception. We'd like to implement
something similar to Trello, so we can say we have our own tool!

We call it: ProMan

Jacob, our senior full-stack developer already started to work on the project.
He made sure to have a proper backlog, and he started to work on the wireframe
of the application.

Unfortunately Jacob was late one day, he arrived to work at 9:02,
so we had to fire him. Work starts at 9am, he had to learn it.

Now it's your job to finish the project!
Send us the sprint backlog ASAP, and we'll meet at the demo!

Remember, we need completed user stories and quality work!

Mark
Oh well, another nice client.

From the attachments, you can see that they imagine the app as a "one pager", where all the boards are displayed, and when one is opened, the corresponding cards are shown. Their screen plan is not too sophisticated but seems to be a good staring point.

Of course, the customer would love to have an application which is easy to use at first glance, where functionality is straightforward, and the application looks nice on different screen sizes if possible. As this is usually the case. Let's get this job done.

## Tasks

1.  Boards list overview
    -Create an overview page that lists the existing boards.
    -If the application server is started, a list of the previously created -boards is displayed on the root URL (/).

2. Create public boards
    Allow the user to add new boards with public access.
    -There is a "Create new board" button on the root URL (/).
    -After clicking the "Create new board" button, the title of the new board -can be specified in an editable field.
    -There is a "Save" button that saves the new board and its title. The title is displayed on the board page and the board list.

3. Rename board
    Allow the user to change the title of any board.
    -When clicking the title of a board, it changes into an input box where the title can be edited.
    -There is a "Save" button that saves the new title of the board. The title is displayed on the board page and the board list.

4. Board view with four default columns
    Four default columns are displayed after opening a board.
    -There are four columns (New, In Progress, Testing, Done) that indicate the statuses of cards.
    -The title of the board is displayed on the top of the page.
    -The board closes after clicking its title.

5.   Board view with dynamic columns
    Allow the user to add any number of columns to the board that can be used as statuses for the cards.
    -There is an "Add new column" button after opening a board.
    -A new column is added to the board when clicking the "Add new column" button with the title given by the user. The column can be used as a status for the cards.
    -The title of the board is visible on the top of the page.
    -The board closes when clicking its title

6. Rename columns
    Allow the user to change the title of any column.
    -Clicking the title of a column changes it into an input box where a new title can be written.
    -The new title is saved when pressing Enter.
    -Clicking out of the input box or pressing Escape results in the original title remaining unchanged.

7. Create card
    Allow the user to add a new card to a board.
    -There is a "Create new card" button after opening a board.
    -A new card is added to the first column of the board when clicking the "Create new card" with the title given by the user.

8.  Order the cards
    Allow the user to set priorities to the cards.
    -Allow the user to drag the cards above or below each other and ensure that the card stays in the new position (that is, its order is updated).

9. Change card status
    Allow the user to change the status of a card (that is, move the card between columns).

    -Cards can be dragged from one column to another, and stay in the new position (that is, their status is updated).

10. Edit card title
    Allow the user to edit the title of a card.
    -Clicking the title of a card changes it into an input box where a new title can be written.
    -Pressing Enter saves the new title.
    -Clicking out of the input box or pressing Escape results in the original title remaining unchanged.

11. Offline access
    Allow the user to access the boards and cards offline like a proper PWA (progressive web app).
    -Allow the user to save the webpage as a mobile application that can be later opened offline, when the webpage is opened from the root URL (/) on a mobile device.   

12.  User registration
    Allow the user to register a new account.
    -There is a register link on the main page that leads to the registration page, after opening the root URL (/). .
    -There is a registration form where the user can specify a username and password.
    -There is a submit button in the registration form. By clicking it, the user credentials get stored and the user can log in with them later.

12. User login
    Allow the user to log into the application with their username and password.
    -There is a "Login" button in the main page header if the user is not logged in.
    -After clicking the "Login" button, there is a login page where the user can input their username and password.
    -After logging in, the user can see the list of public and private boards

13.  Private boards
    Allow the logged-in user to create private boards that are only visible to them.
    There is a "Create new private board" button when the user is logged in.
    -After clicking the "Create" button, an editable field is displayed, where the title of the new private board can be specified.
    -There is a "Save" button that saves the new private board and its title.
    -Ensure that the private board is visible only when the user who created it is logged in.

14.  User logout
    Allow the user to log out from the application.
    -There is a logout link when the user is logged in.
    -After clicking the logout link the user is logged out and is able to see the public boards only.

15.  Delete public boards
    Allow the user to delete existing public boards.
    -There is a delete icon associated with every public board.
    -After clicking a delete icon, the associated board is deleted along with its cards.

16.  Delete private boards
    Allow the user to delete existing private boards that are associated to their account. Boards can only be deleted when the user is logged in.
    -There is a delete icon associated with every private board that belongs to the logged-in user.
    -After clicking a delete icon, the associated Board is deleted along with its cards.

17. Delete cards
    Allow the user to delete cards from boards.
    -There is a delete icon associated with every card.
    -After clicking a delete icon, the associated card is deleted from the board.

18.  Delete columns
    Allow the user to delete columns from boards.
    -There is a delete icon associated with every column.
    -After clicking a delete icon, the associated column is deleted from the board, along with its cards.

19.  Archive cards
    Allow the user to archive and restore cards.
    -There is an archive icon associated with every card.
    -After clicking the archive icon, the associated card is archived (that is, it disappears from the board).
    -There is an "Archived Cards" button on the board (if it has any archived cards).
    -After clicking the "Archived Cards" button, a list of all archived cards associated with the board is displayed.
    -There is an "Unarchive" icon associated with every archived card in the list.
    -After clicking the "Unarchive" icon, the card is unarchived (that is, it returns to its original status on the associated board).

20. Manual synchronization
    Allow the user to see changes made by other users after refreshing the page.
    -There is a "Refresh" button on the page
    -After clicking the "Refresh" button, all boards and cards are refreshed, so changes made by other users can be seen.

21.  Allow the user to collaborate with other users in real-time.
    -When a change is made to any board or its cards, other users with access to the board get the updates automatically and immediately.

22. (optional) History of changes in the current session
    On the right side of the page, there is a card list with all the changes made by the user in the current session.
    -Each time a post request is made, a new card is added on top of the history list, containg the name of the new card, and the board to which it is added.
    -Each time a delete request is made, a new card is added on top of the history list, containg the name of the deleted card, and the board to which it is deleted.
    -Each time a put request is made, a new card is added on top of the history list, containing the previous name of the card, the new name of the card, and the status of the card.
    -The history list is implemented using the chain of responsibility pattern (https://refactoring.guru/design-patterns/chain-of-responsibility).

23.  (optional) Separation of concerns for each DB entity
    Split the data_handler in the backend into multiple entities, each one with its own CRUD operations.
    -A cards_handler is created, which is responsible for operations with cards (update, delete, get, create).
    -A boards_handler is created, which is responsible for operations with boards (update, delete, get, create).
    -A tags_handler is created, which is responsible for operations with cards (update, delete, get, create).

24.  (optional) Create default properties using builder pattern
    Each time a new card or board is created, the default properties (statuses, created time, etc.) are given in the backend by using a builder pattern (https://refactoring.guru/design-patterns/creational-patterns).

    -There is a card and a board builder pattern. The builder is selected using a factory pattern.


## Hints
    -a route which returns json data should start with api. Example /api/boards returns json while / returns a html template via render_template
    -construct your route names using the rest principle. Example /api/boards/<boards_id>
    -when an entity is a subset of another entity prefix that entity with the parent entity. Example: /api/boards/<int:board_id>/cards/, /api/boards/int:board_id/statuses/
    -after you implement the log in functionality a board will belong to an user so the routes should be refactored as /api/users/<user_id>/boards/<board_id>/ and /api/users/<user_id>/boards/<board_id>/cards and so on



# ProMAN (sprint 2)


1.  Deploy ProMan
    Deploy the ProMan project so it is hosted on a publicly accessible server.
    -There is a public URL where the finished product can be tested.
    -The public version of the app is used on the sprint demo

2.  Create a new sprint from the existing backlog. Last week you had a long list of stories, but you only have one new story (Deploy ProMan) this week.

    -The new task is added to the backlog.
    -A new sprint plan is created from the unfinished stories

