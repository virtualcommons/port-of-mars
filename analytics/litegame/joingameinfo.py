# post-export script for the lite game data that merges game info into the other tables
# + includes prolific IDs where player IDs are present


import pandas as pd


def merge_drop_duplicate_fields(
    left_csv, right_csv, out_csv, key="gameId", right_suffix="_from_game"
):
    left = pd.read_csv(left_csv)
    right = pd.read_csv(right_csv)
    merged = left.merge(right, on=key, how="left", suffixes=("", right_suffix))
    # drop all the right-side duplicates that got the suffix
    merged = merged.loc[:, ~merged.columns.str.endswith(right_suffix)]
    merged.to_csv(out_csv, index=False)
    print(
        f"SUCCESS: merged columns from {right_csv} into {left_csv}, saved to {out_csv}"
    )


def include_prolific_id(target_csv, players_csv):
    target = pd.read_csv(target_csv)
    players = pd.read_csv(players_csv, usecols=["playerId", "prolificId"])
    # de-dupe players, shoudn't ever do anything though
    players = players.drop_duplicates(subset="playerId", keep="last")
    target = target.merge(players, on="playerId", how="left")
    target.to_csv(target_csv, index=False)
    print(f"SUCCESS: added column prolificId to {target_csv}")


def include_role_prolific_ids(
    target_csv,
    players_csv,
    role_prefixes=("politician", "researcher", "entrepreneur", "curator", "pioneer"),
):
    target = pd.read_csv(target_csv)
    players = pd.read_csv(players_csv, usecols=["playerId", "prolificId"])
    players = players.drop_duplicates(subset="playerId", keep="last")
    pid_to_prolific = players.set_index("playerId")["prolificId"]

    created_cols = []
    for role in role_prefixes:
        pid_col = f"{role}PlayerId"
        out_col = f"{role}ProlificId"
        if pid_col in target.columns:
            target[out_col] = target[pid_col].map(pid_to_prolific)
            created_cols.append(out_col)

    target.to_csv(target_csv, index=False)
    print(
        f"SUCCESS: added columns {created_cols if created_cols else '[]'} to {target_csv} from {players_csv}"
    )


merge_drop_duplicate_fields(
    "investments.csv", "games.csv", "investments-with-game-info.csv"
)
merge_drop_duplicate_fields("players.csv", "games.csv", "players-with-game-info.csv")
merge_drop_duplicate_fields(
    "eventcards.csv", "games.csv", "eventcards-with-game-info.csv"
)
merge_drop_duplicate_fields("chat.csv", "games.csv", "chat-with-game-info.csv")
merge_drop_duplicate_fields("votes.csv", "games.csv", "votes-with-game-info.csv")
merge_drop_duplicate_fields(
    "vote-effects.csv", "games.csv", "vote-effects-with-game-info.csv"
)

include_prolific_id("investments-with-game-info.csv", "players.csv")
include_prolific_id("votes-with-game-info.csv", "players.csv")
include_prolific_id("vote-effects-with-game-info.csv", "players.csv")
include_prolific_id("chat-with-game-info.csv", "players.csv")
include_role_prolific_ids("eventcards-with-game-info.csv", "players.csv")
