get_processed_player_investments <- function(game_events, player_investment) {
  dplyr::bind_rows(
    player_investment %>%
      dplyr::filter(name == 'pendingInvestment') %>%
      dplyr::inner_join(
        game_events %>%
          dplyr::filter(type == 'time-invested') %>%
          dplyr::select(id),
        by = c(id = "id")
      ) %>%
      dplyr::group_by(gameId, roundFinal) %>%
      dplyr::filter(id == max(id)) %>%
      dplyr::ungroup() %>%
      dplyr::mutate(name = 'finalInvestment'),
    player_investment %>%
      dplyr::filter(name == 'inventory') %>%
      dplyr::group_by(gameId, roundFinal, phaseFinal) %>%
      dplyr::filter(id == max(id)) %>%
      dplyr::ungroup() %>%
      dplyr::mutate(name = 'finalInventory'),
    player_investment)
}