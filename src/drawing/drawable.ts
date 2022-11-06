
/**
 * Interface of drawable object
 */
export interface Drawable
{
    /**
     * Draws the object
     * @param {number} elapsedTime Elapsed time from the last drawing (miliseconds)
     */
    draw(elapsedTime: number): void;
}