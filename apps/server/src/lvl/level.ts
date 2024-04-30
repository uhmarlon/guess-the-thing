type LevelSystem = {
  maxLevel: number;
  levelPoints: number[];
  pointsPerWin: number;
  pointsPerLoss: number;
};

class GameLevelingSystem {
  private levelSystem: LevelSystem;

  constructor() {
    this.levelSystem = {
      maxLevel: 100,
      levelPoints: this.generateLevelPoints(100, 999999),
      pointsPerWin: 500,
      pointsPerLoss: 300,
    };
  }

  private generateLevelPoints(levels: number, maxPoints: number): number[] {
    const pointsArray = new Array(levels);
    let currentPoints = 0;
    const increment = maxPoints / ((levels * (levels + 1)) / 2);

    for (let level = 1; level <= levels; level++) {
      currentPoints += Math.round(level * increment);
      pointsArray[level - 1] = currentPoints;
    }

    return pointsArray as number[];
  }

  public getLevel(levelPoints: number): number {
    const { levelPoints: pointsArray } = this.levelSystem;

    for (let level = 0; level < pointsArray.length; level++) {
      if (levelPoints < pointsArray[level]) {
        return level + 1;
      }
    }
    return this.levelSystem.maxLevel;
  }

  public getPointsForWin(): number {
    return this.levelSystem.pointsPerWin;
  }

  public getPointsForLoss(): number {
    return this.levelSystem.pointsPerLoss;
  }
}

export { GameLevelingSystem };
