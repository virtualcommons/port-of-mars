library(magrittr)
source("R/consts.R")
source("R/player_investments.R")
source("R/chat_messages.R")

# switch to using target
run_pipeline_chat_messages <- function(base_dir) {
  game_events_path <- fs::path_join(c(base_dir, "processed/gameEvent.csv"))
  game_events <- readr::read_csv(game_events_path)
  chat_messages <- get_chat_messages(game_events)
  readr::write_csv(chat_messages, fs::path_join(c(base_dir, "processed/chatMessages.csv")))
}

run_pipeline <- function(base_dir) {
  game_events_path <- fs::path_join(c(base_dir, "processed/gameEvent.csv"))
  player_investment_path <- fs::path_join(c(base_dir, "raw/playerInvestment.csv"))
  
  game_events <- readr::read_csv(game_events_path)
  player_investment <- readr::read_csv(player_investment_path)
  
  processed_player_investment <- get_processed_player_investments(game_events=game_events, player_investment=player_investment)
  chat_messages <- if (dim(dplyr::filter(game_events, type == 'sent-chat-message'))[1] > 0) {
    get_chat_messages(game_events)
  } else {
    data.frame() # empty df if no chat messages
  }

  readr::write_csv(processed_player_investment, fs::path_join(c(base_dir, "processed/playerInvestment.csv")))
  readr::write_csv(chat_messages, fs::path_join(c(base_dir, "processed/chatMessages.csv")))
}

process_all_rounds <- function(base_path) {
  # assumes that all numeric directories contain exported tournament round data
  entries <- fs::dir_ls(base_path)
  tournament_dirs <- entries[fs::path_ext(entries) == '' & grepl("^[0-9]+$", fs::path_file(entries))]

  for (dir in tournament_dirs) {
    run_pipeline(dir)
  }
}

process_all_rounds("/dump")