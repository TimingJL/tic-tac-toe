import { Observable } from 'rxjs/Rx';
import { getWinner, getBlockId } from 'containers/TicTacToe/utils';
import {
    SET_GAME_SCALE,
    SET_WINNER_CONDITION,
    SET_BLOCK_VALUE,
    SET_WINNER,
    SET_IS_SINGLE_PLAYER,
    CROSS,
} from './constants';
import {
    setInit,
    setWinner,
    setBlockValue,
} from './actions';

const setGameScaleInitEpic = (action$, store) =>
    action$.ofType(SET_GAME_SCALE).switchMap(() => {
        return Observable.of(setInit());
    });

const setWinnerConditionInitEpic = (action$, store) =>
    action$.ofType(SET_WINNER_CONDITION).switchMap(() => {
        return Observable.of(setInit());
    });

const setIsWinEpic = (action$, store) =>
    action$.ofType(SET_BLOCK_VALUE).switchMap(() => {
        const tictactoeState = store.value.get('tictactoe');
        const blocks = tictactoeState.get('blocks');
        const winnerCondition = tictactoeState.get('winnerCondition');
        const gameScale = tictactoeState.get('gameScale');
        const isWin = getWinner(blocks, gameScale, winnerCondition);
        return Observable.of(setWinner(isWin));
    });

const setSinglePlayEpic = (action$, store) =>
    action$
        .ofType(SET_WINNER)
        .debounceTime(300)
        .switchMap(() => {
            const tictactoeState = store.value.get('tictactoe');
            if (
                tictactoeState.get('isSinglePlayer') &&
                tictactoeState.get('currentRole') === CROSS &&
                !tictactoeState.getIn(['isWin', 'isGameFinished'])
            ) {
                const id = getBlockId(tictactoeState.get('blocks'));
                const currentRole = CROSS;
                return Observable.of(setBlockValue(id, currentRole));
            }
            return Observable.empty();
        });

const setOnPlayModeToggle = (action$, store) =>
    action$.ofType(SET_IS_SINGLE_PLAYER).switchMap(() => {
        const tictactoeState = store.value.get('tictactoe');
        const isWin = getWinner(tictactoeState.get('blocks'));
        return Observable.of(setWinner(isWin));
    });

export default [
    setGameScaleInitEpic,
    setWinnerConditionInitEpic,
    setIsWinEpic,
    setSinglePlayEpic,
    setOnPlayModeToggle,
];
