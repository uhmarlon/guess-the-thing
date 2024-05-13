/**
 * Die Klasse LevelSystem stellt Methoden zur Verfügung, um das Level eines Spielers basierend auf seinen Punkten zu berechnen.
 */
class LevelSystem {
  /**
   * Die maximale Levelnummer, die ein Spieler erreichen kann.
   */
  private static readonly maxLevel: number = 1000;

  /**
   * Die Anzahl der Punkte, die ein Spieler pro Spiel erhält.
   */
  private static readonly pointsPerGame: number = 120;

  /**
   * Berechnet die Gesamtpunktzahl für ein bestimmtes Level.
   * @param level Das Level, für das die Punktzahl berechnet werden soll.
   * @returns Die Gesamtpunktzahl für das gegebene Level.
   */
  private static calculatePointsForLevel(level: number): number {
    return this.pointsPerGame * level * level; // 120 * level^2
  }

  /**
   * Berechnet das Level eines Spielers basierend auf seiner Gesamtpunktzahl.
   * @param points Die Gesamtpunktzahl des Spielers.
   * @returns Das Level des Spielers.
   */
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

  /**
   * Gibt Informationen über das aktuelle Level eines Spielers basierend auf seiner Gesamtpunktzahl.
   * @param points Die Gesamtpunktzahl des Spielers.
   * @returns Ein Objekt mit Informationen über das aktuelle Level des Spielers, seine Gesamtpunktzahl und den Punktebereich für sein aktuelles Level.
   */
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
