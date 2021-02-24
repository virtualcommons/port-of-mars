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
  chat_messages <- get_chat_messages(game_events)
  
  readr::write_csv(processed_player_investment, fs::path_join(c(base_dir, "processed/playerInvestment.csv")))
  readr::write_csv(chat_messages, fs::path_join(c(base_dir, "processed/chatMessages.csv")))
}

run_pipeline("/dump")
