/**
 * Die Klasse LevelSystem bietet eine Methode zur Bestimmung des Spielerlevels basierend auf Punkten.
 * Das Levelsystem ist so konzipiert, dass die Punkteschwellen für das Level-Up exponentiell ansteigen,
 * was die anfänglichen Level leichter und die späteren Level schwieriger zu erreichen macht.
 *
 * Konstanten:
 *  - maxLevel: Das maximale Level, das erreicht werden kann.
 *  - basePoints: Die Punkte, die benötigt werden, um das erste Level zu erreichen.
 *  - targetPoints: Die Punkte, die benötigt werden, um das maximale Level zu erreichen.
 *
 * Methoden:
 *  - calculatePointsForLevel(level: number): Berechnet die Punkte, die benötigt werden, um das gegebene Level zu erreichen.
 *    Die Methode verwendet eine exponentielle Formel, die durch die Konstanten a und b definiert wird.
 *
 *  - getLevel(points: number): Bestimmt das aktuelle Level des Spielers basierend auf den übergebenen Punkten.
 *    Die Methode iteriert durch die Levels und vergleicht die Punkte mit den berechneten Schwellenwerten für jedes Level.
 *    Falls die Punkte unter dem Schwellenwert für Level 1 liegen, wird Level 0 zurückgegeben.
 *
 *  - getLevelInfo(points: number): Gibt detaillierte Informationen über das aktuelle Level des Spielers zurück.
 *    Das zurückgegebene Objekt enthält das aktuelle Level, die aktuellen Punkte, den Start- und Endpunkt des Levels.
 *    Falls das maximale Level erreicht ist, wird der Endpunkt als Infinity zurückgegeben, was bedeutet, dass es keine obere Grenze gibt.
 *
 * Diese Klasse nutzt eine einfache Mathematik zur Berechnung und ist frei von externen Abhängigkeiten, was sie ideal für Spiele macht,
 * bei denen Leistung und Präzision wichtig sind.
 */

class LevelSystem {
  private static readonly maxLevel: number = 100;
  private static readonly basePoints: number = 100;
  private static readonly targetPoints: number = 995000;

  private static readonly b: number =
    Math.log(this.targetPoints / this.basePoints) / (this.maxLevel - 1);
  private static readonly a: number = this.basePoints / Math.exp(this.b);

  private static calculatePointsForLevel(level: number): number {
    return Math.round(this.a * Math.exp(this.b * level));
  }

  public static getLevel(points: number): number {
    if (points < 0) {
      return 0;
    }

    let level = 1;
    while (
      level <= this.maxLevel &&
      this.calculatePointsForLevel(level) <= points
    ) {
      level++;
    }

    return level - 1;
  }

  public static getLevelInfo(points: number): {
    currentLevel: number;
    currentPoints: number;
    rangeStart: number;
    rangeEnd: number;
  } {
    const currentLevel = this.getLevel(points);
    const rangeStart =
      currentLevel === 0 ? 0 : this.calculatePointsForLevel(currentLevel);
    const rangeEnd =
      currentLevel === this.maxLevel
        ? Infinity
        : this.calculatePointsForLevel(currentLevel + 1) - 1;

    return {
      currentLevel,
      currentPoints: points,
      rangeStart,
      rangeEnd,
    };
  }
}

export { LevelSystem };
