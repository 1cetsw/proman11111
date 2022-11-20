import data_manager
from psycopg2 import sql


# BOARD QUERIES_______________________________________________________________________________________________________
def public_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id IS NULL 
        ;
        """
        , fetchall=True
    )


def private_boards(user_id):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id = %(user_id)s
        ;
        """
        , {"user_id": user_id}, fetchall=True
    )


def get_board(id):
    return data_manager.execute_select(
        """SELECT *
        FROM boards
        WHERE id = %(id)s""",
        {'id': id}
    )


def add_new_board(title, user_id):
    return data_manager.execute_select(
        """INSERT INTO boards (title, user_id) VALUES (%(title)s, %(id)s) 
        returning id"""
        , {'title': title, 'id': user_id}, fetchall=True)


def delete_board(board_id):
    data_manager.execute_update(
        """
        DELETE 
        FROM boards
        WHERE id = %(board_id)s
        """,
        {'board_id': board_id},
    )


# CARD QUERIES________________________________________________________________________________________________________
def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY card_order ASC
        ;
        """
        , {"board_id": board_id}, fetchall=True)

    return matching_cards


def add_new_card(data, status):
    data_manager.execute_select(
        """INSERT INTO cards (board_id, status_id, title, card_order) VALUES (%(board_id)s, %(status)s, %(title)s, 1)
        returning cards"""
        , {'title': data['title'], 'board_id': data['board_id'], 'status': status}, fetchall=True)


def delete_card(card_id):
    return data_manager.execute_select(
        """DELETE
        FROM cards
        WHERE id = %(card_id)s
        returning id
        """,
        {'card_id': card_id}
    )


def delete_cards(board_id):
    data_manager.execute_update(
        """
        DELETE 
        FROM cards
        WHERE board_id = %(board_id)s
        """,
        {'board_id': board_id}
    )


def get_card(id, table, condition):
    return data_manager.execute_select(sql.SQL("""
        SELECT * 
        FROM {table_name}
        WHERE {condition} = {id}
        """).format(table_name=sql.Identifier(table),
                    id=sql.Literal(id),
                    condition=sql.Identifier(condition))
                                       )


# STAUSES QUERIES_____________________________________________________________________________________________________
def get_card_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id}, fetchall=True)

    return status


def change_card_status(card_id, board_status):
    data_manager.execute_update("""UPDATE cards
                SET status_id = %(board_status)s
                WHERE  id = %(card_id)s
                """
                                , {'board_status': board_status, 'card_id': card_id})


def change_card_order(card_id, order_status):
    data_manager.execute_update("""UPDATE cards
                SET card_order = %(order_status)s
                WHERE  id = %(card_id)s
                """
                                , {'order_status': order_status, 'card_id': card_id})


def change_cards_order(card_status, order_status, board_status, status):
    data_manager.execute_update("""UPDATE cards
                SET card_order = card_order + %(status)s
                WHERE  card_order > %(order_status)s AND status_id = %(card_status)s AND board_id = %(board_status)s
                """
                                ,
                                {'order_status': order_status, 'card_status': card_status, 'board_status': board_status,
                                 'status': status})


def add_column(data):
    return data_manager.execute_select(
        """INSERT INTO statuses (title, board_id)
           VALUES (%(title)s, %(board_id)s) returning id"""
        , {'title': data['title'], 'board_id': data['boardId']})


def get_statuses(board_id):
    return data_manager.execute_select(
        """SELECT *
        FROM statuses
        WHERE board_id=%(board_id)s
        ORDER BY id
        """,
        {'board_id': board_id}
    )


def delete_column(status_id):
    return data_manager.execute_select(
        """
        DELETE 
        FROM statuses
        WHERE id = %(status_id)s
        returning id""",
        {'status_id': status_id}
    )


def name_changer(data, table_name='boards'):
    data_manager.execute_select(sql.SQL(
        """UPDATE {table_name}
        SET {updated_column} = {title_name}
        WHERE {wheree} = {id}
        returning id"""
    ).format(updated_column=sql.Identifier('title'),
             table_name=sql.Identifier(table_name),
             title_name=sql.Literal(data['title']),
             wheree=sql.Identifier('id'),
             id=sql.Literal(data['id'])
             ))
    return data
