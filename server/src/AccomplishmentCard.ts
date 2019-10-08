interface AccomplishmentData {
    label: string,
    culture: number,
    finance: number,
    government: number,
    legacy: number,
    science: number,
    upkeep: number,
    points: number
}

export class AccomplishmentCard {

    constructor(cardData: AccomplishmentData) {
        return Object.assign(this, cardData)
    }

}

export interface AccomplishmentCard extends AccomplishmentData { }