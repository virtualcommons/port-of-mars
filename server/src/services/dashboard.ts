export class DashboardService {
  constructor(public em: EntityManager) {}

  async getData(): Promise<DashboardData> {
    // db stuff happens here
  }
}
