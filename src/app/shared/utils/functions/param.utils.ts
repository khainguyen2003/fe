import { MOVIE_STATUS } from "../../constants/constants";

export class MovieUtils {
    public static getMovieTypeLabel(value: string | number) {
        if (!value) {
            return '';
        }
        const item = MOVIE_STATUS.find(
            (item) => item.value === value.toString()
        );
        return item ? item.label : '';
    }

    public static getMovieStatusLabel(value: string | number) {
        if (!value) {
            return '';
        }
        const item = MOVIE_STATUS.find(
            (item) => item.value === value.toString()
        );
        return item ? item.label : '';
    }
}