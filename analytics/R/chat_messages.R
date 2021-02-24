library(magrittr)

get_chat_messages <- function(events) {
  #' get a data frame of chat message data where chat messages are grouped by game, round and epoch
  #' 
  #' chat messages are in the same epoch if they are a group of messages by the same player uninterrupted by other players
  #' and the player's previous chat message occurred within 30s  
  events <- events %>%
    dplyr::mutate(dateCreated = stringr::str_remove_all(dateCreated, " GMT\\+0000 \\(Coordinated Universal Time\\)")) %>%
    dplyr::mutate(timestamp = lubridate::parse_date_time(dateCreated, orders="amdYHMS")) %>%
    dplyr::select(id, gameId, timestamp, type, payload, phaseInitial, roundInitial)
  min_times <- events %>%
    dplyr::group_by(gameId) %>%
    dplyr::summarise(min_timestamp = min(timestamp))
  chat_messages <- events %>%
    dplyr::left_join(min_times, by = c(gameId='gameId')) %>%
    dplyr::mutate(time = timestamp - min_timestamp) %>%
    dplyr::filter(type == 'sent-chat-message') %>%
    dplyr::mutate(payload = purrr::map(payload, function(p) tibble::as_tibble(jsonlite::fromJSON(p)))) %>%
    tidyr::unnest(payload) %>%
    dplyr::select(-round, -dateCreated) %>%
    dplyr::arrange(gameId, id)
  
  epoched_events <- chat_messages %>%
    dplyr::select(-type, -phaseInitial, -min_timestamp, -timestamp) %>%
    dplyr::group_by(gameId, roundInitial) %>%
    dplyr::mutate(role_prev=dplyr::coalesce(dplyr::lag(role), role), time_prev=dplyr::coalesce(dplyr::lag(time), time)) %>%
    dplyr::mutate(time_diff = time - time_prev) %>%
    dplyr::mutate(role_change=role != role_prev, time_change = time_diff > lubridate::dseconds(30)) %>%
    dplyr::mutate(changed = role_change | time_change) %>%
    dplyr::mutate(epoch = cumsum(changed)) %>%
    dplyr::ungroup()
  
  epoched_events %>%
    dplyr::group_by(gameId, roundInitial, epoch) %>%
    dplyr::summarise(ids = stringr::str_c(id, collapse="; "), role = role[1], message=stringr::str_c(message, collapse="; "), time_min=min(time), time_max=max(time)) %>%
    dplyr::rename(text = message, round = roundInitial)
}