library(magrittr)

ROLES = c('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')
RESOURCES = c('culture', 'finance', 'government', 'legacy', 'science')
INVESTMENTS = c(RESOURCES, 'systemHealth')
STATISTICS = c('pendingInvestment', 'cost', 'inventory')
PHASES = factor(c('newRound', 'events', 'invest', 'trade', 'purchase', 'discard'), ordered = T, levels = c('newRound', 'events', 'invest', 'trade', 'purchase', 'discard'))

game_events <- readr::read_csv("/dump/gameEvent.csv")
player_investment <- readr::read_csv("/dump/playerInvestment.csv")

final_investment <- dplyr::bind_rows(
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

readr::write_csv(final_investment, "/dump/playerInvestment.csv")
