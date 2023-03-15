import View from "./view.js";
import Store from "./store.js";

// window.addEventListener("load", App.init); //Load until the entire html opened
//0th index player 1 and 1th index player 2

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];
function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  function initView() {
    view.closeAll();
    view.closeMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves); //reinitialized the moves
  }

  window.addEventListener("storage", () => {
    console.log("State change");
    initView();
  });

  initView();

  view.bindGameResetEvent((event) => {
    store.reset(); //reset the state

    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    ); // Comparing the square

    //if it is true then we return early
    if (existingMove) {
      return;
    }

    //place an icon of the current player in a square
    view.handlePlayerMove(square, store.game.currentPlayer);

    //Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : `Tie ツ`
      );
      return; //if the game complete we simply return this for not going to next line.
    }

    // Set the next player's turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
